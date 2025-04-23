import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserAdmin = () => {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem('token'); // assuming token is stored here

  useEffect(() => {
    axios.get('/api/users', {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(res => setUsers(res.data))
    .catch(err => console.error(err));
  }, [token]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">All Users</h2>
      <ul className="space-y-2">
        {users.map(user => (
          <li key={user._id} className="p-4 border rounded-lg flex justify-between items-center">
            <div>
              <p><strong>{user.name}</strong> ({user.username})</p>
              <p>{user.email}</p>
            </div>
            {/* Buttons for Edit/Delete */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserAdmin;
