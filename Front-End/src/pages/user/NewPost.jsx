import React, { useState} from 'react'
import ReactQuill from 'react-quill';

import 'react-quill/dist/quill.snow.css';
import {createAdvertisement} from "../../api/AdvertisementApi.js";
import "../../hooks/useAuth.js";
import {useSelector} from "react-redux"; // Import Quill styles
const CreateAd =  () => {
    const [ad, setAd] = useState({
        title: '',
        description: '',
        price: '',
        location: '',
        email: '',
        phone: '',
        category: '',
        subcategory: '',
        images: [],
        featuredImage: null,
    });

    //
    const {token} = useSelector((state) => state.auth);
    const [imagePreviews, setImagePreviews] = useState([]);
    const categories = {
        Electronics: ['Mobile Phones', 'Laptops', 'Cameras'],
        Vehicles: ['Cars', 'Motorcycles', 'Bicycles'],
        RealEstate: ['Houses', 'Apartments', 'Land'],
    };

    const handleChange = (e) => {
        const {name, value} = e.target;
        setAd((prev) => ({...prev, [name]: value}));
        if (name === 'category') {
            setAd((prev) => ({...prev, subcategory: ''}));
        }
    };

    const handleDescriptionChange = (value) => {
        setAd((prev) => ({...prev, description: value}));
    };

    const handlePost = async (e) => {
        e.preventDefault();
        const formData = new FormData();

        if (ad.featuredImage) {
            formData.append('featuredImage', ad.featuredImage);
        }

        ad.images.forEach((image, index) => {
            formData.append(`images[${index}]`, image);
        });

        const previews = ad.images.map(file => URL.createObjectURL(file));
        setImagePreviews(previews);

        try {
            const response = await createAdvertisement(formData, token);

            if (response.status === 200) {
                alert('Advertisement created successfully!');
            } else {
                alert('Failed to create advertisement.');
            }
        } catch (error) {
            console.error('Error creating advertisement:', error);
            alert('An error occurred while creating the advertisement.');
        }
    };


    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setAd((prev) => ({ ...prev, images: files }));
    };

    const handleFeaturedImageChange = (e) => {
        const file = e.target.files[0];
        setAd((prev) => ({ ...prev, featuredImage: file }));
    };




    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Create Advertisement</h2>

            <form onSubmit={handlePost} className="space-y-6">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={ad.title}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                    />
                </div>

                <div>
                    <label htmlFor="description"
                           className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Description
                    </label>
                    <ReactQuill
                        value={ad.description}
                        onChange={handleDescriptionChange}
                        className="bg-white dark:bg-gray-700 dark:text-white"
                    />
                </div>
                {/* Other fields */}
                <div>
                    <label htmlFor="images" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Upload Images
                    </label>
                    <input
                        type="file"
                        id="images"
                        name="images"
                        multiple
                        onChange={handleImageChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                    />
                    <div className="mt-2 flex flex-wrap gap-2">
                        {ad.images.map((image, index) => (
                            <img
                                key={index}
                                src={URL.createObjectURL(image)}
                                alt={`Ad Image ${index + 1}`}
                                className="w-20 h-20 object-cover rounded-md"
                            />
                        ))}
                    </div>
                </div>

                <div>
                    <label htmlFor="featuredImage" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Featured Image
                    </label>
                    <input
                        type="file"
                        id="featuredImage"
                        name="featuredImage"
                        onChange={handleFeaturedImageChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                    />
                    {ad.featuredImage && (
                        <div className="mt-2">
                            <img
                                src={URL.createObjectURL(ad.featuredImage)}
                                alt="Featured"
                                className="w-32 h-32 object-cover rounded-md"
                            />
                        </div>
                    )}
                </div>


                <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Price
                    </label>
                    <input
                        type="number"
                        id="price"
                        name="price"
                        value={ad.price}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                    />
                </div>

                <div>
                    <label htmlFor="location"
                           className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Location
                    </label>
                    <input
                        type="text"
                        id="location"
                        name="location"
                        value={ad.location}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                    />
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Contact Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={ad.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                    />
                </div>

                <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Contact Phone
                    </label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={ad.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                    />
                </div>
                <div>
                    <label htmlFor="category"
                           className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Category
                    </label>
                    <select
                        id="category"
                        name="category"
                        value={ad.category}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                    >
                        <option value="">Select a category</option>
                        {Object.keys(categories).map(category => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="subcategory"
                           className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Subcategory
                    </label>
                    <select
                        id="subcategory"
                        name="subcategory"
                        value={ad.subcategory}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                        disabled={!ad.category}
                    >
                        <option value="">Select a subcategory</option>
                        {ad.category &&
                            categories[ad.category].map(subcategory => (
                                <option key={subcategory} value={subcategory}>
                                    {subcategory}
                                </option>
                            ))}
                    </select>
                </div>

                <div className="flex justify-end">
                    <button
                        onClick={handlePost}
                        type="submit"
                        className="px-6 py-2 bg-primary hover:bg-primary/90 text-white rounded-md"
                    >
                        Post
                    </button>
                </div>
            </form>
        </div>
    )
}



export default CreateAd;