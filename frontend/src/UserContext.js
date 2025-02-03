// UserContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        // Load user data from localStorage on initialization
        const savedUserData = localStorage.getItem('userData');
        return savedUserData ? JSON.parse(savedUserData) : null;
    });

    useEffect(() => {
        // Save user data to localStorage whenever it changes
        if (user) {
            localStorage.setItem('userData', JSON.stringify(user));
        } else {
            localStorage.removeItem('userData');
        }
    }, [user]);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    return useContext(UserContext);
};