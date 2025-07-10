import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"


const app = express()
app.use(cors())
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true })); 
import adminRouter from './routes/admin.route.js'
import doctorRouter from './routes/doctor.route.js'
import userRouter from './routes/user.route.js'
app.use('/api/v1/admin', adminRouter)
app.use('/api/v1/doctor', doctorRouter)
app.use('/api/v1/user', userRouter)
export {app}