import mongoose from "mongoose";
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken'
const doctorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    licenseNumber: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    image: {
        type: String,
    
    },
    speciality: {
        type: String,
        required: true
    },
    degree:{
        type: String,
        required: true
    },
    experience: {
        type: String,
        required: true
    },
    about: {
        type: String,
        required: true
    },
    available: {
        type: Boolean,
        required: true
    },
    fee: {
        type: Number,
        required: true
    },
    address: {
        type: Object,
        required: true
    },
    slots_booked: {
        type: Object,
        default: {}
    },
    refreshToken: {
        type: String
    }
}, {minimize: false, timestamps: true})
doctorSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10); // or 5
  next();
});
doctorSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}
doctorSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
console.log(`Access token d : ${process.env.ACCESS_TOKEN_SECRET}`)

doctorSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id : this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}
export const Doctor = mongoose.model("Doctor", doctorSchema )