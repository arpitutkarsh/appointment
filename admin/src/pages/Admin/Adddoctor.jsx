import React, { useContext, useState } from 'react';
import { assets } from '../../assets/assets_admin/assets';
import { AdminContext } from '../../context/Admin.context';
import { toast } from 'react-toastify';
import axios from 'axios';

function Adddoctor() {
  const { backendUrl, accessToken } = useContext(AdminContext);
  const [loading, setLoading] = useState(false);
  const [docImg, setDocImg] = useState(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    licenseNumber: '',
    password: '',
    experience: '1 Year',
    fee: '',
    about: '',
    speciality: 'General physician',
    degree: '',
    address1: '',
    address2: '',
  });

  const doctorSpecialities = [
    "General physician", "Family Medicine", "General Surgeon", "Neurologist", "Neurosurgeon",
    "Psychiatrist", "Psychologist", "ENT Specialist", "Cardiologist", "Pulmonologist",
    "Thoracic Surgeon", "Pediatrician", "Gynecologist", "Neonatologist", "Nephrologist",
    "Urologist", "Gastroenterologist", "Hepatologist", "Orthopedic", "Rheumatologist",
    "Physiotherapist", "Dermatologist", "Ophthalmologist", "Dentist", "Cosmetologist",
    "Oncologist", "Anesthesiologist", "Critical Care Specialist", "Palliative Care"
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!docImg) return toast.error("Please upload an image (JPEG/PNG)");

    if (form.password.length < 8) return toast.error("Password must be at least 8 characters");

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('image', docImg);

      for (const key in form) {
        if (key === 'fee') {
          formData.append(key, Number(form[key]));
        } else if (key === 'address1' || key === 'address2') {
          continue;
        } else {
          formData.append(key, form[key]);
        }
      }

      formData.append('address', JSON.stringify({ line1: form.address1, line2: form.address2 }));

      const { data } = await axios.post(`${backendUrl}/api/v1/admin/adddoctor`, formData, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (data.success) {
        toast.success(`Dr. ${form.name} added successfully!`);
        setDocImg(null);
        setForm({
          name: '', email: '', licenseNumber: '', password: '', experience: '1 Year',
          fee: '', about: '', speciality: 'General physician', degree: '',
          address1: '', address2: ''
        });
      } else {
        toast.error(data?.data?.message || "Unknown error occurred");
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Something went wrong";
      toast.error(msg);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 ml-10 min-h-screen py-10">
      <form onSubmit={handleSubmit} className="mx-auto min-w-[150vh]">
        <p className="mb-6 text-2xl font-bold text-gray-800">Add Doctor</p>
        <div className="bg-white px-10 py-10 rounded-2xl shadow-lg max-h-[80vh] overflow-y-auto">
          {/* Upload Image */}
          <div className="flex items-center gap-4 mb-10 font-semibold text-black">
            <label htmlFor="doc-img" className="flex items-center gap-4 cursor-pointer">
              <img
                className="w-20 h-20 object-cover bg-amber-100 rounded-full border-2 border-amber-300"
                src={docImg ? URL.createObjectURL(docImg) : assets.upload_area}
                alt="Upload doctor"
              />
              <p className="text-sm">Upload Doctor<br />Image</p>
            </label>
            <input onChange={(e) => setDocImg(e.target.files[0])} type="file" id="doc-img" hidden />
          </div>

          {/* Form Inputs */}
          <div className="flex flex-col lg:flex-row gap-10 font-semibold text-black">
            {/* Left Inputs */}
            <div className="flex-1 flex flex-col gap-6">
              {[
                { label: "Doctor's Name", name: 'name', type: 'text', placeholder: 'Doctor Name' },
                { label: "Doctor's Email", name: 'email', type: 'email', placeholder: 'Doctor Email' },
                { label: "License Number", name: 'licenseNumber', type: 'text', placeholder: 'License Number' },
                { label: "Password", name: 'password', type: 'password', placeholder: 'Password' },
                { label: "Consultation Fee (₹)", name: 'fee', type: 'number', placeholder: 'Fees' },
              ].map((field, idx) => (
                <div key={idx} className="flex flex-col gap-1">
                  <p>{field.label}</p>
                  <input
                    onChange={handleChange}
                    name={field.name}
                    value={form[field.name]}
                    type={field.type}
                    placeholder={field.placeholder}
                    className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    required
                  />
                </div>
              ))}

              <div className="flex flex-col gap-1">
                <p>Experience</p>
                <select name="experience" onChange={handleChange} value={form.experience} className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400">
                  {[...Array(10)].map((_, i) => (
                    <option key={i} value={`${i + 1} Year`}>{i + 1} Year{ i > 0 ? 's' : ''}</option>
                  ))}
                  <option value="10+ Years">10+ Years</option>
                </select>
              </div>
            </div>

            {/* Right Inputs */}
            <div className="flex-1 flex flex-col gap-6">
              <div className="flex flex-col gap-1">
                <p>Speciality</p>
                <select name="speciality" onChange={handleChange} value={form.speciality} className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400">
                  {doctorSpecialities.map((sp, idx) => (
                    <option key={idx} value={sp}>{sp}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <p>Education</p>
                <input
                  name="degree"
                  onChange={handleChange}
                  value={form.degree}
                  className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  placeholder="Education"
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <p>Address</p>
                <input
                  name="address1"
                  onChange={handleChange}
                  value={form.address1}
                  className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  placeholder="House No, Road No, Area"
                  required
                />
                <input
                  name="address2"
                  onChange={handleChange}
                  value={form.address2}
                  className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  placeholder="City, Zip Code, Country"
                />
              </div>
            </div>
          </div>

          {/* About Doctor */}
          <div className="mt-10">
            <p className="mb-2 font-semibold text-black">About Doctor</p>
            <textarea
              name="about"
              onChange={handleChange}
              value={form.about}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
              placeholder="Write about the Doctor here"
              rows={6}
              required
            />
          </div>

          {/* Submit Button */}
          <div className="mt-8 text-center">
            <button
              type="submit"
              disabled={loading}
              className={`bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-8 rounded-lg transition duration-200 ${loading && 'opacity-60 cursor-not-allowed'}`}
            >
              {loading ? 'Adding...' : 'Add Doctor'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Adddoctor;
