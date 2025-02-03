import React, { createContext, useState, useEffect, useContext } from 'react';

// Create the AuthContext
export const AuthContext = createContext();

// Create a custom hook to use the AuthContext
export const useAuth = () => {
    return useContext(AuthContext);
};

// AuthProvider component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

    // Check localStorage for user, token, and profile data on initial load
    useEffect(() => {
        const storedUser = window.localStorage.getItem('user');
        const storedToken = window.localStorage.getItem('token');
        const storedProfile = window.localStorage.getItem('profile');

        if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser));
            setToken(storedToken);

            // If profile data exists, merge it with the user object
            if (storedProfile) {
                setUser((prevUser) => ({
                    ...prevUser,
                    ...JSON.parse(storedProfile),
                }));
            }
        }
    }, []);

    const login = (loginResponse) => {
        const { token, user } = loginResponse;
        setUser(user);
        setToken(token);
        window.localStorage.setItem('user', JSON.stringify(user));
        window.localStorage.setItem('token', token);
    };

    const updateProfile = (profileData) => {
        setUser((prevUser) => {
            const updatedUser = { ...prevUser, ...profileData };
            window.localStorage.setItem('user', JSON.stringify(updatedUser)); // Update user in localStorage
            return updatedUser;
        });
        window.localStorage.setItem('profile', JSON.stringify(profileData)); // Store profile data in localStorage
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        window.localStorage.removeItem('user'); // Remove user from localStorage
        window.localStorage.removeItem('token'); // Remove token from localStorage
        window.localStorage.removeItem('profile'); // Remove profile data from localStorage
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, updateProfile }}>
            {children}
        </AuthContext.Provider>
    );
};