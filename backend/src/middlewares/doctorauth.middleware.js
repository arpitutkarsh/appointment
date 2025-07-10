import jwt from 'jsonwebtoken'
import { apiError } from '../utils/apiError.js'
import { ApiResponse } from '../utils/apiRespnse.js'
import { Doctor } from '../models/doctor.model.js'
export const verifyDoctorJWT = async (req, res, next) => {
    try {
        const token = req.cookies?.doctoraccessToken || req.header("Authorization")?.replace("Bearer ", "")
        if (!token) {
            throw new apiError(401, "Unauthorized Request")
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const doctor = await Doctor.findById(decodedToken?._id).select("-password -refreshToken")
        if (!doctor) {
            throw new apiError(401, "Invalid Access Token")
        }

        req.doctor = doctor
        next()
    } catch (error) {
        console.log("Token verification error:", error.message)
        return res.status(401).json(new ApiResponse(401, null, "Invalid Access Token"))
    }

}
