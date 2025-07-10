import React, { useContext, useEffect } from 'react';
import { DoctorContext } from '../../context/Doctor.context.jsx';

function DoctorDashboard() {
  const { daccessToken, getDashboard, dashData } = useContext(DoctorContext);

  useEffect(() => {
    if (daccessToken) {
      getDashboard();
    }
  }, [daccessToken]);

  return dashData && (
    <div className="min-h-screen w-full bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-blue-900">Doctor Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white shadow-md rounded-lg p-4 border-l-4 border-blue-500">
          <h2 className="text-lg font-semibold text-gray-700">Total Appointments</h2>
          <p className="text-3xl font-bold text-blue-800 mt-2">{dashData.appointments}</p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-4 border-l-4 border-green-500">
          <h2 className="text-lg font-semibold text-gray-700">Total Earnings</h2>
          <p className="text-3xl font-bold text-green-700 mt-2">₹ {dashData.earnings}</p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-4 border-l-4 border-purple-500">
          <h2 className="text-lg font-semibold text-gray-700">Total Patients</h2>
          <p className="text-3xl font-bold text-purple-700 mt-2">{dashData.patients}</p>
        </div>
      </div>

      {/* Latest Appointments Table */}
      <div className="bg-white shadow-md rounded-lg p-4 overflow-auto">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Latest Appointments</h2>
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-blue-100 text-left">
              <th className="border px-4 py-2">Patient</th>
              <th className="border px-4 py-2">Date</th>
              <th className="border px-4 py-2">Time</th>
              <th className="border px-4 py-2">Amount</th>
              <th className="border px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {dashData.latestAppointments.map((appt, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="border px-4 py-2 font-medium">{appt.userData?.name || 'N/A'}</td>
                <td className="border px-4 py-2">{appt.slotDate?.replaceAll('_', '/')}</td>
                <td className="border px-4 py-2">{appt.slotTime}</td>
                <td className="border px-4 py-2">₹ {appt.amount}</td>
                <td className="border px-4 py-2">
                  {appt.cancelled
                    ? <span className="text-red-600 font-semibold">Cancelled</span>
                    : appt.isCompleted
                      ? <span className="text-green-600 font-semibold">Completed</span>
                      : <span className="text-yellow-600 font-semibold">Upcoming</span>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DoctorDashboard;
