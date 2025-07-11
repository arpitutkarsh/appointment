import React, { useContext, useEffect, useState } from 'react';
import { DoctorContext } from '../../context/Doctor.context.jsx';
import { assets } from '../../assets/assets_admin/assets.js';
import dayjs from 'dayjs';

function DoctorAppointment() {
  const { daccessToken, appointments, getAppointments, completeAppointment, cancelAppointment, writePrescription } = useContext(DoctorContext);
  const [showPrescriptionDialog, setShowPrescriptionDialog] = useState(false);
  const [prescriptionsWritten, setPrescriptionsWritten] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [prescriptionData, setPrescriptionData] = useState({
    diagnosis: '',
    lifestyle: '',
    tests: '',
    followUp: '',
    bp: '',
    spo2: '',
    pulseRate: '',
    temperature: '',
    
    notes: '',
    medicines: [{ name: '', dosage: '', frequency: '', duration: '' }]
  });

  const frequencyOptions = [
    "Once Daily - OD", "Twice Daily - BD", "Thrice Daily - TDS", "Four Times Daily - QID",
    "At Bedtime - QHS", "Before Meals - AC", "After Meals - PC", "As Needed - PRN",
    "SOS(if Necessary)", "Immediately - STAT - One Time Urgent Dose", "Every 4 hours - Q4H",
    "Every 6 hours - Q6H", "Every 8 hours - Q8H", "Every 2 hours - Q2H", "Every 15 minutes - Q15min",
    "Every 30 minutes - Q30min", "One a Week - QW", "Every 2 Week", "Every 3 weeks",
    "Once a Month", "Every 2/3 Months", "Four Times a Day(Before Meals) - QID AC",
    "Four Times a Day(after Meals) - QID PC", "Every Morning", "At Noon", "Every Night","Alternate Days"
  ];

  useEffect(() => {
    if (daccessToken) {
      getAppointments();
    }
  }, [daccessToken]);

  const generatePrescriptionNumber = () => {
    const today = dayjs().format('YYYYMMDD');
    const random = Math.floor(1000 + Math.random() * 9000);
    return `BTD/P/${today}/${random}`;
  };

  const handleMedicineChange = (index, field, value) => {
    const updated = [...prescriptionData.medicines];
    updated[index][field] = value;
    setPrescriptionData({ ...prescriptionData, medicines: updated });
  };

  const addMedicine = () => {
    setPrescriptionData({
      ...prescriptionData,
      medicines: [...prescriptionData.medicines, { name: '', dosage: '', frequency: '', duration: '' }]
    });
  };

  const removeMedicine = (index) => {
    const updated = prescriptionData.medicines.filter((_, i) => i !== index);
    setPrescriptionData({ ...prescriptionData, medicines: updated });
  };

  const getAge = (dob) => {
    if (!dob) return "-";
    const birthDate = new Date(dob);
    const ageDiff = Date.now() - birthDate.getTime();
    return Math.floor(ageDiff / (1000 * 60 * 60 * 24 * 365.25));
  };

  return (
    <>
      <div className="w-full max-w-6xl mx-auto p-4">
        <p className="mb-4 text-xl font-semibold text-gray-800">Your Appointments</p>

        <div className="bg-white border rounded-lg shadow-md text-sm max-h-[80vh] overflow-y-scroll min-h-[50vh]">
          <div className="max-sm:hidden grid grid-cols-[0.5fr_2fr_1fr_1fr_1fr_2fr_1fr_1fr_1fr] gap-3 py-3 px-6 border-b font-semibold bg-gray-100 sticky top-0 z-10 text-gray-700">
            <p>#</p><p>Patient</p><p>Payment</p><p>Age</p><p>Gender</p><p>Date & Time</p><p>Payment Status</p><p>Fees</p><p>Action</p>
          </div>
          
          {appointments.reverse().map((item, index) => (
            <div key={item._id} className="grid grid-cols-[0.5fr_2fr_1fr_1fr_1fr_2fr_1fr_1fr_1fr] gap-3 py-4 px-6 items-center border-b hover:bg-blue-50 transition">
              <p className="text-gray-600">{index + 1}</p>
              <div className="flex items-center gap-2">
                <img src={item.userData?.image || 'https://via.placeholder.com/40'} alt="patient" className="w-9 h-9 rounded-full object-cover border" />
                <p className="font-medium text-gray-800">{item.userData?.name || "Unknown"}</p>
              </div>
              <p className="text-gray-600">{item.payment ? "Online" : "Cash"}</p>
              <p className="text-gray-600">{getAge(item.userData?.dob)}</p>
              <p className="text-gray-600 capitalize">{item.userData?.gender || "-"}</p>
              <p className="text-gray-600">{item.slotDate.replaceAll('_', '-')} @ {item.slotTime}</p>
              <p className={`text-xs px-2 py-1 rounded-full font-semibold w-fit ${item.payment ? "bg-green-100 text-green-700 border border-green-300" : "bg-yellow-100 text-yellow-700 border border-yellow-300"}`}>
                {item.payment ? "Paid Online" : "Cash"}
              </p>
              <p className="text-gray-600 font-medium">₹{item.amount || 0}</p>
              <div className="flex flex-col items-center gap-2 text-center">
                {item.cancelled ? (
                  <p className="text-red-500 font-semibold text-xs">Appointment Cancelled</p>
                ) : item.isCompleted ? (
                  <p className="text-green-600 font-semibold text-xs">Appointment Completed</p>
                ) : (
                  <>
                    <img onClick={() => cancelAppointment(item._id)} src={assets.cancel_icon} alt="Cancel" className="w-5 h-5 cursor-pointer hover:scale-110 transition" />
                    <img onClick={() => completeAppointment(item._id)} src={assets.tick_icon} alt="Complete" className="w-5 h-5 cursor-pointer hover:scale-110 transition" />
                    <p onClick={() => { setSelectedAppointment(item); setShowPrescriptionDialog(true); }} className="text-xs font-medium px-3 py-1 rounded-full bg-blue-100 text-blue-700 border border-blue-300 shadow-sm hover:bg-blue-200 transition-all cursor-pointer whitespace-nowrap">
                      Prescription
                    </p>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {showPrescriptionDialog && selectedAppointment && (
        <div className="fixed inset-0 backdrop-blur-sm overflow-y-auto z-50">
          <div className="min-h-screen flex justify-center py-12 px-4">
            <div className="bg-white rounded-lg p-8 w-full max-w-6xl shadow-lg relative">
              <button onClick={() => setShowPrescriptionDialog(false)} className="absolute top-3 right-4 text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
              <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Prescription Form</h2>
              <h2 className='text-sm underline font-bold mb-6 mt-[-20] text-gray-800 text-center'>Powered by BooktheDoc</h2>

              <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 text-sm p-4 rounded mb-6">
                <h3 className="font-semibold mb-2">Necessary Steps to be Performed by the Doctor:</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Verify patient details such as <strong>Name, Age, Gender, and Appointment date/time.</strong></li>
                  <li>Accurately fill in the diagnosis after proper examination.</li>
                  <li>Ensure to fill in all the Vitals.</li>
                  <li>Mention all prescribed medicines with <strong>correct dosage, frequency, and duration.</strong></li>
                  <li>Clearly state any lifestyle or dietary recommendations if needed.</li>
                  <li>Include all relevant tests to be done with instructions (if any).</li>
                  <li>Specify a follow-up date for the patient’s next visit.</li>
                  <li>Click <strong>“Save Prescription”</strong> only after reviewing all fields.</li>
                </ul>
              </div>

              {/* Doctor and Patient Info */}
              <div className="grid grid-cols-2 gap-6 text-sm mb-8">
                <div className="space-y-1">
                  <p><span className="font-medium">Doctor's Name:</span> {selectedAppointment.docData.name}</p>
                  <p><span className="font-medium">Qualification:</span> {selectedAppointment.docData.degree}</p>
                  <p><span className="font-medium">Clinic Address:</span> {selectedAppointment.docData.address.line1}<br />{selectedAppointment.docData.address.line2}</p>
                </div>
                <div className="space-y-1">
                  <p><span className="font-medium">Patient Name:</span> {selectedAppointment.userData?.name}</p>
                  <p><span className="font-medium">Patient Gender:</span> {selectedAppointment.userData?.gender}</p>
                  <p><span className="font-medium">DOB:</span> {selectedAppointment.userData?.dob}</p>
                  <p><span className="font-medium">Date & Time:</span> {selectedAppointment.slotDate.replaceAll('_', '-')} @ {selectedAppointment.slotTime}</p>
                  <p><span className="font-medium">Prescription No:</span> {generatePrescriptionNumber()}</p>
                </div>
              </div>

              {/* Vitals */}
              <div className="mb-6 font-mono">
                <label className="block text-sm font-semibold mb-2">Vitals</label>
                <div className="grid grid-cols-4 gap-4">
                  <div><label className="block text-xs text-gray-600 mb-1">Blood Pressure (BP)</label><input type="text" placeholder="e.g. 120/80" value={prescriptionData.bp} onChange={(e) => setPrescriptionData({ ...prescriptionData, bp: e.target.value })} className="w-full p-2 border rounded text-sm" /></div>
                  <div><label className="block text-xs text-gray-600 mb-1">SpO₂ (%)</label><input type="text" placeholder="e.g. 97%" value={prescriptionData.spo2} onChange={(e) => setPrescriptionData({ ...prescriptionData, spo2: e.target.value })} className="w-full p-2 border rounded text-sm" /></div>
                  <div><label className="block text-xs text-gray-600 mb-1">Pulse Rate (bpm)</label><input type="text" placeholder="e.g. 72" value={prescriptionData.pulseRate} onChange={(e) => setPrescriptionData({ ...prescriptionData, pulseRate: e.target.value })} className="w-full p-2 border rounded text-sm" /></div>
                  <div><label className="block text-xs text-gray-600 mb-1">Temperature (°C)</label><input type="text" placeholder="e.g. 98.6" value={prescriptionData.temperature} onChange={(e) => setPrescriptionData({ ...prescriptionData, temperature: e.target.value })} className="w-full p-2 border rounded text-sm" /></div>
                </div>
              </div>

              {/* Diagnosis */}
              <div className="mb-6 font-mono">
                <label className="block text-sm font-medium mb-1">Diagnosis</label>
                <textarea className="w-full p-3 border rounded text-sm" placeholder='Patient Came with the Problem of - Fever Diagnosed with' rows={3} value={prescriptionData.diagnosis} onChange={(e) => setPrescriptionData({ ...prescriptionData, diagnosis: e.target.value })} />
              </div>

              {/* Medicines */}
              <div className="mb-6 font-mono">
                <label className="block text-sm font-semibold mb-2">Rx - Medicines</label>
                {prescriptionData.medicines.map((med, index) => (
                  <div key={index} className="grid grid-cols-5 gap-4 mb-2 items-center">
                    <input type="text" placeholder="Medicine" value={med.name} onChange={(e) => handleMedicineChange(index, 'name', e.target.value)} className="p-2 border rounded text-sm" />
                    <input type="text" placeholder="Dosage" value={med.dosage} onChange={(e) => handleMedicineChange(index, 'dosage', e.target.value)} className="p-2 border rounded text-sm" />
                    <select value={med.frequency} onChange={(e) => handleMedicineChange(index, 'frequency', e.target.value)} className="p-2 border rounded text-sm">
                      <option value="">Frequency</option>
                      {frequencyOptions.map(option => <option key={option} value={option}>{option}</option>)}
                    </select>
                    <input type="text" placeholder="Duration" value={med.duration} onChange={(e) => handleMedicineChange(index, 'duration', e.target.value)} className="p-2 border rounded text-sm" />
                    <button onClick={() => removeMedicine(index)} className="text-red-500 hover:underline text-xs">Remove</button>
                  </div>
                ))}
                <button onClick={addMedicine} className="text-blue-600 hover:underline text-sm mt-1">+ Add Medicine</button>
              </div>

              {/* Lifestyle */}
              <div className="mb-6 font-mono">
                <label className="block text-sm font-medium mb-1">Diet / Lifestyle Recommendation</label>
                <textarea className="w-full p-3 border rounded text-sm" rows={2} value={prescriptionData.lifestyle} onChange={(e) => setPrescriptionData({ ...prescriptionData, lifestyle: e.target.value })} />
              </div>

              {/* Tests */}
              <div className="mb-6 font-mono">
                <label className="block text-sm font-medium mb-1">Tests to be done</label>
                <textarea className="w-full p-3 border rounded text-sm" rows={2} value={prescriptionData.tests} onChange={(e) => setPrescriptionData({ ...prescriptionData, tests: e.target.value })} />
              </div>

              {/* Follow Up */}
              <div className="mb-6 font-mono">
                <label className="block text-sm font-medium mb-1">Follow Up Date</label>
                <input type="date" className="w-full p-3 border rounded text-sm" value={prescriptionData.followUp} onChange={(e) => setPrescriptionData({ ...prescriptionData, followUp: e.target.value })} />
              </div>

              

              {/* General Notes */}
              <div className="mb-8 font-mono">
                <label className="block text-sm font-medium mb-1">General Notes</label>
                <textarea className="w-full p-3 border rounded text-sm" rows={3} value={prescriptionData.notes} onChange={(e) => setPrescriptionData({ ...prescriptionData, notes: e.target.value })} />
              </div>

              <button
                className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition"
                onClick={async () => {
                  const success = await writePrescription(selectedAppointment._id, prescriptionData);
                  if (success) {
                    setPrescriptionsWritten(prev => [...prev, selectedAppointment._id]);
                    setShowPrescriptionDialog(false);
                    setPrescriptionData({
                      diagnosis: '',
                      lifestyle: '',
                      tests: '',
                      followUp: '',
                      bp: '',
                      spo2: '',
                      pulseRate: '',
                      temperature: '',
                      
                      notes: '',
                      medicines: [{ name: '', dosage: '', frequency: '', duration: '' }]
                    });
                  }
                }}
              >
                Save Prescription
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default DoctorAppointment;
