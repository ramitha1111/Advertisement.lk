import React from 'react';
import {Edit, ImageIcon, Trash2} from 'lucide-react';
//Have to create on edite function
import { useNavigate } from "react-router-dom";
                   const AdvertisementCard = ({ ad, onEdit, onDelete }) => {



                       return (
                           <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
                               {/* Top Section for Featured Image */}
                               <div className="mb-6">
                               {ad.featuredImage ? (
                                   <img
                                       src={URL.createObjectURL(ad.featuredImage)}
                                       alt="Featured"
                                       className="w-full h-64 object-cover rounded-md border border-gray-300 dark:border-gray-600"
                                   />
                               ) : (
                                   <div className="w-full h-64 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-md border border-gray-300 dark:border-gray-600">
                                       <ImageIcon size={48} className="text-gray-400 dark:text-gray-500" />
                                   </div>)}
                               </div>

                               {/* Advertisement Details */}
                               <div className="space-y-4">
                                   <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{ad.title}</h3>
                                   <p className="text-sm text-gray-600 dark:text-gray-400">{ad.description}</p>
                                   <p className="text-sm text-gray-600 dark:text-gray-400">
                                       <strong>Price:</strong> ${ad.price}
                                   </p>
                                   <p className="text-sm text-gray-600 dark:text-gray-400">
                                       <strong>Location:</strong> {ad.location}
                                   </p>
                               </div>

                               {/* Edit/Delete Buttons */}
                               <div className="mt-6 flex justify-end space-x-4">
                                   <button
                                       onClick={onEdit}
                                       className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 focus:ring-2 focus:ring-primary focus:outline-none"

                                   >
                                       <Edit size={16} className="inline-block mr-2" /> Edit
                                   </button>
                                   <button
                                       onClick={onDelete}
                                       className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:ring-2 focus:ring-red-400 focus:outline-none"
                                   >
                                       <Trash2 size={16} className="inline-block mr-2" /> Delete
                                   </button>
                               </div>
                           </div>
                       );
                   };

                   export default AdvertisementCard;