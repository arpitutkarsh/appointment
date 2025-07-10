import { apiError } from "../utils/apiError.js"
import { Doctor } from "../models/doctor.model.js"
import { ApiResponse } from "../utils/apiRespnse.js"
import { Appointment } from "../models/appointment.model.js"
import { uploadonCloudinary } from "../utils/cloudinary.js"


//generating access and refresh token
const generateAccessandRefreshToken = async (doctorId) => {
  try {
    const doctor = await Doctor.findById(doctorId)
    const accessToken = doctor.generateAccessToken()
    const refreshToken = doctor.generateRefreshToken()
    doctor.refreshToken = refreshToken
    await doctor.save({ validateBeforeSave: false })
    return { accessToken, refreshToken }
  } catch (error) {
    throw new apiError(501, "Can't generate Doctor's access and refreshToken")
  }
}
//api to change availability of doctor
//we are doing this here because we need this to be available in both admin and doctor panel as well
const changeAvailability = async (req, res) => {
  try {
    const { docId } = req.body
    const docData = await Doctor.findById(docId)
    await Doctor.findByIdAndUpdate(docId, { available: !docData.available })
    res.json(new ApiResponse(201, "Availability Changed"))
  } catch (error) {
    throw new apiError(401, "Something went wrong")
  }
}



const doctorList = async (req, res) => {
  try {
    const doctors = await Doctor.find().select("-password -email");

    // ✅ wrap doctors in a data object
    const response = new ApiResponse(200, { doctors }, "Doctors Fetched");
    res.status(200).json(response);

  } catch (error) {
    console.log(error);
    res.status(500).json(new ApiResponse(500, null, "Failed to fetch doctors"));
  }
};

//api for doctor's login
const loginDoctor = async (req, res) => {
  try {
    //getting email id and password from body
    const { email, password } = req.body
    const doctor = await Doctor.findOne({ email })
    if (!doctor) {
      throw new apiError(401, "Invalid Email ID")
    }
    const isMatch = await doctor.isPasswordCorrect(password)
    if (!isMatch) {
      throw new apiError(401, "Invalid Password")
    }
    const { accessToken, refreshToken } = await generateAccessandRefreshToken(doctor._id)
    const loggedinDoctor = await Doctor.findById(doctor._id).select("-password -refreshToken")
    const options = {
      httpOnly: true,
      secure: true
    }
    return res.status(200)
      .cookie("doctoraccessToken", accessToken, options)
      .cookie("doctorrefreshToken", refreshToken, options)
      .json(new ApiResponse(200, { doctor: loggedinDoctor, accessToken, refreshToken }, "Doctor logged in Successfully"))

  } catch (error) {
    console.log(error);
    res.status(500).json(new ApiResponse(500, null, "Unable to Login"));
  }
}
//api to get doctor's appointment fr doctor pannel
const doctorAppointment = async (req, res) => {
  try {
    const docId = req.doctor._id
    const appointments = await Appointment.find({ docId }).populate("userData", "name image dob gender address").populate("docData", "speciality name degree address")

    res.status(201).json(new ApiResponse(201, appointments, "Appointment Fetched"))
  } catch (error) {
    console.log(error);
    res.status(500).json(new ApiResponse(500, null, "Unable to get your Appointments"));
  }
}

//api to mark appointment completed
const completed = async (req, res) => {
  try {
    const docId = req.doctor._id.toString();
    const { appointmentId } = req.body;

    const appointmentData = await Appointment.findById(appointmentId);

    if (!appointmentData) {
      throw new apiError(404, "Appointment not found");
    }

    if (appointmentData.docId.toString() !== docId) {
      console.log("docId mismatch:", appointmentData.docId.toString(), "!=", docId);
      throw new apiError(403, "Unauthorized: You can't update this appointment");
    }

    await Appointment.findByIdAndUpdate(appointmentId, {
      isCompleted: true
    });

    return res.status(200).json(new ApiResponse(200, null, "Appointment Completed"));
  } catch (error) {
    console.log("Completed error:", error);
    res.status(error.statusCode || 500).json(new ApiResponse(error.statusCode || 500, null, error.message || "Unable to mark your Appointment"));
  }
};


