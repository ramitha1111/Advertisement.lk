import React, { useState, useEffect } from 'react';
import { getAllUsers, deleteUser } from '../../api/userApi';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Eye, Edit, Trash2 } from 'lucide-react';
import ConfirmationDialog from '../../components/ConfirmationDialog';

const UserCard = ({ userData, onView, onUpdate, onDelete }) => {
  return (
    <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-600 transition-all hover:shadow-lg">
      <div className="p-5">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{userData.username}</h3>
            <p className="text-gray-500 dark:text-gray-300 text-sm mb-2">{userData.email}</p>
            <span className={`px-2 py-1 rounded-full text-xs ${
              userData.role === 'admin' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
              userData.role === 'editor' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
              'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
            }`}>
              {userData.role}
            </span>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 dark:bg-gray-800 px-5 py-3 flex justify-end space-x-2">
        <button
          onClick={() => onView(userData._id)}
          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 p-1"
        >
          <Eye className="h-5 w-5" />
        </button>
        <button
          onClick={() => onUpdate(userData._id)}
          className="text-yellow-600 hover:text-yellow-800 dark:text-yellow-400 dark:hover:text-yellow-300 p-1"
        >
          <Edit className="h-5 w-5" />
        </button>
        <button
          onClick={() => onDelete(userData._id)}
          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 p-1"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

const UserAdmin = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const navigate = useNavigate();

  const { user, token } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await getAllUsers(token);
        setUsers(res.data);
        setError('');
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to load users. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token]);

  const handleViewUser = (userId) => {
    navigate(`/admin/view-user/${userId}`);
  };

  const handleUpdateUser = (userId) => {
    navigate(`/admin/update-user/${userId}`);
  };

  const handleDeleteUser = (userId) => {
    const userToDelete = users.find(user => user._id === userId);
    setUserToDelete(userToDelete);
    setSelectedUserId(userId);
    setShowConfirmDialog(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteUser(selectedUserId, token);
      setUsers((prev) => prev.filter((user) => user._id !== selectedUserId));
    } catch (err) {
      console.error('Delete failed:', err);
      setError('Failed to delete user. Please try again.');
    } finally {
      setShowConfirmDialog(false);
      setSelectedUserId(null);
      setUserToDelete(null);
    }
  };

  const cancelDelete = () => {
    setSelectedUserId(null);
    setUserToDelete(null);
    setShowConfirmDialog(false);
  };

  const handleCreateUser = () => {
    navigate('/admin/add-user');
  };

  const isAdmin = user && user.role === 'admin';

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">User Management</h1>
        <button
          onClick={handleCreateUser}
          className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add New User
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md mb-6">
          <p className="font-medium">Error</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {users.length === 0 ? (
        <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md p-6 text-center">
          <p className="text-gray-500 dark:text-gray-400">No users found. Create your first user to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((userData) => (
            <UserCard
              key={userData._id}
              userData={userData}
              onView={handleViewUser}
              onUpdate={handleUpdateUser}
              onDelete={handleDeleteUser}
            />
          ))}
        </div>
      )}

      <ConfirmationDialog
        isOpen={showConfirmDialog}
        title="Delete User"
        message={userToDelete ? `Are you sure you want to delete "${userToDelete.username}"? This action cannot be undone.` : "Are you sure you want to delete this user?"}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        confirmButtonClass="bg-red-600 hover:bg-red-700"
      />
    </div>
  );
};

export default UserAdmin;