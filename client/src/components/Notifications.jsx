import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_NOTIFICATIONS } from '../utils/queries';

function Notifications({ userId }) {
    const { data } = useQuery(GET_NOTIFICATIONS, { variables: { userId } });

    return (
        <div>
            <h1>Notifications</h1>
            <ul>
                {data?.notifications.map(notification => (
                    <li key={notification.id}>
                        {notification.type === 'FriendRequest' ? (
                            <>
                                {notification.sender.name} sent you a friend request.
                                <button>Accept</button>
                                <button>Decline</button>
                            </>
                        ) : (
                            <>
                                {notification.readyCheck.title} - {notification.readyCheck.description}
                                <button>Accept</button>
                                <button>Accept-Late</button>
                                <button>Decline</button>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Notifications;
