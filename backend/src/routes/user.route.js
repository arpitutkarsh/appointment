import express, { Router } from 'express'
import { bookAppointment, cancelAppointment, getUser, listAppointment, registerUser, updateProfile, userlogin } from '../controllers/user.controller.js'
import { verifyUserJWT } from '../middlewares/userauth.middleware.js'
import { upload } from '../middlewares/multer.middleware.js'
import { getPrescription } from '../controllers/prescription.controller.js'
const router = Router()
router.route('/register').post(registerUser)
router.route('/login').post(userlogin)

router.route('/getuser').get(verifyUserJWT, getUser)
router.route('/update').post(upload.single('image'),verifyUserJWT,updateProfile)
router.route('/appointment').post(verifyUserJWT, bookAppointment)
router.route('/listappointment').get(verifyUserJWT,listAppointment)
router.route('/cancel').post(verifyUserJWT,cancelAppointment)
router.route('/prescription').post(getPrescription)
export default router