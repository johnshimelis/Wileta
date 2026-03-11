import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// Axios instance with base URL & interceptors - DEFINED OUTSIDE TO PREVENT INFINITE INTERCEPTOR LOOP
const api = axios.create({
    baseURL: 'https://wileta-backend.onrender.com/api',
});

api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const res = await api.get('/auth/me');
                    setUser(res.data);
                } catch (error) {
                    console.error("Token invalid or expired", error);
                    localStorage.removeItem('token');
                }
            }
            setLoading(false);
        };
        initAuth();
    }, []);

    const login = async (credentials) => {
        try {
            const res = await api.post('/auth/login', credentials);
            localStorage.setItem('token', res.data.token);
            setUser(res.data.user);
            return { success: true, user: res.data.user };
        } catch (error) {
            return { success: false, error: error.response?.data?.error || 'Login failed' };
        }
    };

    const onboard = async (name, username, telebirr_number) => {
        try {
            const res = await api.post('/auth/onboard', { name, username, telebirr_number });
            setUser(res.data);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.response?.data?.error || 'Onboarding failed' };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    const value = {
        user,
        setUser,
        loading,
        login,
        logout,
        onboard,
        api
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
