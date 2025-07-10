import React, { useEffect } from 'react';
import { useContext } from 'react';
import { AdminContext } from '../../context/Admin.context.jsx';
import { assets } from '../../assets/assets_admin/assets.js';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

function Dashboard() {
  const { accessToken, getDashdata, dashData } = useContext(AdminContext);

  useEffect(() => {
    if (accessToken) {
      getDashdata();
    }
  }, [accessToken]);

  const revenueChartData = dashData?.monthlyRevenue
    ? Object.entries(dashData.monthlyRevenue).map(([month, value]) => ({
        month,
        revenue: value
      }))
    : [];

  return dashData && (
    <div className='w-full px-6 sm:px-10 py-6 bg-gray-50 min-h-screen'>
      {/* Summary Cards */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
        <div className='bg-white p-4 rounded-xl shadow'>
          <img src={assets.doctor_icon} className='w-12' />
          <p className='text-2xl font-bold'>{dashData.doctors}</p>
          <p className='text-gray-600'>Doctors</p>
        </div>
        <div className='bg-white shadow-md p-6 rounded-xl'>
          <img src={assets.appointment_icon} className='w-12' />
          <p className='text-2xl font-bold'>{dashData.appointment}</p>
          <p className='text-gray-600'>Appointments</p>
        </div>
        <div className='bg-white shadow-md p-6 rounded-xl'>
          <img src={assets.patients_icon} className='w-12' />
          <p className='text-2xl font-bold'>{dashData.patients}</p>
          <p className='text-gray-600'>Patients</p>
        </div>
        <div className='bg-white shadow-md p-6 rounded-xl'>
          <img src={assets.completed_icon} className='w-12' />
          <p className='text-2xl font-bold'>{dashData.completedAppointments}</p>
          <p className='text-gray-600'>Completed</p>
        </div>
      </div>

      {/* Additional Stats */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8'>
        <div className='bg-white shadow p-6 rounded-xl'>
          <p className='text-lg font-semibold'>Today's Appointments</p>
          <p className='text-3xl mt-2 text-amber-600 font-bold'>{dashData.todaysAppointments}</p>
        </div>
        <div className='bg-white shadow p-6 rounded-xl'>
          <p className='text-lg font-semibold'>Cancelled Appointments</p>
          <p className='text-3xl mt-2 text-red-500 font-bold'>{dashData.cancelledAppointments}</p>
        </div>
        <div className='bg-white shadow p-6 rounded-xl'>
          <p className='text-lg font-semibold'>Total Revenue</p>
          <p className='text-3xl mt-2 text-green-600 font-bold'>₹ {dashData.totalFeeFromCompletedAppointments}</p>
        </div>
        <div className='bg-white shadow p-6 rounded-xl'>
          <p className='text-lg font-semibold'>New Patients This Week</p>
          <p className='text-3xl mt-2 text-blue-500 font-bold'>{dashData.newPatientsThisWeek}</p>
        </div>
        <div className='bg-white shadow p-6 rounded-xl'>
          <p className='text-lg font-semibold'>Users Logged In Today</p>
          <p className='text-2xl mt-2 font-medium'>{dashData.usersLoggedInToday}</p>
        </div>
        <div className='bg-white shadow p-6 rounded-xl'>
          <p className='text-lg font-semibold'>Doctors Added Today</p>
          <p className='text-2xl mt-2 font-medium'>{dashData.doctorsAddedToday}</p>
        </div>
        <div className='bg-white shadow p-6 rounded-xl'>
          <p className='text-lg font-semibold'>Doctors per Patient</p>
          <p className='text-2xl mt-2 font-medium'>{dashData.doctorPerPatientRatio != null
      ? Number(parseFloat(dashData.doctorPerPatientRatio)).toFixed()
      : 'N/A'}</p>
        </div>
        <div className='bg-white shadow p-6 rounded-xl'>
          <p className='text-lg font-semibold'>Avg Revenue/Month</p>
          <p className='text-xl mt-2 font-medium'>₹ {dashData.avgRevenuePerMonth}</p>
        </div>
        <div className='bg-white shadow p-6 rounded-xl'>
          <p className='text-lg font-semibold'>Avg Revenue/Year</p>
          <p className='text-xl mt-2 font-medium'>₹ {dashData.avgRevenuePerYear}</p>
        </div>
        <div className='bg-white shadow p-6 rounded-xl col-span-1 md:col-span-2'>
          <p className='text-lg font-semibold'>Most Consulted Doctor</p>
          {dashData.mostConsultedDoctor ? (
            <div className='flex items-center gap-4 mt-3'>
              <img src={dashData.mostConsultedDoctor.image} className='w-12 h-12 rounded-full object-cover' />
              <div>
                <p className='font-medium text-lg'>{dashData.mostConsultedDoctor.name}</p>
                <p className='text-sm text-gray-500'>{dashData.mostConsultedDoctor.speciality}</p>
              </div>
            </div>
          ) : (
            <p className='text-gray-500 mt-2'>No data available</p>
          )}
        </div>
      </div>

      {/* Revenue Chart */}
      <div className='bg-white shadow p-6 rounded-xl mb-8'>
        <p className='text-lg font-semibold mb-4'>Monthly Revenue Chart</p>
        <ResponsiveContainer width='100%' height={300}>
          <BarChart data={revenueChartData}>
            <XAxis dataKey='month' />
            <YAxis />
            <Tooltip />
            <Bar dataKey='revenue' fill='#4f46e5' />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Last 5 Appointments */}
      <div className='bg-white shadow p-6 rounded-xl'>
        <p className='text-lg font-semibold mb-4'>Last 5 Appointments</p>
        <div className='overflow-x-auto'>
          <table className='min-w-full text-sm text-left border'>
            <thead className='bg-gray-100'>
              <tr>
                <th className='p-3 border'>#</th>
                <th className='p-3 border'>Patient</th>
                <th className='p-3 border'>Doctor</th>
                <th className='p-3 border'>Date</th>
                <th className='p-3 border'>Time</th>
              </tr>
            </thead>
            <tbody>
              {dashData.latestAppointment.map((item, index) => (
                <tr key={index} className='hover:bg-amber-50'>
                  <td className='p-3 border'>{index + 1}</td>
                  <td className='p-3 border'>{item.userData?.name || 'N/A'}</td>
                  <td className='p-3 border'>{item.docData?.name || 'N/A'}</td>
                  <td className='p-3 border'>{item.slotDate.replaceAll('_', '-')}</td>
                  <td className='p-3 border'>{item.slotTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
    </div>
  );
}

export default Dashboard;
