import { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import SuccessMessage from '../components/SuccessMessage';
import { Check, X, Users } from 'lucide-react';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await adminAPI.getAllUsers();
      setUsers(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleActivate = async (userId) => {
    try {
      await adminAPI.activateUser(userId);
      setSuccess('User activated successfully!');
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to activate user');
    }
  };

  const handleDeactivate = async (userId) => {
    if (!window.confirm('Are you sure you want to deactivate this user?')) return;

    try {
      await adminAPI.deactivateUser(userId);
      setSuccess('User deactivated successfully!');
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to deactivate user');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Users className="h-8 w-8 text-primary-600 mr-3" />
        <h1 className="page-title">User Management</h1>
      </div>

      <ErrorMessage message={error} onClose={() => setError('')} />
      <SuccessMessage message={success} onClose={() => setSuccess('')} />

      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">User ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.userId}>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">{user.userId}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                    {user.firstName} {user.lastName}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {user.phoneNumber || 'N/A'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-primary-100 text-primary-800">
                      {user.roles.join(', ')}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        user.isActive
                          ? 'bg-success-100 text-success-800'
                          : 'bg-danger-100 text-danger-800'
                      }`}
                    >
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    {user.isActive ? (
                      <button
                        onClick={() => handleDeactivate(user.userId)}
                        className="text-danger-600 hover:text-danger-800 flex items-center"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Deactivate
                      </button>
                    ) : (
                      <button
                        onClick={() => handleActivate(user.userId)}
                        className="text-success-600 hover:text-success-800 flex items-center"
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Activate
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && (
            <p className="text-center text-gray-500 py-8">No users found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserManagement;




