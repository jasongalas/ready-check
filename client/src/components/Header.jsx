import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
//import './Header.css';


const Header = () => {
 const [isLoggedIn, setIsLoggedIn] = useState(false);
 const navigate = useNavigate();


 const handleLoginLogout = () => {
   setIsLoggedIn(!isLoggedIn);
 }


 const goToLoginPage = () => {
   navigate('/login');
 }


 const goToSignUpPage = () => {
   navigate('/signup');
 }


 return (
   <header className="header">
     <div className="header-content">
       <h1 className="header-title">Ready Check</h1>
       <nav className="header-nav">
         <ul className="nav-list">
           <li className="nav-item"><a href="#home" className="nav-link">Home</a></li>
           <li className="nav-item"><a href="#profile" className="nav-link">Profile</a></li>
           <li className="nav-item"><a href="#ready" className="nav-link">Create your Ready Check</a></li>
         </ul>
       </nav>
       <div className="auth-buttons">
         {isLoggedIn ? (
           <button onClick={handleLoginLogout} className="auth-button">Log Out</button>
         ) : (
           <>
             <button onClick={goToLoginPage} className="auth-button">Log In</button>
             <button onClick={goToSignUpPage} className="auth-button">Sign Up</button>
           </>
         )}
       </div>
     </div>
   </header>
 );
}


export default Header;
