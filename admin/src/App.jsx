import React, { useContext } from 'react'
import Login from './pages/Login.jsx'
import {ToastContainer, toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AdminContext } from './context/Admin.context.jsx'
import Navbar from './components/Navbar.jsx'
import Sidebar from './components/Sidebar.jsx'
import { Route, Routes } from 'react-router-dom'
import Dashboard from './pages/Admin/Dashboard.jsx'
import Appointments from './pages/Admin/Appointments.jsx'
import Adddoctor from './pages/Admin/Adddoctor.jsx'
import Doctorlist from './pages/Admin/Doctorlist.jsx'
import { DoctorContext } from './context/Doctor.context.jsx'
import DoctorDashboard from './pages/Doctor/DoctorDashboard.jsx'
import DoctorAppointment from './pages/Doctor/DoctorAppointment.jsx'
import DoctorProfile from './pages/Doctor/DoctorProfile.jsx'
import Register from './pages/Register.jsx'
function App() {
  const {accessToken, refreshToken} = useContext(AdminContext)
  const {daccessToken} = useContext(DoctorContext)
  return accessToken || daccessToken ? (
    
      <div className='bg-[#F8F9FD]'>
        
        <ToastContainer />
        <Navbar />
        <div className='flex items-start'>
          <Sidebar />
          <Routes>
            <Route path='/' element = {<></>} />
            <Route path='/admin-dashboard' element = {<Dashboard />} />
            <Route path='/all-appointments' element = {<Appointments />} />
            <Route path='/add-doctor' element = {<Adddoctor />} />
            <Route path='/doctor-list' element = {<Doctorlist />} />
            <Route path='/doctordashboard' element = {<DoctorDashboard />} />
            <Route path='/doctorappointments' element = {<DoctorAppointment />} />
            <Route path='/doctorprofile' element = {<DoctorProfile />} />
            
          </Routes>
        </div>
      </div>
  ) : (
    <>
      <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/register' element={<Register />} />
        </Routes>
      <ToastContainer />
    </>
  )
}

export default App