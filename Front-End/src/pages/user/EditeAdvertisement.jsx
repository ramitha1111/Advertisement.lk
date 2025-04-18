import React, {useEffect, useState} from 'react';

const EditAdvertisement = ({ ad, onUpdate }) => {
  const [formData, setFormData] = useState({
    title: ad.title || '',
    description: ad.description || '',
    price: ad.price || '',
    location: ad.location || '',
    featuredImage: ad.featuredImage || null,
  });
    useEffect(() => {
    let imageUrl;
    if(formData.featuredImage instanceof File){
        imageUrl=URL.createObjectURL(formData.featuredImage);
    }
    return ()=>{
        if(imageUrl) URL.revokeObjectURL(imageUrl)
    }
    },[ formData.featuredImage]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, featuredImage: file }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Call the onUpdate function with the updated data
    onUpdate(formData);
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
          {formData.featuredImage && (
            <div className="mb-4">
              <img
                src={formData.featuredImage instanceof File ? URL.createObjectURL(formData.featuredImage) : formData.featuredImage}
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