//Creating API for adding doctor
import { ApiResponse } from "../utils/apiRespnse.js";
import { apiError } from "../utils/apiError.js";
import { uploadonCloudinary } from "../utils/cloudinary.js";
import { Doctor } from "../models/doctor.model.js";
import jwt from "jsonwebtoken"
import { Appointment } from "../models/appointment.model.js";
import { User } from "../models/user.model.js";
//adddoctor
const addDoctor = async(req, res) => {
    const {name, email, password, speciality, degree, experience, about, fee, address, licenseNumber} =req.body
    if(!name || !email ||  !password || !speciality || !degree || !experience || !about || !fee || !address){
        throw new apiError(401, "Fields are required")
    }
    //checking if the user already exists or not
    const userExist = await Doctor.findOne({email})
    if(userExist){
        throw  new apiError(401, "User already exists in the Database")
    }
    
    const imageLocalPath = req.file
    console.log("req.file", req.file)
    if(!imageLocalPath){
        throw new apiError(401, "Image file not uploaded")
    }
    const image = await uploadonCloudinary(imageLocalPath.path)
    if(!image){
        throw new apiError(501, "File upload failed,try again")
    }
        
    const doctor = new Doctor({
        name: `Dr. ${name}`,
        email,
        licenseNumber,
        password,
        speciality,
        degree,
        experience,
        about,
        fee,
        available: true,
        address: JSON.parse(address),
        image: image.url,
    })
    await doctor.save()
    const createdDoctor = await Doctor.findById(doctor._id).select("-password -refreshToken")
    if(!createdDoctor){
        throw new  apiError(501, "Something went wrong, try Again!")
    }

    return res.status(201).json(
        new ApiResponse(200, createdDoctor, "Doctor Registered")
    )
}

//API for Admin login
const loginAdmin = async(req, res) => {
    try {
        const {email, password} = req.body
        if(!email || !password){
            throw new apiError(401, "Email and Password required for Admin login")
        }
        if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){
            const accessToken = jwt.sign({email}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: process.env.ACCESS_TOKEN_EXPIRY}) 
            console.log(accessToken)
            const refreshToken = jwt.sign({email}, process.env.REFRESH_TOKEN_SECRET, {expiresIn: process.env.REFRESH_TOKEN_EXPIRY})
            const options = {
                httpOnly: true,
                secure: true
            }
            
            return res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", refreshToken, options).json(new ApiResponse(200, {  accessToken , refreshToken }, "Admin logged in Successfully"))
        }else{
            throw new apiError(401, "Invalid Login credential")
        }
    } catch (error) {
        console.log(error)
        res.status(401).json(new apiError(401, error?.message || "Login Failed"));
    }
}
//api to get all doctors list for admin panel
const allDoctor = async(req, res) => {
    const doctors = await Doctor.find().select("-password -refreshToken")
    if(!doctors){
        throw new apiError(501, "Failed to Fetch all Doctors, try Again!")
    }
    return res.status(200).json(new ApiResponse(200,  doctors, "Data Fetched"))
}

//api to get all appointments list
const appointmentsAdmin = async(req, res) => {
    try {
        const appointment = await Appointment.find({}).populate("userData", "name image dob").populate("docData", "name image speciality fee")
        res.status(200).json(new ApiResponse(200, appointment))
    } catch (error) {
        console.log(error)
        throw new apiError(401, "Error getting All Appointments")
    }
}
//api to cancel appointment
const appointmentCancel = async(req, res) => {
    try {
        
        const {appointmentId} = req.body
        const appointmentData = await Appointment.findById(appointmentId)
        //verify appointment user
        await Appointment.findByIdAndUpdate(appointmentId, {cancelled: true})
        //now if the appointment is cancelled therefore now the slotdate and slottime will be made available for doctor
        const {docId, slotDate, slotTime} = appointmentData
        const doctorData = await Doctor.findById(docId)
        let slots_booked = doctorData.slots_booked
        slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)
        await Doctor.findByIdAndUpdate(docId, {slots_booked})
        res.status(200).json(new ApiResponse(200, "Appointment Cancelled"))
    } catch (error) {
        console.log(error)
        throw new apiError(401, "Unable to Cancel your Appointment")
    }
}


