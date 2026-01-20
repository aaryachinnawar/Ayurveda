import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api';
import { toast } from 'react-hot-toast';
import NavbarLanding from '../components/NavbarLanding';
import { FiUser, FiLock, FiEye, FiEyeOff, FiUserCheck, FiUserX } from 'react-icons/fi';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [role, setRole] = useState('USER');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await login(username, password, role);
      // Store authentication data
      localStorage.setItem('auth', JSON.stringify({
        token: res.token,
        username: res.username,
        role: res.role,
        id: res.id
      }));
      toast.success('Login successful!');
      // Navigate based on the user's actual role from the backend
      if (res.role === 'SUPER_ADMIN' || res.role === 'COLLEGE_ADMIN') {
        navigate('/admin');
      } else {
        navigate('/home');
      }
    } catch (err) {
      toast.error('Invalid username or password');
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#F7F5ED] flex flex-col">
      <NavbarLanding minimal />
      <div className="flex-1 flex items-center justify-center w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md flex flex-col gap-6 mt-8 mb-8">
          <h2 className="text-3xl font-bold text-blue-600 text-center">Login</h2>
          {/* Role Toggle */}
          <div className="flex items-center justify-center gap-2 bg-gray-100 rounded-lg p-1 w-full">
            <button
              type="button"
              className={`flex items-center gap-1 px-4 py-2 rounded-lg font-semibold text-sm transition ${role === 'USER' ? 'bg-white shadow text-blue-700' : 'text-gray-500'}`}
              onClick={() => setRole('USER')}
            >
              <FiUser className="text-lg" /> USER
            </button>
            <button
              type="button"
              className={`flex items-center gap-1 px-4 py-2 rounded-lg font-semibold text-sm transition ${role === 'ADMIN' ? 'bg-white shadow text-blue-700' : 'text-gray-500'}`}
              onClick={() => setRole('ADMIN')}
            >
              <FiUserCheck className="text-lg" /> ADMIN
            </button>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
            <div className="flex flex-col gap-1 w-full">
              <label className="text-gray-700 text-sm">Username *</label>
              <div className="relative w-full">
                {/* <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500">
                  <FiUser />
                </span> */}
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  required
                  className="w-full pl-3 pr-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
                  placeholder="Username"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1 w-full">
              <label className="text-gray-700 text-sm">Password *</label>
              <div className="relative w-full">
                {/* <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500">
                  <FiLock />
                </span> */}
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="w-full pl-3 pr-10 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
                  placeholder="Password"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500"
                  onClick={() => setShowPassword(v => !v)}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-3 mt-2 bg-[#388E3C] text-white rounded-lg font-semibold text-lg hover:bg-green-700 transition flex items-center justify-center gap-2 shadow"
            >
              Login as {role.charAt(0) + role.slice(1).toLowerCase()}
            </button>
          </form>
          {/* Remove the register link below */}
          {/* <div className="text-center mt-4 text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <a href="/register" className="text-green-700 font-semibold hover:underline">Register</a>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 