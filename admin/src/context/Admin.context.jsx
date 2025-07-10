import axios from "axios";
import { createContext, useState } from "react";
import { toast } from "react-toastify";

export const AdminContext = createContext()

const AdminContextProvider = (props) => {
    //on reloading the web page the state variable are getting reset but the refreshTokenn and accessTokens are still present in local storage
    const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refreshToken') ? localStorage.getItem('refreshToken') : '')
    const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken') ? localStorage.getItem('accessToken') : '')
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [doctors, setDoctors] = useState([])
    const [appointments, setAppointments] = useState([])
    const [dashData, setDashData] = useState(false)
    const getAllDoctors = async() => {
        try {
            const {data}= await axios.post(backendUrl + '/api/v1/admin/getdoctor', {}, {headers: {
                Authorization: `Bearer ${accessToken}`
            }})
            if(data.success){
                setDoctors(data.data)
                console.log("Here")
                console.log(data.data)
            }else{
                toast.error("Somethong went wrong, Unable to Fetch Doctors!")
            }
        } catch (error) {
            toast.error(error.message ? error.message : "Something went wrong, Unable to fetch doctor's data try again later!")
        }
    }
    const changeAvailability = async(docId) => {
        try {
            const {data} = await axios.post(backendUrl+'/api/v1/admin/changeAvailability', {docId}, {headers: {
                Authorization: `Bearer ${accessToken}`
            }})
            if(data.success){
                toast.success("Availability Changed")
                getAllDoctors()
            }else{
                toast.error("Something went wrong, Unable to change Availability")
            }
        } catch (error) {
            toast.error("Unable to change Availability")
        }
    }
    const getAllAppointment = async() => {
        try {
            const {data} = await axios.get(backendUrl + '/api/v1/admin/appointments', {headers: {
                Authorization: `Bearer ${accessToken}`
            }})
            if(data.success){
                setAppointments(data.data)
                console.log(data.data)
            }else{
                toast.error("Unable to get Appontments, Try again later?")
            }
        } catch (error) {
            
        }
    }
    const cancelAppointment = async(appointmentId) => {
        try {
            const {data} = await axios.post(backendUrl + '/api/v1/admin/cancelappointment', {appointmentId}, {headers: {
                Authorization: `Bearer ${accessToken}`
            }})
            if(data.success){
                toast.success("Appointment Cancelled")
                getAllAppointment()
            } else{
                toast.error("Can't cancel Appointment")
            }
        } catch (error) {
            toast.error("Unable to Cancel Appointment")
        }
    }

    const getDashdata = async() => {
        try {
            const {data} = await axios.get(backendUrl + '/api/v1/admin/dashboard', {headers: {
                Authorization: `Bearer ${accessToken}`
            }})
            if(data.success){
                setDashData(data.data)
                console.log(data.data)
            } else{
                toast.error("Error to get Dashboard Data")
            }
        } catch (error) {
            
            toast.error("Error in getting dashboard data")
        }
    }

    const value = {
        accessToken, setAccessToken, backendUrl, refreshToken, setRefreshToken, doctors, getAllDoctors, changeAvailability, getAllAppointment, appointments, setAppointments
        , cancelAppointment, getDashdata, dashData
    }
    
    return (
        <AdminContext.Provider value = {value}>
            {props.children}
        </AdminContext.Provider>
    )
}

export default AdminContextProvider