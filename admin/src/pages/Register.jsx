import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets_admin/assets.js'
import { DoctorContext } from '../context/Doctor.context.jsx'
import { toast } from 'react-toastify'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function Register() {
  const [docImg, setDocImg] = useState(false)
  const [name, setName] = useState('')
  const [licenseNumber, setLicenseNumber] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [experience, setExperience] = useState('1 Year')
  const [fee, setFee] = useState('')
  const [about, setAbout] = useState('')
  const [speciality, setSpeciality] = useState('General physician')
  const [degree, setDegree] = useState('')
  const [address1, setAddress1] = useState('')
  const [address2, setAddress2] = useState('')
  const [showCommissionAlert, setShowCommissionAlert] = useState(true)

  const { backendUrl } = useContext(DoctorContext)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (!docImg) return toast.error(`Please Upload Image (Valid File type: JPEG, PNG)`)

      const formData = new FormData()
      formData.append('image', docImg)
      formData.append('name', name)
      formData.append('licenseNumber', licenseNumber)
      formData.append('email', email)
      formData.append('password', password)
      formData.append('experience', experience)
      formData.append('fee', Number(fee))
      formData.append('about', about)
      formData.append('speciality', speciality)
      formData.append('degree', degree)
      formData.append('address', JSON.stringify({ line1: address1, line2: address2 }))

      const { data } = await axios.post(`${backendUrl}/api/v1/doctor/register`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      if (data.success) {
        toast.success(`Dr. ${name}, Registered Successfully!`)
        setDocImg(false)
        setName('')
        setLicenseNumber('')
        setEmail('')
        setDegree('')
        setPassword('')
        setAddress1('')
        setAddress2('')
        setFee('')
        setAbout('')
        navigate('/')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      const message = error.response?.data?.message || "Something went wrong"
      toast.error(message)
    }
  }

  const doctorSpecialities = [
    "General physician", "Family Medicine", "General Surgeon", "Neurologist", "Neurosurgeon",
    "Psychiatrist", "Psychologist", "ENT Specialist", "Cardiologist", "Pulmonologist",
    "Thoracic Surgeon", "Pediatrician", "Gynecologist", "Neonatologist", "Nephrologist",
    "Urologist", "Gastroenterologist", "Hepatologist", "Orthopedic", "Rheumatologist",
    "Physiotherapist", "Dermatologist", "Ophthalmologist", "Dentist", "Cosmetologist",
    "Oncologist", "Anesthesiologist", "Critical Care Specialist", "Palliative Care"
  ];

  return (
    <div className="bg-gray-100 min-h-screen py-10 m-5">
      <form onSubmit={handleSubmit} className='mx-auto min-w-[150vh]'>
        <p className='mb-6 text-2xl font-bold text-gray-800'>Doctor Registration</p>
        <div className="mb-6 p-4 border-l-4 border-green-500 bg-amber-100 text-amber-800 rounded-md text-sm leading-relaxed">
          <p className="font-semibold mb-1">Please Note Before Registering:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Use your official name (no Dr./Mr./Mrs. prefix).</li>
            <li>Ensure your Medical License Number is correct and valid.</li>
            <li>Password must be at least 8 characters long.</li>
            <li>Use a valid email that you actively check for communication.</li>
            <li>Upload a recent professional photo (JPEG/PNG only).</li>
            <li>Address should be detailed enough to identify your clinic/hospital location.</li>
            <li>Fill in the "About Doctor" section with relevant and concise details (experience, expertise, etc.).</li>
            All uploaded documents and credentials are stored securely and accessed only by authorized verification personnel to confirm authenticity.
          </ul>

          <hr className="my-3 border-amber-300" />

          <p className="font-semibold mb-1 mt-2">Legal Disclaimer & Rights:</p>
          <ul className="list-disc list-inside space-y-1 text-[13px]">
            <li>By registering, you agree to provide accurate, current, and complete information.</li>
            <li>BookTheDoc reserves the right to verify all credentials and reject profiles with false or misleading data.</li>
            <li>Uploading unauthorized content (e.g., stock images, fake degrees) may result in permanent account suspension.</li>
            <li>BookTheDoc is not responsible for any malpractice or disputes arising between doctor and patient.</li>
            <li>Your account may be removed if you're found violating professional or ethical guidelines.</li>
            <li>By registering, you agree to comply with local laws and medical regulations.</li>
          </ul>
        </div>
        <div className='bg-white px-10 py-10 rounded-2xl shadow-lg overflow-y-scroll max-h-[80vh]'>
        {showCommissionAlert && (
  <div className="flex justify-between items-center bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded relative mb-4">
    <span>
      <strong>Notice:</strong> 5% of your monthly revenue will be deducted as service commission by BookTheDoc.
    </span>
    <button
      onClick={() => setShowCommissionAlert(false)}
      className="ml-4 text-xl font-bold leading-none focus:outline-none"
    >
      ×
    </button>
  </div>
)}

          {/* Upload */}
          <div className='flex items-center gap-4 mb-10 text-black font-semibold'>
            <label htmlFor='doc-img' className='flex items-center gap-4 cursor-pointer'>
              <img className='w-20 h-20 object-cover bg-amber-100 rounded-full border-2 border-amber-300' src={docImg ? URL.createObjectURL(docImg) : assets.upload_area} />
              <p className="text-sm">Upload Doctor <br /> Image</p>
            </label>
            <input onChange={(e) => setDocImg(e.target.files[0])} type='file' id='doc-img' hidden />
          </div>

          <div className='flex flex-col lg:flex-row items-start gap-10 font-semibold text-black'>
            <div className='w-full flex-1 flex flex-col gap-6'>
              <div className='flex flex-col gap-1'>
                <p>Doctor's Name</p>
                <input onChange={(e) => setName(e.target.value)} value={name} className='border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400' type='text' placeholder='Doctor Name' required />
              </div>

              <div className='flex flex-col gap-1'>
                <p>License Number</p>
                <input onChange={(e) => setLicenseNumber(e.target.value)} value={licenseNumber} className='border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400' type='text' placeholder='Medical License Number' required />
              </div>

              <div className='flex flex-col gap-1'>
                <p>Doctor's Email</p>
                <input onChange={(e) => setEmail(e.target.value)} value={email} className='border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400' type='email' placeholder='Doctor Email' required />
              </div>

              <div className='flex flex-col gap-1'>
                <p>Password</p>
                <input onChange={(e) => setPassword(e.target.value)} value={password} className='border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400' type='password' placeholder='Password' required />
              </div>

              <div className='flex flex-col gap-1'>
                <p>Experience</p>
                <select onChange={(e) => setExperience(e.target.value)} value={experience} className='border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400'>
                  {[...Array(10)].map((_, i) => (
                    <option key={i} value={`${i + 1} Year`}>{i + 1} Year{(i + 1) > 1 ? 's' : ''}</option>
                  ))}
                  <option value="10+ Years">10+ Years</option>
                </select>
              </div>

              <div className='flex flex-col gap-1'>
                <p>Consultation Fee (₹)</p>
                <input onChange={(e) => setFee(e.target.value)} value={fee} className='border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400' type='number' placeholder='Fee' required />
              </div>
            </div>

            <div className='w-full flex-1 flex flex-col gap-6'>
              <div className='flex flex-col gap-1'>
                <p>Speciality</p>
                <select onChange={(e) => setSpeciality(e.target.value)} value={speciality} className='border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400'>
                  {doctorSpecialities.map((item, index) => (
                    <option key={index} value={item}>{item}</option>
                  ))}
                </select>
              </div>

              <div className='flex flex-col gap-1'>
                <p>Education</p>
                <input onChange={(e) => setDegree(e.target.value)} value={degree} className='border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400' type='text' placeholder='Degree' required />
              </div>

              <div className='flex flex-col gap-1'>
                <p>Address</p>
                <input onChange={(e) => setAddress1(e.target.value)} value={address1} className='border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400' type='text' placeholder='House Number, Street, Area' required />
                <input onChange={(e) => setAddress2(e.target.value)} value={address2} className='border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400' type='text' placeholder='City, Zip Code, Country' />
              </div>
            </div>
          </div>

          <div className='mt-10'>
            <p className='mb-2 font-semibold text-black'>About Doctor</p>
            <textarea onChange={(e) => setAbout(e.target.value)} value={about} className='w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none' placeholder='Write about the Doctor here' rows={6} required />
          </div>

          <div className='mt-8 text-center'>
            <button type="submit" className='bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-8 rounded-lg transition duration-200'>
              Register
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default Register
