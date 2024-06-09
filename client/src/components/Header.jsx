import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthServiceInstance } from '../utils/auth';
import ReadyCheckForm from './ReadyCheckForm';
import { useQuery } from '@apollo/client';
import { QUERY_USER, QUERY_ME, QUERY_NOTIFICATIONS } from '../utils/queries';
import Notifications from './Notifications';
import RCLogo from '.public/images/readycheck-logo-white'

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);  // New state for modal
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoggedIn(AuthServiceInstance.loggedIn());
  }, []);

  const { username: userParam } = useParams();
  const { loading, data } = useQuery(userParam ? QUERY_USER : QUERY_ME, {
    variables: { username: userParam },
  });

  const user = data?.me || data?.getUser || {};

  const { loading: notificationsLoading, data: notificationsData } = useQuery(QUERY_NOTIFICATIONS, {
    variables: { userId: user._id },
    skip: !isLoggedIn,
  });

  const notifications = notificationsData?.notifications || [];
  const unreadCount = notifications.filter((notification) => !notification.read).length;

  const handleLogout = () => {
    AuthServiceInstance.logout();
    setIsLoggedIn(false);
  }

  const goToLoginPage = () => {
    navigate('/login');
  }

  const goToSocialPage = () => {
    navigate('/social');
  }

  const goToSignUpPage = () => {
    navigate('/signup');
  }

  const goToHomePage = () => {
    navigate('/');
  }

  const goToProfilePage = () => {
    navigate('/myprofile');
  }

  const openReadyCheckModal = () => {
    setIsModalOpen(true);
  };

  const closeReadyCheckModal = () => {
    setIsModalOpen(false);
  };

  const toggleNotifications = () => {
    setNotificationsOpen(!notificationsOpen);
  };

  return (
    <header className="header bg-neutral-700">
      <div className="navbar bg-transparent text-navy-blue shadow-md">
        <div className="flex-1">
          <a className="btn btn-ghost text-neutral-100 text-2xl" onClick={goToHomePage}>
            <img src={RCLogo} alt="ReadyCheck" className="h-8 w-auto" />
          </a>
        </div>
        <div className="flex-none">
          <ul className="menu menu-horizontal text-neutral-100 px-1">
            {isLoggedIn ? (
              <>
                <li className="nav-item"><button onClick={goToHomePage} className="nav-link">Home</button></li>
                <li className="nav-item"><button onClick={goToProfilePage} className="nav-link">Profile</button></li>
                <li className="nav-item"><button onClick={goToSocialPage} className="nav-link">Social</button></li>
                <li className="nav-item"><button onClick={openReadyCheckModal} className="nav-link">New Ready Check</button></li>
                <li className="nav-item"><button onClick={handleLogout} className="auth-button">Log Out</button></li>
              </>
            ) : (
              <>
                <li className="nav-item"><button onClick={goToLoginPage} className="auth-button">Log In</button></li>
                <li className="nav-item"><button onClick={goToSignUpPage} className="auth-button">Sign Up</button></li>
              </>
            )}
          </ul>
          {isLoggedIn && (
            <div className="relative">
              <button className="btn btn-ghost btn-circle" onClick={toggleNotifications}>
                <div className="indicator">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="white"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                  {unreadCount > 0 && <span className="badge badge-xs badge-primary indicator-item">{unreadCount}</span>}
                </div>
              </button>
              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  <Notifications userId={user._id} />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {/* Modal */}
      {isModalOpen && (
        <dialog id="readyCheckModal" className="modal" open>
          <div className="modal-box">
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={closeReadyCheckModal}>✕</button>
            </form>
            <ReadyCheckForm userId={user._id} />
          </div>
        </dialog>
      )}
    </header>
  );
}

export default Header;
