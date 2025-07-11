import React, { useContext, useEffect } from 'react';
import { AdminContext } from '../../context/Admin.context.jsx';
import { AppContext } from '../../context/App.context.jsx';
import { assets } from '../../assets/assets_admin/assets.js';

function Appointments() {
  const { accessToken, appointments, getAllAppointment, cancelAppointment } = useContext(AdminContext);
  const { calculateAge, rupees } = useContext(AppContext);

  useEffect(() => {
    if (accessToken) {
      getAllAppointment();
    }
  }, [accessToken]);

  return (
    <div className="w-full max-w-6xl mx-auto p-5">
      <p className="text-2xl font-bold text-gray-800 mb-5">All Appointments</p>

      <div className="bg-white border rounded-xl shadow-md text-sm max-h-[87vh] overflow-y-auto min-h-[60vh]">
        <div className="hidden sm:grid grid-cols-[1fr_2.5fr_2fr_2.5fr_3fr_1fr_1fr] py-3 px-6 border-b bg-gray-50 font-semibold text-gray-700">
          <p>#S.No</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Doctor</p>
          <p>Fee</p>
          <p>Actions</p>
        </div>

        {appointments.map((item, index) => (

          <div
            key={index}
            className="flex flex-wrap sm:grid sm:grid-cols-[1fr_2.5fr_2fr_2.5fr_3fr_1fr_1fr] items-center py-4 px-6 border-b hover:bg-amber-200 transition duration-400"
          >
            <p className="max-sm:w-full sm:text-center italic font-medium">#{index + 1}</p>

            <div className="flex items-center gap-2 max-sm:w-full">
              <img
                src={item.userData.image}
                alt="patient"
                className="w-8 h-8 rounded-full border border-gray-300"
              />
              <p>{item.userData.name}</p>
            </div>

            <p className="max-sm:w-1/2 text-gray-600">{calculateAge(item.userData.dob)} yrs</p>

            <p className="max-sm:w-full text-gray-700">{item.slotDate.replaceAll('_', '/')} - {item.slotTime}</p>

            <div className="flex items-center gap-2 max-sm:w-full">
              <img
                src={item.docData.image}
                alt="doctor"
                className="w-8 h-8 rounded-full border border-gray-300"
              />
              <p>{item.docData.name}</p>
            </div>

            <p className="text-green-600 font-semibold">{rupees} {item.docData.fee}</p>

            <div className="flex items-center gap-3 max-sm:mt-2">
              {item.isCompleted ? (
  <button className="text-green-600 font-semibold text-xs border border-green-500 px-2 py-1 rounded-full cursor-default">
    Appointment Completed
  </button>
) : item.cancelled ? (
  <p className="text-red-500 font-semibold text-xs">Cancelled</p>
) : (
  <button onClick={() => cancelAppointment(item._id)}>
    <img
      src={assets.cancel_icon}
      alt="Cancel"
      className="w-6 h-6 hover:scale-110 transition-transform"
    />
  </button>
)}

            </div>

          </div>
        ))}
      </div>
    </div>
  );
}

export default Appointments;
