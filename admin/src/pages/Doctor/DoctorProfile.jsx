import React, { useContext, useEffect, useState } from 'react';
import { DoctorContext } from '../../context/Doctor.context';
import { toast } from 'react-toastify';
import axios from 'axios';

function DoctorProfile() {
  const { daccessToken, getProfileData, profileData, backendUrl } = useContext(DoctorContext);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    about: '',
    fee: '',
    address: { line1: '', line2: '' },
    available: true,
  });

  useEffect(() => {
    if (daccessToken) getProfileData();
  }, [daccessToken]);

  useEffect(() => {
    if (profileData) {
      setFormData({
        about: profileData.about || '',
        fee: profileData.fee || '',
        address: {
          line1: profileData.address?.line1 || '',
          line2: profileData.address?.line2 || '',
        },
        available: profileData.available,
      });
    }
  }, [profileData]);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    if (name === 'line1' || name === 'line2') {
      setFormData((prev) => ({
        ...prev,
        address: { ...prev.address, [name]: value },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  const handleSave = async () => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/v1/doctor/update`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${daccessToken}`,
          },
        }
      );
      if (data.success) {
        toast.success('Profile updated successfully');
        setEditMode(false);
        getProfileData();
      } else {
        toast.error('Update failed');
      }
    } catch (error) {
      console.log(error);
      toast.error('Something went wrong while updating profile');
    }
  };

  return profileData && (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 py-8 px-4 sm:px-10">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8 space-y-6">
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <img
            src={profileData.image}
            alt={profileData.name}
            className="w-32 h-32 rounded-full border-4 border-blue-500 shadow-md object-cover"
          />
          <div className="text-center sm:text-left space-y-1">
            <h2 className="text-3xl font-bold text-blue-800">{profileData.name}</h2>
            <p className="text-gray-600">{profileData.speciality}</p>
            <p className="text-gray-600">Degree: {profileData.degree}</p>
            <p className="text-gray-600">Experience: {profileData.experience}</p>
            <p className="text-gray-600">Email : {profileData.email}</p>
            <div className="mt-1">
              <span className="font-medium text-gray-700 mr-2">Availability:</span>
              {editMode ? (
                <label className="inline-flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="available"
                    checked={formData.available}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600"
                  />
                  <span className="text-sm text-gray-700">Available</span>
                </label>
              ) : (
                <span className={`text-sm font-semibold ${profileData.available ? 'text-green-600' : 'text-red-600'}`}>
                  {profileData.available ? 'Available' : 'Not Available'}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* About Section */}
        <section>
          <h3 className="text-xl font-semibold text-blue-700 mb-1 border-b pb-1">About</h3>
          {editMode ? (
            <textarea
              name="about"
              rows={4}
              value={formData.about}
              onChange={handleChange}
              placeholder="Write about yourself..."
              className="w-full border border-gray-300 rounded-md p-2 text-gray-800 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          ) : (
            <p className="text-gray-700 leading-relaxed">{profileData.about}</p>
          )}
        </section>

        {/* Clinic Address */}
        <section>
          <h3 className="text-xl font-semibold text-blue-700 mb-1 border-b pb-1">Clinic Address</h3>
          {editMode ? (
            <div className="grid gap-3">
              <input
                type="text"
                name="line1"
                placeholder="Address Line 1"
                value={formData.address.line1}
                onChange={handleChange}
                className="border p-2 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
              <input
                type="text"
                name="line2"
                placeholder="Address Line 2"
                value={formData.address.line2}
                onChange={handleChange}
                className="border p-2 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>
          ) : (
            <>
              <p className="text-gray-700">{profileData.address?.line1}</p>
              <p className="text-gray-700">{profileData.address?.line2}</p>
            </>
          )}
        </section>

        {/* Consultation Fee */}
        <section>
          <h3 className="text-xl font-semibold text-blue-700 mb-1 border-b pb-1">Consultation Fee</h3>
          {editMode ? (
            <input
              type="number"
              name="fee"
              value={formData.fee}
              onChange={handleChange}
              className="border p-2 rounded w-40 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          ) : (
            <p className="text-gray-700 text-lg font-medium">₹ {profileData.fee}</p>
          )}
        </section>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-end gap-4 pt-4 border-t">
          {!editMode ? (
            <button
              onClick={() => setEditMode(true)}
              className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200"
            >
              Edit Profile
            </button>
          ) : (
            <>
              <button
                onClick={handleSave}
                className="px-5 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition duration-200"
              >
                Save Changes
              </button>
              <button
                onClick={() => {
                  setEditMode(false);
                  setFormData({
                    about: profileData.about || '',
                    fee: profileData.fee || '',
                    address: {
                      line1: profileData.address?.line1 || '',
                      line2: profileData.address?.line2 || '',
                    },
                    available: profileData.available,
                  });
                }}
                className="px-5 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition duration-200"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default DoctorProfile;
