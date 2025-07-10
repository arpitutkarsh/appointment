import React, { useContext, useState, useEffect } from 'react';
import { AdminContext } from '../context/Admin.context.jsx';
import { DoctorContext } from '../context/Doctor.context.jsx';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

function Login() {
  const [state, setState] = useState('Admin');
  const { setAccessToken, backendUrl, setRefreshToken } = useContext(AdminContext);
  const { setDAccessToken, setDRefreshToken } = useContext(DoctorContext);
  const [email, setEmail] = useState('');
  const [password, setPasswrd] = useState('');
  const [loading, setLoading] = useState(false);
  const [ip, setIP] = useState('');
  const navigate = useNavigate();

  // Get client IP from public API
  useEffect(() => {
    const fetchIP = async () => {
      try {
        const res = await axios.get('https://api.ipify.org?format=json');

        setIP(res.data.ip);
        alert(`Your IP Address is: ${res.data.ip}`);

      } catch (err) {
        console.error('Failed to fetch IP', err);
      }
    };
    fetchIP();
  }, []);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    localStorage.clear();
    setLoading(true);

    try {
      if (state === 'Admin') {
        const { data } = await axios.post(`${backendUrl}/api/v1/admin/login`, { email, password, ip });
        if (data.success) {
          localStorage.setItem('accessToken', data.data.accessToken);
          localStorage.setItem('refreshToken', data.data.refreshToken);
          setAccessToken(data.data.accessToken);
          setRefreshToken(data.data.refreshToken);
          toast.success('Admin login successful');
          navigate('/admin-dashboard');
        } else {
          toast.error('Admin login failed');
        }
      } else {
        const { data } = await axios.post(`${backendUrl}/api/v1/doctor/login`, { email, password, ip });
        if (data.success) {
          localStorage.setItem('doctorAccessToken', data.data.accessToken);
          localStorage.setItem('doctorRefreshToken', data.data.refreshToken);
          setDAccessToken(data.data.accessToken);
          setDRefreshToken(data.data.refreshToken);
          toast.success('Doctor login successful');
          navigate('/doctordashboard');
        } else {
          toast.error("Doctor's login failed");
        }
      }
    } catch (error) {
      toast.error('Invalid Credentials', {
        style: {
          backgroundColor: '#fbbf24',
          fontWeight: 'bold',
          color: 'black',
          fontSize: '20px',
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50">
      <form
        onSubmit={onSubmitHandler}
        className="bg-white flex flex-col gap-3 items-start p-8 min-w-[340px] sm:min-w-95 border rounded-xl text-gray-800 text-sm shadow-lg"
      >
        <p className="text-xl font-semibold mb-4">
          <span className="text-amber-500">{state}</span> Login
        </p>

        {state === 'Doctor' && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 mb-2 rounded w-full text-sm">
            <p className="font-semibold">Note for Doctors:</p>
            <ul className="list-disc list-inside ml-2">
              <li>This platform is for licensed medical professionals only.</li>
              <li>Please ensure your credentials and medical license are valid.</li>
              <li>Uploading fake credentials or impersonating a doctor is a criminal offense.</li>
              <li>All registrations are subject to manual verification and approval.</li>
              <li>Provide accurate name, degree, and specialization as per government-issued documents.</li>
              <li>IP addresses and device information are tracked during registration.</li>
              <li>Fake or misleading registrations will be reported and blocked.</li>
              <li>Your identity will be verified before being listed.</li>
            </ul>
          </div>
        )}

        {state === 'Admin' && (
          <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-800 p-4 mb-2 rounded w-full text-sm">
            <p className="font-semibold mb-1">Important Notice for Admins:</p>
            <ul className="list-disc list-inside ml-2 space-y-1">
              <li>This panel is for authorized personnel only.</li>
              <li>Do not share your credentials with anyone.</li>
              <li>Misuse of admin access will lead to account termination.</li>
              <li>All actions are logged for auditing purposes.</li>
              <li>If you suspect unauthorized access, report it immediately.</li>
              <li><strong>Your actions directly affect live medical services — operate responsibly.</strong></li>
              <li>Multiple failed login attempts will be logged with IP address.</li>
              <li>Maintain confidentiality and patient privacy at all times.</li>
            </ul>
          </div>
        )}

        <div className="w-full">
          <p>Email</p>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="email"
            required
            className="w-full border p-2 rounded mt-1"
          />
        </div>

        <div className="w-full">
          <p>Password</p>
          <input
            onChange={(e) => setPasswrd(e.target.value)}
            value={password}
            type="password"
            required
            className="w-full border p-2 rounded mt-1"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Logging in...' : `Login as ${state}`}
        </button>

        {state === 'Admin' ? (
          <p>
            Doctor Login{' '}
            <span
              className="text-amber-500 font-bold underline cursor-pointer"
              onClick={() => setState('Doctor')}
            >
              Click Here!
            </span>
          </p>
        ) : (
          <p>
            Admin Login{' '}
            <span
              className="text-amber-500 font-bold underline cursor-pointer"
              onClick={() => setState('Admin')}
            >
              Click Here!
            </span>
          </p>
        )}

        {state !== 'Admin' && (
          <p>
            Register as a Doctor?{' '}
            <span
              className="font-bold cursor-pointer text-amber-500 underline"
              onClick={() => navigate('/register')}
            >
              Click here!
            </span>
          </p>
        )}
      </form>
    </div>
  );
}

export default Login;
