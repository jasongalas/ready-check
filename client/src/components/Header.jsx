import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthServiceInstance  } from '../utils/auth';
import ReadyCheckForm from './ReadyCheckForm';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);  // New state for modal
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoggedIn(AuthServiceInstance.loggedIn());
  }, []);

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


  return (
    <header className="header">
      <div className="navbar bg-transparent text-navy-blue shadow-md">
        <div className="flex-1">
          <a className="btn btn-ghost text-xl" onClick={goToHomePage}>ReadyCheck</a>
        </div>
        <div className="flex-none">
          <ul className="menu menu-horizontal px-1">
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
            <button className="btn btn-ghost btn-circle">
              <div className="indicator">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                <span className="badge badge-xs badge-primary indicator-item"></span>
              </div>
            </button>
          )}
        </div>
      </div>
      {/* Modal */}
      {isModalOpen && (
        <dialog id="my_modal_3" className="modal" open>
          <div className="modal-box">
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={closeReadyCheckModal}>✕</button>
            </form>
            <ReadyCheckForm userId={1} />
          </div>
        </dialog>
      )}
    </header>
  );
}

export default Header;
