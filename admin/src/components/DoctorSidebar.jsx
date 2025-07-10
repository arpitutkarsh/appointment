// components/DoctorSidebar.jsx
import React from 'react'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets_admin/assets'

function DoctorSidebar() {
  return (
    <ul className='text-gray-800 mt-5'>
      <NavLink className={({ isActive }) =>
        `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
          isActive ? 'bg-amber-100 border-r-8 border-amber-400' : ''
        }`}
        to="/doctordashboard"
      >
        <img src={assets.home_icon} alt='Dashboard' />
        <p>Dashboard</p>
      </NavLink>

      <NavLink className={({ isActive }) =>
        `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
          isActive ? 'bg-amber-100 border-r-8 border-amber-400' : ''
        }`}
        to="/doctorappointments"
      >
        <img src={assets.appointment_icon} alt='Appointments' />
        <p>Appointments</p>
      </NavLink>

      <NavLink className={({ isActive }) =>
        `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
          isActive ? 'bg-amber-100 border-r-8 border-amber-400' : ''
        }`}
        to="/doctorprofile"
      >
        <img src={assets.people_icon} alt='Profile' />
        <p>Profile</p>
      </NavLink>
    </ul>
  )
}

export default DoctorSidebar
