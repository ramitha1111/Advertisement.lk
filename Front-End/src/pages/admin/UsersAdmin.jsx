import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getAllUsers, deleteUser } from '../../api/userApi'; // you'll need to implement getAllUsers
import { Link } from 'react-router-dom';
import ConfirmationDialog from '../../components/ConfirmationDialog';
import { useNavigate } from 'react-router-dom';

const UserAdmin = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const navigate = useNavigate();

  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getAllUsers(token);
        setUsers(res.data); // assuming res.data is an array of users
      } catch (err) {
        setError('Failed to load users.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token]);

  const handleDelete = (userId) => {
    setSelectedUserId(userId);
    setShowConfirmDialog(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteUser(selectedUserId, token);
      setUsers((prev) => prev.filter((user) => user._id !== selectedUserId));
    } catch (err) {
      console.error('Delete failed:', err);
    } finally {
      setShowConfirmDialog(false);
    }
  };

  const cancelDelete = () => {
    setSelectedUserId(null);
    setShowConfirmDialog(false);
  };

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="px-6 py-8 max-w-5xl mx-auto">
      <div className="overflow-x-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white border-b pb-3">
          User Management
        </h2>
        <button
          onClick={() => navigate('/admin/dashboard/add-user')}
          className="px-4 py-2 bg-primary text-white font-semibold rounded-md hover:bg-primary-dark transition"
        >
          + Add User
        </button>
      </div>
        <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b">Name</th>
              <th className="px-4 py-2 border-b">Email</th>
              <th className="px-4 py-2 border-b">Role</th>
              <th className="px-4 py-2 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="text-center">
                <td className="px-4 py-2 border-b">{user.username}</td>
                <td className="px-4 py-2 border-b">{user.email}</td>
                <td className="px-4 py-2 border-b capitalize">{user.role}</td>
                <td className="px-4 py-2 border-b space-x-2">
                  <Link
                    to={`/admin/update-user?id=${user._id}`}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showConfirmDialog && (
        <ConfirmationDialog
          isOpen={showConfirmDialog}
          title="Delete User"
          message="Are you sure you want to delete this user? This action cannot be undone."
          confirmLabel="Delete"
          cancelLabel="Cancel"
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
          confirmButtonClass="bg-red-600 hover:bg-red-700"
        />
      )}
    </div>
  );
};

export default UserAdmin;