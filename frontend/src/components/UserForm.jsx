import React, { useState, useEffect } from 'react';
import AnimatedButton from './AnimatedButton';

const UserForm = ({ onSubmit, editingUser, onCancel, roles }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [reportingManager, setReportingManager] = useState('');
  const [status, setStatus] = useState('ACTIVE');
  const [roleId, setRoleId] = useState('');

  useEffect(() => {
    if (editingUser) {
      setUsername(editingUser.username || '');
      setPassword('');
      setFirstName(editingUser.firstName || '');
      setLastName(editingUser.lastName || '');
      setEmail(editingUser.email || '');
      setPhone(editingUser.phone || '');
      setDepartment(editingUser.department || '');
      setEmployeeId(editingUser.employeeId || '');
      setReportingManager(editingUser.reportingManager || '');
      setStatus(editingUser.status || 'ACTIVE');
      setRoleId(editingUser.roleId || (editingUser.role && editingUser.role.id) || '');
    } else {
      setUsername('');
      setPassword('');
      setFirstName('');
      setLastName('');
      setEmail('');
      setPhone('');
      setDepartment('');
      setEmployeeId('');
      setReportingManager('');
      setStatus('ACTIVE');
      setRoleId('');
    }
  }, [editingUser]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      id: editingUser ? editingUser.id : undefined,
      username,
      password: password || undefined,
      firstName,
      lastName,
      email,
      phone,
      department,
      employeeId,
      reportingManager,
      status,
      roleId: Number(roleId)
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg shadow flex flex-col gap-4 w-full">
      <div className="flex flex-col gap-1">
        <label className="font-medium text-gray-700">Username:</label>
        <input type="text" value={username} onChange={e => setUsername(e.target.value)} required className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-black" />
      </div>
      <div className="flex flex-col gap-1">
        <label className="font-medium text-gray-700">Password:</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder={editingUser ? "Leave blank to keep current" : ""} className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-black" />
      </div>
      <div className="flex flex-col gap-1">
        <label className="font-medium text-gray-700">First Name:</label>
        <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} required className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-black" />
      </div>
      <div className="flex flex-col gap-1">
        <label className="font-medium text-gray-700">Last Name:</label>
        <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} required className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-black" />
      </div>
      <div className="flex flex-col gap-1">
        <label className="font-medium text-gray-700">Email:</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-black" />
      </div>
      <div className="flex flex-col gap-1">
        <label className="font-medium text-gray-700">Phone:</label>
        <input type="text" value={phone} onChange={e => setPhone(e.target.value)} required className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-black" />
      </div>
      <div className="flex flex-col gap-1">
        <label className="font-medium text-gray-700">Department:</label>
        <input type="text" value={department} onChange={e => setDepartment(e.target.value)} className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-black" />
      </div>
      <div className="flex flex-col gap-1">
        <label className="font-medium text-gray-700">Employee ID:</label>
        <input type="text" value={employeeId} onChange={e => setEmployeeId(e.target.value)} className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-black" />
      </div>
      <div className="flex flex-col gap-1">
        <label className="font-medium text-gray-700">Reporting Manager:</label>
        <input type="text" value={reportingManager} onChange={e => setReportingManager(e.target.value)} className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-black" />
      </div>
      <div className="flex flex-col gap-1">
        <label className="font-medium text-gray-700">Status:</label>
        <select value={status} onChange={e => setStatus(e.target.value)} className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-black">
          <option value="ACTIVE">ACTIVE</option>
          <option value="INACTIVE">INACTIVE</option>
          <option value="PENDING">PENDING</option>
        </select>
      </div>
      <div className="flex flex-col gap-1">
        <label className="font-medium text-gray-700">Role:</label>
        <select value={roleId} onChange={e => setRoleId(e.target.value)} required className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-black">
          <option value="">Select Role</option>
          {roles && roles.map(role => (
            <option key={role.id} value={role.id}>{role.name}</option>
          ))}
        </select>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 mt-2">
        <AnimatedButton type="submit" className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition flex items-center justify-center gap-1">
           {editingUser ? 'Update' : 'Add'} User
        </AnimatedButton>
        {editingUser && <AnimatedButton type="button" onClick={onCancel} className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-gray-500 transition flex items-center justify-center gap-1">
          Cancel
        </AnimatedButton>}
      </div>
    </form>
  );
};

export default UserForm; 