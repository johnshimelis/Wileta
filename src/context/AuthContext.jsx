import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const getApiBaseUrl = () => {
    if (import.meta.env.VITE_API_URL) {
        return import.meta.env.VITE_API_URL.replace(/\/$/, '') + '/api';
    }
    return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:5000/api'
        : 'https://wileta-backend.onrender.com/api';
};

// Axios instance with base URL & interceptors
export const api = axios.create({
    baseURL: getApiBaseUrl(),
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
    const [maintenanceInfo, setMaintenanceInfo] = useState({
        isMaintenance: false,
        message: '',
        supportEmail: '',
        supportPhone: ''
    });

    const checkSystemStatus = useCallback(async () => {
        try {
            const res = await api.get('/system/status');
            if (res.data?.maintenance) {
                setMaintenanceInfo({
                    isMaintenance: true,
                    message: res.data.message,
                    supportEmail: res.data.supportEmail,
                    supportPhone: res.data.supportPhone
                });
                return true;
            } else {
                setMaintenanceInfo(prev => ({ ...prev, isMaintenance: false }));
                return false;
            }
        } catch (e) {
            return false;
        }
    }, []);

    // Intercept 503 Maintenance Mode Responses Globally
    useEffect(() => {
        const interceptor = api.interceptors.response.use(
            response => response,
            error => {
                if (error.response?.status === 503 && error.response?.data?.maintenance) {
                    setMaintenanceInfo({
                        isMaintenance: true,
                        message: error.response.data.message || error.response.data.error,
                        supportEmail: error.response.data.supportEmail,
                        supportPhone: error.response.data.supportPhone
                    });
                }
                return Promise.reject(error);
            }
        );

        return () => api.interceptors.response.eject(interceptor);
    }, []);

    useEffect(() => {
        const initAuth = async () => {
            await checkSystemStatus();
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
    }, [checkSystemStatus]);

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

    const logout = async () => {
        try {
            await api.post('/auth/logout');
        } catch (e) {}
        localStorage.removeItem('token');
        setUser(null);
    };

    const logoutAll = async () => {
        try {
            await api.post('/auth/logout-all');
        } catch (e) {}
        localStorage.removeItem('token');
        setUser(null);
    };

    const value = {
        user,
        setUser,
        loading,
        login,
        logout,
        logoutAll,
        onboard,
        api,
        maintenanceInfo,
        checkSystemStatus
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
