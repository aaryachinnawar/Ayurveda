import React from 'react';
import { FiHome, FiUpload, FiFileText, FiLogOut, FiMessageSquare } from 'react-icons/fi';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const NavbarLanding = ({ minimal }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = JSON.parse(localStorage.getItem('auth'));

  if (minimal) {
    return (
      <nav className="w-full bg-[#A8BFA0] px-8 py-3 flex items-center justify-start rounded-t-xl">
        <span className="text-2xl">🌿</span>
        <span className="text-lg font-bold text-[#F7F5ED] tracking-wide ml-2">Ayurveda</span>
      </nav>
    );
  }

  const navLinks = [];
  if (auth && (auth.role === 'ADMIN' || auth.role === 'SUPER_ADMIN' || auth.role === 'COLLEGE_ADMIN')) {
    navLinks.push({ label: 'ADMIN', icon: <FiHome className="text-xl" />, path: '/admin' });
  } else {
    navLinks.push({ label: 'HOME', icon: <FiHome className="text-xl" />, path: '/home' });
    navLinks.push({ label: 'UPLOAD', icon: <FiUpload className="text-xl" />, path: '/upload' });
    navLinks.push({ label: 'REPORTS', icon: <FiFileText className="text-xl" />, path: '/reports' });
  }
  // Add bulk messaging for all authenticated users
  navLinks.push({ label: 'BULK MESSAGE', icon: <FiMessageSquare className="text-xl" />, path: '/bulk-messenger' });

  const handleLogout = () => {
    localStorage.removeItem('auth');
    toast.success('Logged out successfully!');
    navigate('/login');
  };

  return (
    <nav className="w-full bg-[#A8BFA0] px-8 py-3 flex items-center justify-between rounded-t-xl">
      {/* Logo and Title */}
      <div className="flex items-center gap-2">
        <span className="text-2xl">🌿</span>
        <span className="text-lg font-bold text-[#F7F5ED] tracking-wide">Ayurveda</span>
      </div>
      {/* Nav Links */}
      <div className="flex items-center gap-4">
        {navLinks.map((link) => (
          <button
            key={link.label}
            onClick={() => navigate(link.path)}
            className={`flex items-center gap-1 font-semibold px-3 py-1 rounded-full transition shadow-sm
              ${location.pathname === link.path
                ? 'bg-[#EDE6C7] text-[#3B5D2A]'
                : 'bg-transparent text-[#F7F5ED] hover:bg-[#EDE6C7] hover:text-[#3B5D2A]'}
            `}
          >
            {link.icon} {link.label}
          </button>
        ))}
      </div>
      {/* Logout Button */}
      <button onClick={handleLogout} className="bg-[#EDE6C7] text-[#3B5D2A] px-4 py-1 rounded-full font-semibold flex items-center gap-2 shadow hover:bg-[#f5e9c7] transition">
        <FiLogOut /> Logout
      </button>
    </nav>
  );
};

export default NavbarLanding; 