const adminDashboard = async (req, res) => {
  try {
    const search = req.query.search || "";

    // Search-filtered results
    const doctors = await Doctor.find({
      name: { $regex: search, $options: "i" }
    });

    const users = await User.find({
      name: { $regex: search, $options: "i" }
    });

    const appointments = await Appointment.find({})
      .populate('userData', 'name image dob')
      .populate('docData', 'name image speciality fee');

    // Today's date
    const today = new Date();
    const todayDate = today.getDate().toString().padStart(2, '0') + '/' +
                      (today.getMonth() + 1).toString().padStart(2, '0') + '/' +
                      today.getFullYear();
    const todayISO = today.toISOString().split('T')[0];

    // Aggregated values
    const todaysAppointments = appointments.filter(app => app.slotDate === todayDate);
    const completedAppointments = appointments.filter(app => app.isCompleted);
    const cancelledAppointments = appointments.filter(app => app.cancelled);

    const totalFee = completedAppointments.reduce((sum, app) => sum + (app.amount || 0), 0);

    // Most consulted doctor
    const doctorCountMap = {};
    appointments.forEach(app => {
      if (doctorCountMap[app.docId]) doctorCountMap[app.docId]++;
      else doctorCountMap[app.docId] = 1;
    });
    const mostConsultedDocId = Object.entries(doctorCountMap).sort((a, b) => b[1] - a[1])[0]?.[0];
    const mostConsultedDoctor = doctors.find(doc => doc._id.toString() === mostConsultedDocId);

    // New this week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(today.getDate() - 7);
    const newPatients = users.filter(user => new Date(user.createdAt) >= oneWeekAgo);
    const newDoctors = doctors.filter(doc => new Date(doc.createdAt) >= oneWeekAgo);

    // Returning vs New Patients
    const patientVisitMap = {};
    appointments.forEach(app => {
      const id = app.userId.toString();
      if (patientVisitMap[id]) patientVisitMap[id]++;
      else patientVisitMap[id] = 1;
    });
    const returningPatients = Object.values(patientVisitMap).filter(count => count > 1).length;
    const newPatientCount = Object.values(patientVisitMap).filter(count => count === 1).length;

    // Doctors per Patient
    const doctorsPerPatient = doctors.length && users.length
      ? (doctors.length / users.length).toFixed(2)
      : 0;

    // Doctors added today
    const doctorsAddedToday = doctors.filter(doc =>
      new Date(doc.createdAt).toISOString().startsWith(todayISO)
    ).length;

    // Monthly & Yearly Revenue
    const revenueByMonth = {};
    const revenueByYear = {};

    completedAppointments.forEach(app => {
      const dateObj = new Date(app.createdAt);
      const monthKey = `${dateObj.getFullYear()}-${(dateObj.getMonth() + 1).toString().padStart(2, '0')}`;
      const yearKey = `${dateObj.getFullYear()}`;

      revenueByMonth[monthKey] = (revenueByMonth[monthKey] || 0) + app.amount;
      revenueByYear[yearKey] = (revenueByYear[yearKey] || 0) + app.amount;
    });

    const avgMonthlyRevenue = Object.values(revenueByMonth).length
      ? Math.round(Object.values(revenueByMonth).reduce((a, b) => a + b, 0) / Object.values(revenueByMonth).length)
      : 0;

    const avgYearlyRevenue = Object.values(revenueByYear).length
      ? Math.round(Object.values(revenueByYear).reduce((a, b) => a + b, 0) / Object.values(revenueByYear).length)
      : 0;

    // Final Dashboard Data
    const dashdata = {
      doctors: doctors.length,
      appointment: appointments.length,
      patients: users.length,
      latestAppointment: [...appointments].reverse().slice(0, 5),
      todaysAppointments: todaysAppointments.length,
      completedAppointments: completedAppointments.length,
      cancelledAppointments: cancelledAppointments.length,
      totalFeeFromCompletedAppointments: totalFee,
      mostConsultedDoctor: mostConsultedDoctor || null,
      newPatientsThisWeek: newPatients.length,
      newDoctorsThisWeek: newDoctors.length,
      patientVisitRatio: {
        returning: returningPatients,
        new: newPatientCount
      },
      doctorsPerPatient,
      doctorsAddedToday,
      avgMonthlyRevenue,
      avgYearlyRevenue,
      searchResults: {
        doctors,
        patients: users
      }
    };

    return res.status(200).json(new ApiResponse(200, dashdata, "Dashboard Data Fetched"));
  } catch (error) {
    console.log(error);
    return res.status(500).json(new ApiResponse(500, null, "Unable to get Dashboard Data"));
  }
};



export { addDoctor, loginAdmin , allDoctor, appointmentsAdmin, appointmentCancel, adminDashboard}