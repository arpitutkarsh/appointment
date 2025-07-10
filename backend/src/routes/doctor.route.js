import express, { Router } from 'express'
import { cancel, completed, doctorAppointment, doctorDashboard, doctorList, doctorProfile, loginDoctor, registerDoctor, updateDoctor } from '../controllers/doctor.controller.js'
import { verifyDoctorJWT } from '../middlewares/doctorauth.middleware.js'
import { createPrescription } from '../controllers/prescription.controller.js'
import { upload } from '../middlewares/multer.middleware.js'


const router = Router()
router.route('/list').get(doctorList)
router.route('/login').post(loginDoctor)
router.route('/appointment').get(verifyDoctorJWT, doctorAppointment)
router.route('/cancel').post(verifyDoctorJWT, cancel)
router.route('/complete').post(verifyDoctorJWT, completed)
router.route('/prescription').post(verifyDoctorJWT, createPrescription)
router.route('/dashboard').get(verifyDoctorJWT, doctorDashboard)
router.route('/profile').get(verifyDoctorJWT, doctorProfile)
router.route('/update').post(verifyDoctorJWT, updateDoctor)
router.route('/register').post(upload.single('image'),registerDoctor)
export default router