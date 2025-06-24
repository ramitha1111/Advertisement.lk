import React, { useState, useEffect } from 'react';
import { getAllUsers, deleteUser } from '../../api/userApi';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Eye, Edit, Trash2, Search, Grid3X3, List, ShoppingBag } from 'lucide-react';
import ConfirmationDialog from '../../components/ConfirmationDialog';

const UserCard = ({ userData, onView, onUpdate, onDelete, onOrderHistory, viewMode }) => {
  if (viewMode === 'list') {
    return (
      <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md border border-gray-200 dark:border-gray-600 transition-all hover:shadow-lg">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
                  <span className="text-lg font-semibold text-gray-600 dark:text-gray-300">
                    {userData.username.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{userData.username}</h3>
                <p className="text-gray-500 dark:text-gray-300 text-sm">{userData.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className={`px-3 py-1 rounded-full text-sm ${
                userData.role === 'admin' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                userData.role === 'editor' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              }`}>
                {userData.role}
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={() => onView(userData._id)}
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md"
                  title="View User"
                >
                  <Eye className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onUpdate(userData._id)}
                  className="text-yellow-600 hover:text-yellow-800 dark:text-yellow-400 dark:hover:text-yellow-300 p-2 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-md"
                  title="Edit User"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onOrderHistory(userData._id)}
                  className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 p-2 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-md"
                  title="Order History"
                >
                  <ShoppingBag className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onDelete(userData._id)}
                  className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md"
                  title="Delete User"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-600 transition-all hover:shadow-lg">
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center mr-3">
                <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                  {userData.username.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{userData.username}</h3>
                <p className="text-gray-500 dark:text-gray-300 text-sm">{userData.email}</p>
              </div>
            </div>
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
          title="View User"
        >
          <Eye className="h-5 w-5" />
        </button>
        <button
          onClick={() => onUpdate(userData._id)}
          className="text-yellow-600 hover:text-yellow-800 dark:text-yellow-400 dark:hover:text-yellow-300 p-1"
          title="Edit User"
        >
          <Edit className="h-5 w-5" />
        </button>
        <button
          onClick={() => onOrderHistory(userData._id)}
          className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 p-1"
          title="Order History"
        >
          <ShoppingBag className="h-5 w-5" />
        </button>
        <button
          onClick={() => onDelete(userData._id)}
          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 p-1"
          title="Delete User"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

const UserAdmin = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const navigate = useNavigate();

  const { user, token } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await getAllUsers(token);
        setUsers(res.data);
        setFilteredUsers(res.data);
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

  // Filter users based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  const handleViewUser = (userId) => {
    navigate(`/admin/view-user/${userId}`);
  };

  const handleUpdateUser = (userId) => {
    navigate(`/admin/update-user/${userId}`);
  };

  const handleOrderHistory = (userId) => {
    navigate(`/admin/user-orders/${userId}`);
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
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 space-y-4 md:space-y-0">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">User Management</h1>
        <button
          onClick={handleCreateUser}
          className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md flex items-center w-fit"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add New User
        </button>
      </div>

      {/* Search and View Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-4 md:space-y-0">
        <div className="relative flex-1 md:max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search users by name, email, or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">View:</span>
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-md p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-white dark:bg-gray-600 text-primary shadow-sm' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
              title="Grid View"
            >
              <Grid3X3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list' 
                  ? 'bg-white dark:bg-gray-600 text-primary shadow-sm' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
              title="List View"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="mb-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Showing {filteredUsers.length} of {users.length} users
          {searchTerm && (
            <span className="ml-1">
              for "<span className="font-medium text-gray-900 dark:text-white">{searchTerm}</span>"
            </span>
          )}
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md mb-6">
          <p className="font-medium">Error</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {filteredUsers.length === 0 ? (
        <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md p-6 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            {searchTerm ? 'No users found matching your search criteria.' : 'No users found. Create your first user to get started.'}
          </p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="mt-2 text-primary hover:text-primary/80 text-sm font-medium"
            >
              Clear search
            </button>
          )}
        </div>
      ) : (
        <div className={
          viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            : "space-y-4"
        }>
          {filteredUsers.map((userData) => (
            <UserCard
              key={userData._id}
              userData={userData}
              onView={handleViewUser}
              onUpdate={handleUpdateUser}
              onDelete={handleDeleteUser}
              onOrderHistory={handleOrderHistory}
              viewMode={viewMode}
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