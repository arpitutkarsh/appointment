import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
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
        default: "No Image"
    },
    address: {
        type: Object,
        default: {line: '', line2: ''}
    },
    gender: {
        type: String,
        default: "Not Selected"
    },
    dob: {
        type: String,
        default: "Not Given"
    },
    phone: {
        type: String,
        default: "0000000000"
    }, 
    refreshToken : {
        type: String
    }
}, {minimize: false, timestamps: true})
//hash the password
userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

//decrypt the password
userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

//generate access token
userSchema.methods.generateAccessToken = function(){
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
console.log(`Access token u: ${process.env.ACCESS_TOKEN_SECRET}`)

userSchema.methods.generateRefreshToken = function(){
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
export const User = mongoose.model("User", userSchema )