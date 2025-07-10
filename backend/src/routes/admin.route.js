import express, { Router } from 'express'
import { addDoctor, adminDashboard, allDoctor, appointmentCancel, appointmentsAdmin, loginAdmin } from '../controllers/admin.controller.js'
import { upload } from '../middlewares/multer.middleware.js'
import { verifyJWT } from '../middlewares/auth.middleware.js'
import { changeAvailability } from '../controllers/doctor.controller.js'
const router = Router()

router.route('/adddoctor').post(verifyJWT, upload.single('image'), addDoctor)
router.route('/getdoctor').post(verifyJWT, allDoctor)
router.route('/login').post(loginAdmin)
router.route('/changeAvailability').post(verifyJWT, changeAvailability)
router.route('/appointments').get(verifyJWT, appointmentsAdmin)
router.route('/cancelappointment').post(verifyJWT, appointmentCancel)
router.route('/dashboard').get(verifyJWT, adminDashboard)
//router.route('/adminlogin').post(adminLogin)
export default router 