const cancel = async (req, res) => {
  try {
    const docId = req.doctor._id.toString(); // Ensure it's a string
    const { appointmentId } = req.body;

    const appointmentData = await Appointment.findById(appointmentId);

    if (!appointmentData) {
      throw new apiError(404, "Appointment not found");
    }

    if (appointmentData.docId.toString() !== docId) {
      console.log("Cancel -> docId mismatch:", appointmentData.docId.toString(), "!=", docId);
      throw new apiError(403, "Unauthorized: You can't cancel this appointment");
    }

    await Appointment.findByIdAndUpdate(appointmentId, {
      cancelled: true
    });

    return res.status(200).json(new ApiResponse(200, null, "Appointment Cancelled"));
  } catch (error) {
    console.log("Cancel error:", error);
    res.status(error.statusCode || 500).json(
      new ApiResponse(error.statusCode || 500, null, error.message || "Unable to cancel your Appointment")
    );
  }
};

//api to get dashboard data for doctor
const doctorDashboard = async (req, res) => {
  try {
    const docId = req.doctor._id.toString();

    const appointments = await Appointment.find({ docId })
      .populate('docData', 'name image degree')
      .populate('userData', '-password -refreshToken -email');

    // Calculate earnings only for completed and NOT cancelled appointments
    let earnings = 0;
    appointments.forEach((item) => {
      if (item.isCompleted && !item.cancelled) {
        earnings += item.amount;
      }
    });

    // Count unique patients
    let patients = [];
    appointments.forEach((item) => {
      if (!patients.includes(item.userId)) {
        patients.push(item.userId);
      }
    });

    const dashData = {
      earnings,
      appointments: appointments.length,
      patients: patients.length,
      latestAppointments: appointments.slice().reverse().slice(0, 5),
    };

    res.status(200).json(new ApiResponse(200, dashData));
  } catch (error) {
    console.log(error);
    throw new apiError(401, "Can't get your Dashboard Data");
  }
};

//api to get doctors prfile
const doctorProfile = async (req, res) => {
  try {
    const docId = req.doctor._id.toString();
    const profileData = await Doctor.findById(docId).select("-password -refreshToken")
    res.status(200).json(new ApiResponse(200, profileData))
  } catch (error) {
    console.log(error);
    throw new apiError(401, "Can't get your Profile");
  }
}

//api to update doctor profile data from doctor panel
const updateDoctor = async (req, res) => {
  try {
    const docId = req.doctor._id.toString();
    const { fee, address, available, about } = req.body
    await Doctor.findByIdAndUpdate(docId, {
      fee, address, available, about
    })
    res.status(200).json(new ApiResponse(200, "Profile Updated"))
  } catch (error) {
    console.log(error);
    throw new apiError(401, "Can't Update your Profile");
  }
}

const registerDoctor = async (req, res) => {
  //step 1- Get doctor details from frontend
  const { name, email, password, speciality, degree, experience, about, fee, address, licenseNumber } = req.body
  if (!name || !email || !password || !speciality || !degree || !experience || !about || !fee || !address) {
    throw new apiError(401, "All the Fields are required")
  }
  //check if the doctor exist in the database or not
  const doctorExist = await Doctor.findOne({ email })
  if (doctorExist) {
    throw new apiError(401, "Doctor already exists in the Database")
  }
  const imageLocalPath = req.file
  if (!imageLocalPath) {
    throw new apiError(401, "Image file not uploaded")
  }
  const image = await uploadonCloudinary(imageLocalPath.path)
  if (!image) {
    throw new apiError(501, "File upload failed,try again")
  }

  const doctor = new Doctor({
    name: `Dr. ${name}`,
    licenseNumber,
    email,
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
  if (!createdDoctor) {
    throw new apiError(501, "Something went wrong, try Again!")
  }

  return res.status(201).json(
    new ApiResponse(200, createdDoctor, "Doctor Registered")
  )

}
export { changeAvailability, doctorList, loginDoctor, doctorAppointment, cancel, completed, doctorDashboard, doctorProfile, updateDoctor, registerDoctor }