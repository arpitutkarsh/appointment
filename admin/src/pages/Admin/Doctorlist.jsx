import React from 'react'
import { useContext } from 'react'
import { AdminContext } from '../../context/Admin.context'
import { useEffect } from 'react'

function Doctorlist() {
  const {doctors, getAllDoctors, accessToken, changeAvailability} = useContext(AdminContext)
  useEffect(() => {
    console.log("Access Token: ", accessToken)
    if(accessToken){
      getAllDoctors()
    }
  }, [accessToken])
  return (
    <div className='m-5 p-5 max-h-[90vh] overflow-y-scroll bg-amber-100'>
      <h1 className='text-xl  font-bold underline itlaic'>All Doctors</h1>
      <div className='w-full flex flex-wrap gap-4 pt-5 gap-y-6'>
        {
          doctors.map((item, index) => (
            <div className='border border-blue-600 rounded max-w-56 overflow-hidden cursor-pointer m-5 group' key={index}>
               <img className='bg-amber-100 group-hover:bg-amber-500 transition-all duration-500' src={item.image} />
               <div className='p-4'>
                 <p className='text-black font-medium text-lg '>{item.name}</p>
                 <p className='text-gray-800 text-sm'>{item.speciality}</p>
                 <div className='mt-2 flex items-center gap-2 text-sm'>
                  <input onChange={() => changeAvailability(item._id)} type='checkbox' checked = {item.available} />
                  <p>Available</p>
                </div>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default Doctorlist