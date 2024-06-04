import React, { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { QUERY_USERS, QUERY_FRIENDS, ADD_FRIEND, REMOVE_FRIEND } from '../utils/mutations';

function FriendsList({ userId }) {
    const { loading: loadingUsers, error: errorUsers, data: dataUsers } = useQuery(QUERY_USERS);
    const { loading: loadingFriends, error: errorFriends, data: dataFriends, refetch } = useQuery(QUERY_FRIENDS, { variables: { userId } });
    const [addFriend] = useMutation(ADD_FRIEND);
    const [removeFriend] = useMutation(REMOVE_FRIEND);
    const [search, setSearch] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [newFriendId, setNewFriendId] = useState('');

    useEffect(() => {
        if (dataUsers) {
            setFilteredUsers(
                dataUsers.users.filter(user =>
                    user.name.toLowerCase().includes(search.toLowerCase())
                )
            );
        }
    }, [search, dataUsers]);

    const handleAddFriend = async (e) => {
        e.preventDefault();
        try {
            await addFriend({ variables: { userId, friendId: newFriendId } });
            setNewFriendId('');
            refetch();
        } catch (err) {
            console.error('Error adding friend:', err);
        }
    };

    const handleRemoveFriend = async (friendId) => {
        try {
            await removeFriend({ variables: { userId, friendId } });
            refetch();
        } catch (err) {
            console.error('Error removing friend:', err);
        }
    };

    if (loadingUsers || loadingFriends) return <div>Loading...</div>;
    if (errorUsers || errorFriends) return <div>Error loading data.</div>;

    return (
        <div>
            <h1>Friends List</h1>
            <input
                type="text"
                placeholder="Search users"
                value={search}
                onChange={(e) => setSearch(e.tarQUERY.value)}
            />
            <form onSubmit={handleAddFriend}>
                <select
                    value={newFriendId}
                    onChange={(e) => setNewFriendId(e.tarQUERY.value)}
                >
                    <option value="">Select a user to add</option>
                    {filteredUsers.map((user) => (
                        <option key={user.id} value={user.id}>{user.name}</option>
                    ))}
                </select>
                <button type="submit">Add Friend</button>
            </form>
            <ul>
                {dataFriends.user.friends.map((friend) => (
                    <li key={friend.id}>
                        {friend.name}
                        <button onClick={() => handleRemoveFriend(friend.id)}>Remove</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default FriendsList;
