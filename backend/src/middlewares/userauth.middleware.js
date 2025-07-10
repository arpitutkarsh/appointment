import jwt from 'jsonwebtoken'
import { apiError } from '../utils/apiError.js'
import { ApiResponse } from '../utils/apiRespnse.js'
import { User } from '../models/user.model.js'
export const verifyUserJWT = async (req, res, next) => {
    console.log("A:::", process.env.ACCESS_TOKEN_SECRET)
    try {
        const token = req.cookies?.useraccessToken || req.header("Authorization")?.replace("Bearer ", "")
        console.log("💥 Token received:", token)

        if (!token) {
            throw new apiError(401, "Unauthorized Request")
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        console.log("✅ Decoded:", decodedToken)

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
        if (!user) {
            throw new apiError(401, "Invalid Access Token")
        }

        req.user = user
        next()
    } catch (error) {
        console.log("Token verification error:", error.message)
        return res.status(401).json(new ApiResponse(401, null, "Invalid Access Token"))
    }

}
