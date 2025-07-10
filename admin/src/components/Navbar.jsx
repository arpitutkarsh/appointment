import React, { useContext } from 'react'
import { assets } from '../assets/assets_admin/assets'
import { AdminContext } from '../context/Admin.context'
import { useNavigate } from 'react-router-dom'
import { DoctorContext } from '../context/Doctor.context'
import { toast } from 'react-toastify';
import axios from 'axios';

function Navbar() {
    const { accessToken, refreshToken, setAccessToken, setRefreshToken } = useContext(AdminContext)
    const { daccessToken, setDAccessToken, drefreshToken, setDRefreshToken } = useContext(DoctorContext)
    const navigate = useNavigate()

    const logout = async () => {
        // navigate('/')
        // accessToken && setAccessToken('')
        // refreshToken && setRefreshToken('')
        // accessToken && localStorage.removeItem('accessToken' || 'daccessToken')
        // refreshToken && localStorage.removeItem('refreshToken' || 'drefreshToken')
        if (accessToken) {
            setAccessToken('')
            localStorage.removeItem('accessToken');
        }
        if (refreshToken) {
            setRefreshToken('');
            localStorage.removeItem('refreshToken');
        }
        if (daccessToken) {
            setDAccessToken('');
            localStorage.removeItem('daccessToken');
        }
        if (drefreshToken) {
            setDRefreshToken('');
            localStorage.removeItem('drefreshToken');
        }
        navigate('/');
        toast.success('Logged out successfully');
    }

    return (
        <div className="bg-black flex justify-between items-center px-6 py-3 shadow-md">
            {/* Left Section */}
            <div className="flex items-center gap-4">
                <img
                    className="w-14 h-14  p-1 cursor-pointer"
                    src={assets.admin_logo}
                    alt="adminlogin"
                />
                <p className="text-amber-400 bg-black border border-amber-400 px-4 py-1 rounded-full font-semibold text-sm">
                    {accessToken ? 'Admin' : 'Doctor'}
                </p>
            </div>

            {/* Logout Button */}
            <button
                onClick={logout}
                className="bg-amber-400 hover:bg-amber-500 text-black font-semibold py-2 px-5 rounded-full transition-all duration-200 shadow-sm"
            >
                Logout
            </button>
        </div>
    )
}

export default Navbar
