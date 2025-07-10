import React, { useContext } from 'react'
import { AdminContext } from '../context/Admin.context'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets_admin/assets'
import { DoctorContext } from '../context/Doctor.context.jsx'

function Sidebar() {
    const {accessToken} = useContext(AdminContext)
    const {daccessToken} = useContext(DoctorContext)
  return (
    <div className='min-h-screen bg-white border-r'>
        {
            accessToken && <ul className='text-gray-800 mt-5'>
                <NavLink className={ ({isActive}) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-amber-100  border-r-8 border-amber-400' : ''}`} to={'/admin-dashboard'}>
                    <img src={assets.home_icon} alt='homeicon' />
                    <p>Dashboard</p>
                </NavLink>

                <NavLink className={ ({isActive}) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-amber-100 border-r-8 border-amber-400' : ''}`} to={'/all-appointments'}>
                    <img src={assets.appointment_icon} alt='homeicon' />
                    <p>Appointments</p>
                </NavLink>

                <NavLink className={ ({isActive}) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-amber-100 border-r-8 border-amber-400' : ''}`} to={'/add-doctor'}>
                    <img src={assets.add_icon} alt='homeicon' />
                    <p>Add Doctors</p>
                </NavLink>

                <NavLink className={ ({isActive}) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-amber-100 border-r-8 border-amber-400' : ''}`} to={'/doctor-list'}>
                    <img src={assets.people_icon} alt='homeicon' />
                    <p>Doctors List</p>
                </NavLink>
            </ul>
        }
        {
            daccessToken && <ul className='text-gray-800 mt-5'>
                <NavLink className={ ({isActive}) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-amber-100  border-r-8 border-amber-400' : ''}`} to={'/doctordashboard'}>
                    <img src={assets.home_icon} alt='homeicon' />
                    <p>Dashboard</p>
                </NavLink>

                <NavLink className={ ({isActive}) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-amber-100 border-r-8 border-amber-400' : ''}`} to={'/doctorappointments'}>
                    <img src={assets.appointment_icon} alt='homeicon' />
                    <p>Appointments</p>
                </NavLink>

                

                <NavLink className={ ({isActive}) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-amber-100 border-r-8 border-amber-400' : ''}`} to={'/doctorprofile'}>
                    <img src={assets.people_icon} alt='homeicon' />
                    <p>Profile</p>
                </NavLink>
            </ul>
        }
    </div>
  )
}

export default Sidebar