import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_NOTIFICATIONS } from '../utils/queries';
import { DELETE_NOTIFICATION } from '../utils/mutations';

function Notifications({ userId }) {
    const { data, refetch } = useQuery(QUERY_NOTIFICATIONS, { variables: { userId } });
    const [deleteNotification] = useMutation(DELETE_NOTIFICATION);

    const notifications = data?.notifications || [];

    const handleNotificationClick = async (notificationId) => {
        try {
            await deleteNotification({ variables: { notificationId } });
            refetch();
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    };


    return (
        <div className="p-2">
            <h3 className="text-lg font-bold">Recent Notifications</h3>
            {notifications.length === 0 ? (
                <p>No new notifications</p>
            ) : (
                notifications.map((notification) => (
                    <div key={notification._id}
                    className="py-2 border-b border-gray-200"
                    onClick={() => handleNotificationClick(notification._id)}
                >
                        <Link to={notification.readyCheck ? `/readycheck/${notification.readyCheck._id}` : `/profile/${notification.sender._id}`}>
                            <div>
                                <span className="font-medium">{notification.sender.username}</span> {notification.type === 'follow' ? 'followed' : notification.type === 'unfollow' ? 'unfollowed' : 'sent you a ReadyCheck'}.
                            </div>
                            <div className="text-sm text-gray-600">{notification.createdAt}</div>
                        </Link>
                    </div>
                ))
            )}
        </div>
    );
}


export default Notifications;