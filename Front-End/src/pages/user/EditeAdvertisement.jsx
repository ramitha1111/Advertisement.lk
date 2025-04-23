import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import updateAdvertisement from "./UpdateAdvertisement.jsx";

const EditAdvertisement = ({ item }) => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: item?.title || '',
    description: item?.description || '',
    price: item?.price || '',
    location: item?.location || '',
    featuredImage: item?.featuredImage || null,
  });
  const [previewUrl, setPreviewUrl] = useState(
    typeof item?.featuredImage === 'string' ? item.featuredImage : null
  );

  useEffect(() => {
    let imageUrl;

    if (formData.featuredImage instanceof File) {
      imageUrl = URL.createObjectURL(formData.featuredImage);
      setPreviewUrl(imageUrl);
    } else if (typeof formData.featuredImage === 'string') {
      setPreviewUrl(formData.featuredImage);
    }

    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
    };
  }, [formData.featuredImage]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, featuredImage: file }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('price', formData.price);
    formDataToSend.append('location', formData.location);
    formDataToSend.append('featuredImage', formData.featuredImage);

    try {
      const response = await updateAdvertisement(id, formDataToSend);
      console.log('Advertisement updated successfully:', response);
    } catch (error) {
      console.error('Error updating advertisement:', error);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Edit Advertisement</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Price
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label htmlFor="featuredImage" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Featured Image
          </label>
          {previewUrl && (
            <div className="mb-4">
              <img
                src={previewUrl}
                alt="Featured"
                className="w-full h-48 object-cover rounded-md"
              />
            </div>
          )}
          <input
            type="file"
            id="featuredImage"
            name="featuredImage"
            onChange={handleImageChange}
            accept="image/*"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-primary hover:bg-primary/90 text-white rounded-md"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditAdvertisement;