import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';

import { AuthProvider } from './utils/authContext';


function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    return (
        <AuthProvider>
                <Header />
                <Outlet/> 
                <Footer />
        </AuthProvider>
    );
}

export default App;
