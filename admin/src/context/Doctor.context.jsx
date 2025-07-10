import { createContext, useState, useEffect } from "react";
import axios from 'axios'
import { toast } from 'react-toastify'
export const DoctorContext = createContext()

const DoctorContextProvider = (props) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [daccessToken, setDAccessToken] = useState(localStorage.getItem('doctorAccessToken') ? localStorage.getItem('doctorAccessToken') : '')
    const [drefreshToken, setDRefreshToken] = useState(localStorage.getItem('doctorRefreshToken') ? localStorage.getItem('doctorRefreshToken') : '')
    const [appointments, setAppointments] = useState([])
    useEffect(() => {
        console.log("Updated appointments:", appointments);
    }, [appointments]);
    const getAppointments = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/v1/doctor/appointment', {
                headers: {
                    Authorization: `Bearer ${daccessToken}`
                }
            })
            if (data.success) {
                setAppointments(data.data)
                
            } else {
                toast.error("Unable to fetch yoour Appointments !")
            }
        } catch (error) {
            console.log(error)
            toast.error("Error occurred in getting Appointments")
        }
    }

    const completeAppointment = async(appointmentId) => {
        try {
            const {data} = await axios.post(backendUrl + '/api/v1/doctor/complete', {appointmentId}, {headers: {
                Authorization: `Bearer ${daccessToken}`
            }})
            if(data.success){
                toast.success("Marked Completed")
                getAppointments()

            } else{
                toast.error("Can't Mark Completed")
            }
        } catch (error) {
            console.log(error)
            toast.error("Error occurred in marking Appointments")
        }
    }
    const cancelAppointment = async(appointmentId) => {
        try {
            const {data} = await axios.post(backendUrl + '/api/v1/doctor/cancel', {appointmentId}, {headers: {
                Authorization: `Bearer ${daccessToken}`
            }})
            if(data.success){
                toast.success("Cancelled")
                getAppointments()

            } else{
                toast.error("Can't Mark Cancelled")
            }
        } catch (error) {
            console.log(error)
            toast.error("Error occurred in Cancelling Appointments")
        }
    }
    const writePrescription = async(appointmentId, prescriptionData) => {
        try {
            const {data} = await axios.post(backendUrl+'/api/v1/doctor/prescription', {appointmentId, ...prescriptionData}, {headers: {
                Authorization: `Bearer ${daccessToken}`
            }})
            if(data.success){
                toast.success("Prescription Created Successfully")
                getAppointments()
                return true; // indicate success
            } else{
                toast.error("Failed to create Prescription")
            }
        } catch (error) {
            console.log(error)
            toast.error("Error Creating Prescription")
        }
    }
    const [dashData, setDashData] = useState(false)
    const getDashboard = async () => {
        try {
            const {data} = await axios.get(backendUrl+'/api/v1/doctor/dashboard', {headers: {
                Authorization: `Bearer ${daccessToken}`
            }})
            if(data.success){
                console.log(data.data)
                setDashData(data.data)
            } else{
                toast.error("SOmething went wrong @ Dashboard")
            }
        } catch (error) {
            console.log(error)
            toast.error("Unable to get your Dashboard Data")
        }
    }
    const [profileData, setProfileData] = useState(false)
    const getProfileData = async() => {
        try {
            const {data} = await axios.get(backendUrl+'/api/v1/doctor/profile', {headers: {
                Authorization: `Bearer ${daccessToken}`
            }})
            if(data.success){
                setProfileData(data.data)
                console.log(data.data)
            } else{
                console.log(error)
                toast.error("Unable to get your Profile")
            }
        } catch (error) {
            console.log(error)
            toast.error("Unable to get your Profile")
        }
    }
    const value = {
        daccessToken, setDAccessToken, drefreshToken, setDRefreshToken, backendUrl, getAppointments, appointments, setAppointments, cancelAppointment, completeAppointment, writePrescription
        ,getDashboard,dashData, setDashData, getProfileData, profileData, setProfileData
    }
    return (
        <DoctorContext.Provider value={value}>
            {props.children}
        </DoctorContext.Provider>
    )
}

export default DoctorContextProvider