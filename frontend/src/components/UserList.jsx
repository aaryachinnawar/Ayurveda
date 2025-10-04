import React from 'react';

const UserList = ({ users, onEdit, onDelete, searchTerm }) => {
  // Filter users by username, role, or email
  const filteredUsers = searchTerm
    ? users.filter(
        (user) =>
          user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (user.email ? user.email.toLowerCase().includes(searchTerm.toLowerCase()) : false)
      )
    : users;

  return (
    <div className="w-full">
      <table className="w-full bg-white rounded-xl border border-gray-200 text-left mb-6 text-sm">
        {/* No colgroup, let columns auto-size */}
        <thead className="bg-gray-50">
          <tr>
            <th className="px-2 py-2 font-semibold text-gray-800">USERNAME</th>
            <th className="px-2 py-2 font-semibold text-gray-800">FIRST NAME</th>
            <th className="px-2 py-2 font-semibold text-gray-800">LAST NAME</th>
            <th className="px-2 py-2 font-semibold text-gray-800">ROLE</th>
            <th className="px-2 py-2 font-semibold text-gray-800">STATUS</th>
            <th className="px-2 py-2 font-semibold text-gray-800">EMAIL</th>
            <th className="px-2 py-2 font-semibold text-gray-800">PHONE</th>
            <th className="px-2 py-2 font-semibold text-gray-800">DEPARTMENT</th>
            <th className="px-2 py-2 font-semibold text-gray-800">EMPLOYEE ID</th>
            <th className="px-2 py-2 font-semibold text-gray-800">REPORTING MANAGER</th>
            <th className="px-2 py-2 font-semibold text-gray-800">ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.length === 0 ? (
            <tr><td colSpan="11" className="px-2 py-2 text-center text-gray-500">No users found.</td></tr>
          ) : (
            filteredUsers.map(user => (
              <tr key={user.id} className="border-t border-gray-100 hover:bg-gray-50 transition">
                <td className="px-2 py-2 text-gray-900 whitespace-normal">{user.username}</td>
                <td className="px-2 py-2 text-gray-700 whitespace-normal">{user.firstName}</td>
                <td className="px-2 py-2 text-gray-700 whitespace-normal">{user.lastName}</td>
                <td className="px-2 py-2 text-gray-700 whitespace-normal">{user.roleName}</td>
                <td className="px-2 py-2 text-gray-700 whitespace-normal">{user.status}</td>
                <td className="px-2 py-2 text-gray-700 whitespace-normal">{user.email}</td>
                <td className="px-2 py-2 text-gray-700 whitespace-normal">{user.phone || '-'}</td>
                <td className="px-2 py-2 text-gray-700 whitespace-normal">{user.department || '-'}</td>
                <td className="px-2 py-2 text-gray-700 whitespace-normal">{user.employeeId || '-'}</td>
                <td className="px-2 py-2 text-gray-700 whitespace-normal">{user.reportingManager || '-'}</td>
                <td className="px-2 py-2">
                  <span
                    onClick={() => onEdit(user)}
                    className="text-green-700 cursor-pointer font-medium hover:underline mr-2"
                  >
                    Edit
                  </span>
                  <span
                    onClick={() => onDelete(user.id)}
                    className="text-red-600 cursor-pointer font-medium hover:underline"
                  >
                    Delete
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserList; 