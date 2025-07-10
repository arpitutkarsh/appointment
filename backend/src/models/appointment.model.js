import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  docId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true
  },
  slotDate: {
    type: String, // format: DD/MM/YYYY
    required: true
  },
  slotTime: {
    type: String,
    required: true
  },
  userData: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  docData: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  date: {
    type: String, // changed from Number to String
    required: true
  },
  cancelled: {
    type: Boolean,
    default: false
  },
  payment: {
    type: Boolean,
    default: false
  },
  isCompleted: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });


export const Appointment = mongoose.model("Appointment", appointmentSchema);
