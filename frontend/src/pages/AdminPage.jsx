import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserList from '../components/UserList';
import UserForm from '../components/UserForm';
import { getUsers, createUser, updateUser, deleteUser, fetchRoles } from '../services/api';
import Modal from '../components/Modal';
import Layout from '../components/Layout';
import AnimatedButton from '../components/AnimatedButton';
import { FiSearch } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [roles, setRoles] = useState([]);
  const navigate = useNavigate();

  // Check authentication
  useEffect(() => {
    const auth = JSON.parse(localStorage.getItem('auth'));
    if (!auth || !auth.token) {
      navigate('/login');
    } else {
      fetchUsers();
      fetchRolesList();
    }
    // eslint-disable-next-line
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      setError('Failed to fetch users');
      toast.error('Failed to fetch users');
    }
  };

  const fetchRolesList = async () => {
    try {
      const data = await fetchRoles();
      setRoles(data);
    } catch (err) {
      toast.error('Failed to fetch roles');
    }
  };

  const handleAddNewUser = () => {
    setEditingUser(null);
    setShowCreateForm(true);
  };

  const handleAddOrUpdateUser = async (user) => {
    setError('');
    try {
      if (user.id) {
        const updated = await updateUser(user.id, user);
        setUsers(users.map(u => u.id === user.id ? updated : u));
        setEditingUser(null);
        setShowCreateForm(false);
        toast.success('User updated successfully!');
      } else {
        const created = await createUser(user);
        setUsers([...users, created]);
        setShowCreateForm(false);
        toast.success('User created successfully!');
      }
    } catch (err) {
      setError('Failed to save user');
      toast.error('Failed to save user');
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setShowCreateForm(true);
  };

  const handleDelete = async (id) => {
    setError('');
    try {
      await deleteUser(id);
      setUsers(users.filter(u => u.id !== id));
      if (editingUser && editingUser.id === id) setEditingUser(null);
      toast.success('User deleted successfully!');
    } catch (err) {
      setError('Failed to delete user');
      toast.error('Failed to delete user');
    }
  };

  const handleCancel = () => {
    setEditingUser(null);
    setShowCreateForm(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('auth');
    navigate('/login');
  };

  return (
    <Layout>
      <div className="w-full flex flex-col items-center min-h-[70vh] py-8 px-4 md:px-12">
        <div className="w-full max-w-7xl bg-white rounded-xl border border-gray-200 shadow-sm p-4 mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 w-full">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">User Management</h2>
              <button
                className="ml-4 px-4 py-2 bg-green-700 text-white rounded-lg font-semibold hover:bg-green-800 transition"
                onClick={() => navigate('/register')}
              >
                Register User
              </button>
            </div>
            <div className="relative w-full sm:w-64 ml-auto">
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search users..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 text-gray-700 bg-gray-50 text-sm shadow-sm"
                style={{ minWidth: 0 }}
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <FiSearch size={18} />
              </span>
            </div>
          </div>
          <UserList users={users} onEdit={handleEdit} onDelete={handleDelete} searchTerm={searchTerm} />
        </div>
        <Modal isOpen={showCreateForm || editingUser} onClose={handleCancel}>
          <UserForm onSubmit={handleAddOrUpdateUser} editingUser={editingUser} onCancel={handleCancel} roles={roles} />
        </Modal>
      </div>
    </Layout>
  );
};

export default AdminPage; 