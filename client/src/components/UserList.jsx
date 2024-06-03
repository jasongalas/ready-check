import React, { useEffect, useState } from 'react';
import { fetchUsers } from '../utils/api';

function UserList({ selectedUsers, setSelectedUsers }) {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const loadUsers = async () => {
            const usersData = await fetchUsers();
            setUsers(usersData);
        };
        loadUsers();
    }, []);

    const handleUserChange = (userId) => {
        setSelectedUsers((prev) =>
            prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
        );
    };

    return (
        <div>
            <label>Select Users:</label>
            <ul>
                {users.map((user) => (
                    <li key={user.id}>
                        <input
                            type="checkbox"
                            checked={selectedUsers.includes(user.id)}
                            onChange={() => handleUserChange(user.id)}
                        />
                        {user.name}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default UserList;
