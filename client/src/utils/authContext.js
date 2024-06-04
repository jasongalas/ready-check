import React, { createContext, useContext, useEffect, useState } from 'react';
import AuthService from './auth';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        setIsAuthenticated(AuthService.loggedIn());
    }, []);

    const login = (idToken) => {
        AuthService.login(idToken);
        setIsAuthenticated(true);
    };

    const logout = () => {
        AuthService.logout();
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
