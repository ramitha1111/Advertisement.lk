'use client';

import { useCallback, useEffect, useState } from 'react';
import AdvertisementCard from '../user/AdvertisementCardNew.jsx';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { deleteAdvertisement, getAdvertisementsByUser, getAllAdvertisementsAdmin, changeAdvertisementStatus } from '../../api/advertisementApi.js';

import useAdvertisement from "../../hooks/useAdvertisement.js";
import ConfirmationDialog from '../../components/ConfirmationDialog.jsx';

const AdvertisementAdmin = () => {
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.auth);
  const { fetchAdvertisement, clearAdvertisements } = useAdvertisement();
  const [isLoading, setIsLoading] = useState(true);
  const [advertisementData, setAdvertisementData] = useState([]);
  const dispatch = useDispatch();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [error, setError] = useState('');
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(null); // Track which ad is being updated

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!user || !token) {
      navigate('/login');
    }
  }, [user, token, navigate]);

  const confirmDelete = async () => {
    try {
      if (!selectedItemId) return;

      await deleteAdvertisement(selectedItemId, token);
      // Refresh the advertisements list after deletion
      fetchAdvertisementsData(user, token);
      setError('');
    } catch (error) {
      console.error('Error deleting ad:', error);
      setError('Failed to delete ad. Please try again.');
    } finally {
      setShowConfirmDialog(false);
      setSelectedItemId(null);
    }
  };

  const cancelDelete = () => {
    setShowConfirmDialog(false);
    setSelectedItemId(null);
  };

  // Complete toggle ad status function
  const toggleAdStatus = async (item) => {
    try {
      // Only allow toggling between active and pending status
      if (item.status !== 'active' && item.status !== 'pending') {
        setError('Can only toggle between active and pending status.');
        return;
      }

      setStatusUpdateLoading(item._id);
      setError('');

      // Call the API to change status
      await changeAdvertisementStatus(item._id, token);
      
      // Refresh the advertisements list after toggling status
      await fetchAdvertisementsData(user, token);
      
    } catch (error) {
      console.error('Error toggling ad status:', error);
      setError('Failed to toggle ad status. Please try again.');
    } finally {
      setStatusUpdateLoading(null);
    }
  };

  // Fetch advertisements created by the current user
  const fetchAdvertisementsData = useCallback(async (user, token) => {
    setIsLoading(true);
    try {
      if (token) {
        const adsData = await getAllAdvertisementsAdmin(token);
        setAdvertisementData(adsData || []);
      }
    } catch (error) {
      console.error('Error fetching advertisements:', error);
      setError('Failed to fetch advertisements. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    if (user?.id && token) {
      fetchAdvertisementsData(user, token);
    }
  }, [user, token, fetchAdvertisementsData]);

  const handleEdit = (item) => {
    navigate('../../user/update-advertisement/' + item._id);
  };

  const handleDelete = (item) => {
    setSelectedItemId(item._id);
    setShowConfirmDialog(true);
  };

  const handleToggleStatus = (item) => {
    // Prevent multiple simultaneous status updates
    if (statusUpdateLoading === item._id) return;
    
    toggleAdStatus(item);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h1 className="text-xl font-bold mb-6">Advertisements Management</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
          <button 
            onClick={() => setError('')}
            className="text-red-700 hover:text-red-900 font-medium underline mt-1"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Status Update Loading Indicator */}
      {statusUpdateLoading && (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4">
          <p>Updating advertisement status...</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
        {advertisementData && advertisementData.length > 0 ? (
          advertisementData.map((item) => {
            const ad = item?._doc || item; // fallback if not using ._doc
            return (
              <div key={ad._id} className={statusUpdateLoading === ad._id ? 'opacity-50 pointer-events-none' : ''}>
                <AdvertisementCard
                  item={ad}
                  onEdit={() => handleEdit(ad)}
                  onDelete={() => handleDelete(ad)}
                  onToggleStatus={() => handleToggleStatus(ad)}
                  showStatusToggle={true} // Show toggle for admin
                />
              </div>
            );
          })
        ) : (
          <div className="col-span-full text-center text-gray-500">
            No advertisements found.
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <ConfirmationDialog
          isOpen={showConfirmDialog}
          title="Delete Advertisement"
          message="Are you sure you want to delete this ad? This action cannot be undone."
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

export default AdvertisementAdmin;