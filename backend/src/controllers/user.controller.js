import { Appointment } from "../models/appointment.model.js"
import { Doctor } from "../models/doctor.model.js"
import { User } from "../models/user.model.js"
import { apiError } from "../utils/apiError.js"
import { ApiResponse } from "../utils/apiRespnse.js"
import { uploadonCloudinary } from "../utils/cloudinary.js"
const generateAccessandRefreshToken = async(userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
        user.refreshToken = refreshToken

        await user.save({validateBeforeSave: false}) //so before saving it will also require all the data again to disable this we need validateBeforeSave to be false
        return {accessToken, refreshToken}
    } catch (error) {
        throw new apiError(501, "Can't generate access and refreshToken")
    }
}


//api to register user
const registerUser = async(req, res) => {
    //Step-1 Get user details from frontend
    const {name, email, password, phone} = req.body
    //Step-2 Check if any of this is empty
    if(!name || !email || !password || !phone){
        throw new apiError(400, "All the fields are required")
    }
    //Step-3 Checking if the user already exists in the db 
    const existingUser = await User.findOne({email})
    if(existingUser){
        throw new apiError(400, "User already exists! Login")
    }
    const user = await User.create({
        name,
        email,
        password,
        phone,
        
    })

    const createdUser = await User.findById(user._id).select("-password -refreshToken")
    if(!createdUser){
        throw new apiError(500, "Something went wrong, Register Again")
    }
    const {accessToken, refreshToken} = await generateAccessandRefreshToken(user._id)
    const options = {
        httpOnly: true,
        secure: true
    }
    return res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", refreshToken, options).json(new ApiResponse(200, {user: createdUser, accessToken, refreshToken}, "User Registered and Loggedin Successfully"))
}

//api for user login
const userlogin = async(req, res) => {
    //take input from the user 
    try {
        const {email, password} = req.body
        if(!email || !password){
            throw new apiError(400, "Email and Password is required")
        }
        //now finding if the user exists in the database or not
        const user = await User.findOne({email})
        if(!user){
            throw new apiError(401, "User does not exist, Please Register")
        }
        const validatePassword = await user.isPasswordCorrect(password)
        if(!validatePassword){
            throw new apiError(401, "Incorrect Password")
        }
    
        //now creating access and refresh tokens
        const {accessToken, refreshToken} = await generateAccessandRefreshToken(user._id)
    
        const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
        const options = {
            httpOnly: true,
            secure: true
        }
        
        return res.status(200)
        .cookie("useraccessToken", accessToken, options)
        .cookie("userrefreshToken", refreshToken, options)
        .json(new ApiResponse(200, {user: loggedInUser, accessToken, refreshToken}, "User logged in Successfully"))
    } catch (error) {
        console.log("Error")
    }
}

//api to get current user
const getUser = async(req, res) =>{
    const user = req.user
    
    return res.status(200).json(new ApiResponse(200, user , "Current user fetched Successfully"))
}

//api to update user data
// const updateProfile = async(req, res) => {
//     const {name, phone, address, dob, gender} = req.body
//     const imageFile = req.file?.path
//     if(!name || !phone || !address || !dob || !gender){
//         throw new apiError(401, "Details are Required")
//     }
//     const image = await uploadonCloudinary(imageFile)
//     if(!image.url){
//         throw new apiError(401, "Error while uploading file on Cloduinary")
//     }
//     const user = await User.findByIdAndUpdate(req.user?._id, {
//         $set: {
//             name,
//             phone,
//             dob,
//             gender,
//             address: JSON.parse(address),
//             image: image.url
//         },
        
//     }, {new : true}).select("-password")

//     return res.status(200).json(new ApiResponse(200, user, "Profile updated successfully"))
// }

const updateProfile = async (req, res) => {
  const { name, phone, address, dob, gender } = req.body;
  const imageFile = req.file?.path;

  if (!name || !phone || !address || !dob || !gender) {
    throw new apiError(401, "Details are Required");
  }

  let imageUrl = null;

  if (imageFile) {
    const image = await uploadonCloudinary(imageFile);
    if (!image?.url) {
      throw new apiError(401, "Error while uploading file on Cloudinary");
    }
    imageUrl = image.url;
  }

  const updateData = {
    name,
    phone,
    dob,
    gender,
    address: JSON.parse(address),
  };

  if (imageUrl) {
    updateData.image = imageUrl;
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    { $set: updateData },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Profile updated successfully"));
};
//api to book appointment
const bookAppointment = async(req, res) => {
    try {
        const { docId, slotDate, slotTime} = req.body 
        const docData = await Doctor.findById(docId).select("-password -refreshToken")
        const userId = req.user._id
        if(!docData.available){
            throw new apiError(401, "Doctor is not Available for Appintment")
        }
        let slots_booked = docData.slots_booked
        //checking for slot availability
        if(slots_booked[slotDate]){
            if(slots_booked[slotDate].includes(slotTime)){
                throw new apiError(401, "Slot not available")
            } else{
                slots_booked[slotDate].push(slotTime)
            }
        }else{
            slots_booked[slotDate] = []
            slots_booked[slotDate].push(slotTime)
        }
        const userData = await User.findById(userId).select("-password -refreshToken")
        delete docData.slots_booked

        const appointmentData = await Appointment.create({
            
            userId,
            docId,
            userData,
            docData,
            amount: docData.fee,
            slotTime,
            slotDate,
            date: Date.now()
        })

        //save new slots data in doc data
        await Doctor.findByIdAndUpdate(docId, {slots_booked})
        return res.status(201).json(new ApiResponse(201,appointmentData, "Appointmernt booked"))

    } catch (error) {
        console.log("Error in Boking Appointment", error)
        throw new apiError(401, "Error in Booking Appointment")
    }
}

//api to get appointments by user
const listAppointment = async(req, res) => {
    try {
        const userId = req.user._id
        const appointments = await Appointment.find({userId}).populate('docData', '-password -refreshToken').populate('userData', '-password -refreshToken')

        res.status(200).json(new ApiResponse(200, {appointments}))
    } catch (error) {
        console.log("Can't fetch your Appointment Data")
        throw new apiError(401, "Can't get your Data")
    }
}

//api to cancel appointment
const cancelAppointment = async(req, res) => {
    try {
        const userId = req.user._id
        const {appointmentId} = req.body
        const appointmentData = await Appointment.findById(appointmentId)
        //verify appointment user
        if(appointmentData.userId.toString() !== userId.toString()){
            throw new apiError(401, "Unauthorized Action ")
        }
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

//integrating razorpay api

export {registerUser, userlogin, getUser, updateProfile, bookAppointment, listAppointment, cancelAppointment}