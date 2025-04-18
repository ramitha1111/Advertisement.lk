import React from 'react';
import AdvertisementCard from './MyAdvertisement.jsx';
import {useNavigate} from "react-router-dom";

const MyAdvertisements = () => {
    const navigate=useNavigate()
    const advertisements = [
        {
            id: 1,
            title: 'iPhone 13',
            description: 'A brand new iPhone 13 for sale.',
            price: 999,
            location: 'New York',
            featuredImage: null, // Replace with a File object or URL
        },
    ];

    const handleEdit = (id) => {

        navigate(`/edit_advertisement/${id}`);

    };

    const handleDelete = (id) => {
        //Call the deleteAdvertisement End point the backend
        alert(`Delete ad with ID: ${id}`);
    };


    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {advertisements.map((ad) => (
                <AdvertisementCard
                    key={ad.id}
                    ad={ad}
                    onEdit={() => handleEdit(ad.id)}
                    onDelete={() => handleDelete(ad.id)}
                />
            ))}
        </div>
    );
};

export default MyAdvertisements;