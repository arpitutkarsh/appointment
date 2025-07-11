import mongoose from 'mongoose'

const medicineSchema = new mongoose.Schema({
    name: { type: String, required: true },
    dosage: { type: String, required: true },
    frequency: { type: String, required: true },
    duration: { type: String, required: true }
})

const prescriptionSchema = new mongoose.Schema({
    appointmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment',
        required: true
    },
    prescriptionNumber: {
        type: String,
        required: false,
        unique: true,
    },
    pulseRate: { type: String, default: '0' },
    bp: { type: String, default: '0/0' },
    spo2: { type: String, default: '90%' },
    temperature: { type: String, default: '38' },

    doctor: {
        doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
        name: { type: String, required: true },
        specialization: { type: String },
        email: { type: String },
        phone: { type: String },
        address: { type: Object }
    },
    user: {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        name: { type: String, required: true },
        age: { type: Number },
        gender: { type: String },
        email: { type: String },
        phone: { type: String },
    },
    date: { type: String, required: true },   // From appointment.slotDate
    time: { type: String, required: true },   // From appointment.slotTime

    diagnosis: { type: String, required: true },
    lifestyle: { type: String, default: '' },
    tests: { type: String, default: '' },
    followUp: { type: String, default: '' },

    medicines: {
        type: [medicineSchema],
        required: true,
    },

    // ✅ NEW: General notes by the doctor
    notes: {
        type: String,
        default: '',
    },

    // ✅ NEW: Referral note if referred to another doctor or facility
    
}, { minimize: false, timestamps: true })

prescriptionSchema.pre('save', async function(next){
    if(this.prescriptionNumber) return next();
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const date = String(today.getDate()).padStart(2, '0')
    const dateString = `${year}${month}${date}`

    const start = new Date(year, today.getMonth(), today.getDate())
    const end = new Date(year, today.getMonth(), today.getDate() + 1)

    const count = await mongoose.model('Prescription').countDocuments({
        createdAt: { $gte: start, $lt: end }
    })

    const serial = String(count + 1).padStart(3, '0')
    this.prescriptionNumber = `PRS-RX/${dateString}/${serial}-A`

    next()
})

export const Prescription = mongoose.model("Prescription", prescriptionSchema)
