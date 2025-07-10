// components/AdminSidebar.jsx
import React from 'react'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets_admin/assets'

function AdminSidebar() {
  return (
    <ul className='text-gray-800 mt-5'>
      <NavLink className={({ isActive }) =>
        `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
          isActive ? 'bg-amber-100 border-r-8 border-amber-400' : ''
        }`}
        to="/admin-dashboard"
      >
        <img src={assets.home_icon} alt='Dashboard' />
        <p>Dashboard</p>
      </NavLink>

      <NavLink className={({ isActive }) =>
        `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
          isActive ? 'bg-amber-100 border-r-8 border-amber-400' : ''
        }`}
        to="/all-appointments"
      >
        <img src={assets.appointment_icon} alt='Appointments' />
        <p>Appointments</p>
      </NavLink>

      <NavLink className={({ isActive }) =>
        `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
          isActive ? 'bg-amber-100 border-r-8 border-amber-400' : ''
        }`}
        to="/add-doctor"
      >
        <img src={assets.add_icon} alt='Add Doctor' />
        <p>Add Doctors</p>
      </NavLink>

      <NavLink className={({ isActive }) =>
        `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
          isActive ? 'bg-amber-100 border-r-8 border-amber-400' : ''
        }`}
        to="/doctor-list"
      >
        <img src={assets.people_icon} alt='Doctors List' />
        <p>Doctors List</p>
      </NavLink>
    </ul>
  )
}

export default AdminSidebar
