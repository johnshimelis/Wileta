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
    timeout: 20000
});

api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const AuthProvider = ({ children }) => {
    // 1. Instant optimistic state initialization from cached storage (0ms delay)
    const [user, setUser] = useState(() => {
        try {
            const cached = localStorage.getItem('gp_cached_user');
            return cached ? JSON.parse(cached) : null;
        } catch (_) {
            return null;
        }
    });

    const [loading, setLoading] = useState(() => {
        // If there is no token, we are definitively not logged in -> 0ms initial loading!
        return !!localStorage.getItem('token') && !localStorage.getItem('gp_cached_user');
    });

    const [maintenanceInfo, setMaintenanceInfo] = useState({
        isMaintenance: false,
        message: '',
        supportEmail: 'biranalabs@gmail.com',
        supportPhone: '+251967432143'
    });

    const checkSystemStatus = useCallback(async () => {
        try {
            const res = await api.get('/system/status');
            if (res.data?.maintenance) {
                setMaintenanceInfo({
                    isMaintenance: true,
                    message: res.data.message,
                    supportEmail: res.data.supportEmail || 'biranalabs@gmail.com',
                    supportPhone: res.data.supportPhone || '+251967432143'
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
                        supportEmail: error.response.data.supportEmail || 'biranalabs@gmail.com',
                        supportPhone: error.response.data.supportPhone || '+251967432143'
                    });
                }
                return Promise.reject(error);
            }
        );

        return () => api.interceptors.response.eject(interceptor);
    }, []);

    // Fast non-blocking background revalidation
    useEffect(() => {
        let isMounted = true;
        const initAuth = async () => {
            // Non-blocking system check
            checkSystemStatus();

            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const res = await api.get('/auth/me');
                    if (isMounted) {
                        setUser(res.data);
                        localStorage.setItem('gp_cached_user', JSON.stringify(res.data));
                    }
                } catch (error) {
                    if (error.response?.status === 401 && isMounted) {
                        localStorage.removeItem('token');
                        localStorage.removeItem('gp_cached_user');
                        setUser(null);
                    }
                }
            }
            if (isMounted) {
                setLoading(false);
            }
        };

        initAuth();
        return () => { isMounted = false; };
    }, [checkSystemStatus]);

    const login = async (credentials) => {
        try {
            const res = await api.post('/auth/login', credentials);
            localStorage.setItem('token', res.data.token);
            if (res.data.user) {
                localStorage.setItem('gp_cached_user', JSON.stringify(res.data.user));
            }
            setUser(res.data.user);
            return { success: true, user: res.data.user };
        } catch (error) {
            return { success: false, error: error.response?.data?.error || 'Login failed' };
        }
    };

    const onboard = async (arg1, arg2, arg3) => {
        try {
            let payload = {};
            if (typeof arg1 === 'object' && arg1 !== null) {
                payload = arg1;
            } else if (arg3 !== undefined) {
                payload = { name: arg1, username: arg2, telebirr_number: arg3 };
            } else {
                payload = { username: arg1, telebirr_number: arg2 };
            }
            const res = await api.post('/auth/onboard', payload);
            localStorage.setItem('gp_cached_user', JSON.stringify(res.data));
            setUser(res.data);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.response?.data?.error || 'Onboarding failed' };
        }
    };

    const requestTelebirrOtp = async (phone) => {
        try {
            const res = await api.post('/auth/request-telebirr-otp', { phone, newPhone: phone });
            return {
                success: true,
                message: res.data?.message,
                devOtp: res.data?.devOtp,
                isPhoneChange: res.data?.isPhoneChange,
                oldPhoneMasked: res.data?.oldPhoneMasked,
                newPhone: res.data?.newPhone
            };
        } catch (error) {
            return { success: false, error: error.response?.data?.error || 'Failed to send verification code' };
        }
    };

    const verifyTelebirrOtp = async (phone, otp) => {
        try {
            const res = await api.post('/auth/verify-telebirr-otp', { phone, newPhone: phone, otp });
            const finalNum = res.data?.telebirr_number || phone;
            if (finalNum && user) {
                const updated = {
                    ...user,
                    ...(res.data?.user || {}),
                    phone: finalNum,
                    phoneVerified: true,
                    telebirr_number: finalNum,
                    telebirrAccount: { ...(user.telebirrAccount || {}), phoneNumber: finalNum, status: 'VERIFIED' }
                };
                setUser(updated);
                localStorage.setItem('gp_cached_user', JSON.stringify(updated));
            }
            return {
                success: true,
                message: res.data?.message || 'Telebirr verified successfully',
                telebirr_number: finalNum,
                user: res.data?.user
            };
        } catch (error) {
            return { success: false, error: error.response?.data?.error || 'Invalid or expired verification code' };
        }
    };

    const requestChangeTelebirrOtp = async (newPhone) => {
        try {
            const res = await api.post('/auth/request-change-telebirr-otp', { newPhone });
            return {
                success: true,
                message: res.data?.message,
                devOtp: res.data?.devOtp,
                isPhoneChange: res.data?.isPhoneChange,
                oldPhoneMasked: res.data?.oldPhoneMasked,
                newPhone: res.data?.newPhone
            };
        } catch (error) {
            return { success: false, error: error.response?.data?.error || 'Failed to send verification code' };
        }
    };

    const verifyChangeTelebirrOtp = async (newPhone, otp) => {
        return verifyTelebirrOtp(newPhone, otp);
    };

    const requestSignupOtp = async (phone) => {
        try {
            const res = await api.post('/auth/request-signup-otp', { phone });
            return { success: true, message: res.data?.message, devOtp: res.data?.devOtp };
        } catch (error) {
            return { success: false, error: error.response?.data?.error || 'Failed to send verification code' };
        }
    };

    const signup = async (userData) => {
        try {
            const payload = {
                ...userData,
                confirmPassword: userData.confirmPassword || userData.password
            };
            const res = await api.post('/auth/signup', payload);
            if (res.data.token) {
                localStorage.setItem('token', res.data.token);
            }
            if (res.data.user) {
                localStorage.setItem('gp_cached_user', JSON.stringify(res.data.user));
                setUser(res.data.user);
            }
            return { success: true, user: res.data.user, token: res.data.token };
        } catch (error) {
            return { success: false, error: error.response?.data?.error || 'Registration failed' };
        }
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout');
        } catch (e) {}
        localStorage.removeItem('token');
        localStorage.removeItem('gp_cached_user');
        setUser(null);
    };

    const logoutAll = async () => {
        try {
            await api.post('/auth/logout-all');
        } catch (e) {}
        localStorage.removeItem('token');
        localStorage.removeItem('gp_cached_user');
        setUser(null);
    };

    const value = {
        user,
        setUser,
        loading,
        signup,
        requestSignupOtp,
        requestTelebirrOtp,
        verifyTelebirrOtp,
        requestChangeTelebirrOtp,
        verifyChangeTelebirrOtp,
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
            {children}
        </AuthContext.Provider>
    );
};
