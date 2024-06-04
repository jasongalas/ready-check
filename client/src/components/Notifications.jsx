import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { QUERY_NOTIFICATIONS } from '../utils/queries';

function Notifications({ userId }) {
    const { data } = useQuery(QUERY_NOTIFICATIONS, { variables: { userId } });

    return (
        <div className="navbar-end">
            <div className="dropdown">
                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
                <ul className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                    <div className="collapse collapse-arrow bg-base-200">
                        <input type="radio" name="notification-accordion" defaultChecked />
                        <div className="collapse-title text-xl font-medium">Recent Notifications</div>
                        <div className="collapse-content">
                            {data &&
                                data.notifications.map((notification) => (
                                    <div key={notification.id}>
                                        <Link to={`/rsvp/${notification.relatedId}`}>
                                            <div className="collapse-title text-lg font-medium">{notification.title}</div>
                                            <div className="collapse-content">
                                                <p>{notification.message}</p>
                                            </div>
                                        </Link>
                                    </div>
                                ))}
                        </div>
                    </div>
                </ul>
            </div>
            <button className="btn btn-ghost btn-circle">
                <div className="indicator">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                    <span className="badge badge-xs badge-primary indicator-item"></span>
                </div>
            </button>
        </div>
    );
}

export default Notifications;