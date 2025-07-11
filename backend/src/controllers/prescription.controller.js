import { apiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiRespnse.js";
import { Doctor } from "../models/doctor.model.js";
import { Appointment } from "../models/appointment.model.js";
import { User } from "../models/user.model.js";
import { Prescription } from "../models/prescription.model.js";

const createPrescription = async (req, res) => {
  try {
    const {
      appointmentId,
      diagnosis,
      lifestyle,
      tests,
      followUp,
      medicines,
      pulseRate,
      bp,
      spo2,
      temperature,
      notes, // ✅ new
      
    } = req.body;

    // Validate required fields
    if (!appointmentId || !diagnosis || !Array.isArray(medicines) || medicines.length === 0) {
      throw new apiError(400, "Diagnosis and at least one medicine are required");
    }

    // Fetch appointment
    const appointment = await Appointment.findById(appointmentId)
      .populate('docId', "name email speciality address phone")
      .populate('userId');

    if (!appointment) {
      throw new apiError(404, "Appointment not found");
    }

    const doctor = appointment.docId;
    const user = appointment.userId;

    // Create prescription
    const prescription = new Prescription({
      appointmentId: appointment._id,
      doctor: {
        doctorId: doctor._id,
        name: doctor.name,
        specialization: doctor.speciality,
        email: doctor.email,
        phone: doctor.phone,
        address: doctor.address
      },
      user: {
        userId: user._id,
        name: user.name,
        age: user.age,
        gender: user.gender,
        email: user.email,
        phone: user.phone,
      },
      date: appointment.slotDate,
      time: appointment.slotTime,
      diagnosis,
      lifestyle: lifestyle || '',
      tests: tests || '',
      followUp: followUp || '',
      notes: notes || '', // ✅ add notes
      
      medicines,
      pulseRate: pulseRate || '0',
      bp: bp || '0/0',
      spo2: spo2 || '90%',
      temperature: temperature || '38',
    });

    await prescription.save();

    return res.status(201).json(
      new ApiResponse(201, prescription, "Prescription created successfully")
    );

  } catch (error) {
    console.error("Error in createPrescription:", error);
    return res.status(error.statusCode || 500).json(
      new ApiResponse(error.statusCode || 500, null, error.message || "Unable to create prescription")
    );
  }
};

const getPrescription = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    if (!appointmentId) {
      throw new apiError(401, "No Appointment Found");
    }

    const prescription = await Prescription.findOne({ appointmentId });

    if (!prescription) {
      throw new apiError(401, "No Prescription Found");
    }

    return res.status(200).json(new ApiResponse(200, prescription, "Successfully Found Prescription"));

  } catch (error) {
    console.log("Error in getPrescription:", error);
    return res.status(error.statusCode || 500).json(
      new ApiResponse(error.statusCode || 500, null, error.message || "Error Fetching Prescription")
    );
  }
};

export { createPrescription, getPrescription };
