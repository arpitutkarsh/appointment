import jwt from 'jsonwebtoken'
import { apiError } from '../utils/apiError.js'


export const verifyJWT = async(req, res, next) => {
    console.log(process.env.ACCESS_TOKEN_SECRET)
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace('Bearer ', "")
        if(!token){
            throw new apiError(401, "Unauthorized Access")
        }
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        console.log(decodedToken)
        if(decodedToken.email !== process.env.ADMIN_EMAIL){
            throw new apiError(401, "Invalid Access Token!")
        }

        next()
    } catch (error) {
        throw new apiError(401, error?.message || "INVALID ACCESS TOKEN")
        
    }
}