import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser, fetchRoles } from '../services/api';
import { toast } from 'react-hot-toast';
import UserForm from '../components/UserForm';

const RegisterPage = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = JSON.parse(localStorage.getItem('auth'));
    if (!auth || (auth.role !== 'SUPER_ADMIN' && auth.role !== 'COLLEGE_ADMIN')) {
      navigate('/login');
    }
    fetchRolesList();
  }, [navigate]);

  const fetchRolesList = async () => {
    try {
      const data = await fetchRoles();
      setRoles(data);
    } catch (err) {
      toast.error('Failed to fetch roles');
    }
  };

  const handleRegister = async (user) => {
    setLoading(true);
    try {
      await registerUser(user);
      toast.success('Registration successful!');
      navigate('/admin');
    } catch (err) {
      toast.error(err.message || 'Registration failed. Try a different username or check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F7F5ED] py-8">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl flex overflow-hidden">
        {/* Left: Image and Welcome */}
        <div className="hidden md:flex flex-col justify-end items-start bg-green-100 w-1/2 p-8 relative" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
          <div className="bg-black bg-opacity-40 rounded-xl p-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Welcome to Ayurvedic Wellness</h2>
            <p className="text-white text-sm">Join our community of healers and practitioners dedicated to holistic well-being through ancient wisdom.</p>
          </div>
        </div>
        {/* Right: Registration Form */}
        <div className="flex-1 flex flex-col justify-center items-center p-8">
          <div className="w-full max-w-md">
            <div className="flex flex-col items-center mb-6">
              <img src="https://cdn-icons-png.flaticon.com/512/2917/2917995.png" alt="Ayurveda Logo" className="w-12 h-12 mb-2" />
              <h2 className="text-2xl font-bold text-gray-800">Create your account</h2>
            </div>
            <UserForm onSubmit={handleRegister} roles={roles} />
            <div className="text-center mt-4 text-sm text-gray-600">
              Already have an account?{' '}
              <a href="/login" className="text-green-700 font-semibold hover:underline">Sign in</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage; 