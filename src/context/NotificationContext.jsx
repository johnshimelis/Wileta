import React, { createContext, useContext, useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, Bell, XCircle } from 'lucide-react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { soundFx } from '../utils/soundFx';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
    // Local ephemeral toasts
    const [notifications, setNotifications] = useState([]);

    // Persistent backend dropdown notifications
    const [drawerNotifications, setDrawerNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    // Safe access to AuthContext
    const authContext = useAuth();
    const user = authContext?.user;
    const api = authContext?.api;

    const fetchNotifications = async () => {
        if (!user || !api) return;
        try {
            const res = await api.get('/notifications');
            const list = Array.isArray(res.data) 
                ? res.data 
                : (res.data?.notifications || res.data?.data || []);
            setDrawerNotifications(list);
            const unread = res.data?.unreadCount !== undefined 
                ? res.data.unreadCount 
                : list.filter(n => !n.isRead && !n.read).length;
            setUnreadCount(unread);
        } catch (error) {
            console.error('Failed to fetch backend notifications', error);
        }
    };

    // Real-time WebSocket connection + 30s background sync
    useEffect(() => {
        if (!user || !api) {
            setDrawerNotifications([]);
            setUnreadCount(0);
            return;
        }

        fetchNotifications();

        const socketBaseUrl = import.meta.env.VITE_API_URL 
            ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '') 
            : (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
                ? 'http://localhost:5000'
                : 'https://wileta-backend.onrender.com');

        const socket = io(socketBaseUrl, {
            transports: ['websocket', 'polling'],
            reconnectionAttempts: 5,
            timeout: 10000
        });

        const userId = (user._id || user.id)?.toString();

        socket.on('connect', () => {
            if (userId) {
                socket.emit('join', userId);
            }
        });

        socket.on('new_notification', (data) => {
            // On-the-fly badge and list update without reload!
            setUnreadCount(prev => prev + 1);

            setDrawerNotifications(prev => {
                const exists = prev.some(n => (data._id && n._id === data._id));
                if (exists) return prev;
                return [{
                    _id: data._id || `live-${Date.now()}`,
                    title: data.title || 'New Notification',
                    message: data.body || data.message || '',
                    category: data.category || 'system',
                    type: data.type || 'info',
                    isRead: false,
                    createdAt: data.createdAt || new Date().toISOString()
                }, ...prev];
            });

            try { soundFx.playPop(); } catch (e) {}

            triggerNotification({
                title: data.title || 'GurshaPay Alert',
                message: data.body || data.message || '',
                type: data.type || 'info',
                duration: 5000
            });
        });

        const interval = setInterval(fetchNotifications, 30000);

        return () => {
            socket.disconnect();
            clearInterval(interval);
        };
    }, [user, api]);

    const markAsRead = async (id) => {
        if (!api) return;

        // OPTIMISTIC UPDATE: Mark item as read
        setDrawerNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));

        try {
            await api.put(`/notifications/${id}/read`);
        } catch (error) {
            console.error('Failed to mark notification as read', error);
            try { await api.post(`/notifications/${id}/read`); } catch (e) { }
        }
    };

    const dismissNotification = async (id) => {
        if (!api) return;

        // OPTIMISTIC UPDATE: Remove item from list
        setDrawerNotifications(prev => {
            const target = prev.find(n => n._id === id);
            if (target && !target.isRead) {
                setUnreadCount(u => Math.max(0, u - 1));
            }
            return prev.filter(n => n._id !== id);
        });

        try {
            await api.delete(`/notifications/${id}`);
        } catch (error) {
            console.error('Failed to delete notification', error);
        }
    };

    const markAllAsRead = async () => {
        if (!api || unreadCount === 0) return;

        // OPTIMISTIC UPDATE: Mark all instantly
        setDrawerNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        setUnreadCount(0);

        try {
            await api.put('/notifications/read-all');
        } catch (error) {
            console.error('Failed to mark all notifications as read', error);
            try { await api.post('/notifications/mark-all-read'); } catch (e) { }
        }
    };

    const deleteAllNotifications = async () => {
        if (!api || drawerNotifications.length === 0) return;

        // OPTIMISTIC UPDATE: Clear instantly
        setDrawerNotifications([]);
        setUnreadCount(0);

        try {
            await api.delete('/notifications');
        } catch (error) {
            console.error('Bulk delete failed', error);
        }
    };

    const triggerNotification = ({ title, message, type = 'info', duration = 5000 }) => {
        const id = Date.now().toString() + Math.random().toString();

        setNotifications(prev => [...prev, { id, title, message, type, duration }]);

        if (duration > 0) {
            setTimeout(() => {
                removeNotification(id);
            }, duration);
        }

        // Slight delay to allow backend webhook to save the notification in the DB before refetching
        if (user && api) {
            setTimeout(fetchNotifications, 1000);
        }
    };

    const removeNotification = (id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const getIcon = (type) => {
        switch (type) {
            case 'success': return <CheckCircle size={20} color="var(--success)" />;
            case 'error': return <AlertCircle size={20} color="var(--danger)" />;
            case 'warning': return <AlertCircle size={20} color="var(--warning)" />;
            default: return <Info size={20} color="var(--primary)" />;
        }
    };

    return (
        <NotificationContext.Provider value={{
            notifications,
            triggerNotification,
            removeNotification,
            drawerNotifications,
            unreadCount,
            markAsRead,
            dismissNotification,
            markAllAsRead,
            deleteAllNotifications,
            getIcon,
            fetchNotifications
        }}>
            {children}

            {/* Local Toast Native Notification Container - Top Right anchored */}
            <div style={{
                position: 'fixed',
                top: '20px',
                right: '20px',
                zIndex: 9999,
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                pointerEvents: 'none',
                maxWidth: '350px',
                width: '100%'
            }}>
                {notifications.map(notif => (
                    <div
                        key={notif.id}
                        className="animate-fade-in"
                        style={{
                            background: 'var(--card-bg)',
                            border: '1px solid var(--border-color)',
                            boxShadow: 'var(--shadow-lg)',
                            borderRadius: '12px',
                            padding: '16px',
                            display: 'flex',
                            gap: '12px',
                            alignItems: 'flex-start',
                            pointerEvents: 'auto',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        {/* Colored left strip */}
                        <div style={{
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            bottom: 0,
                            width: '4px',
                            background: notif.type === 'success' ? 'var(--success)' :
                                notif.type === 'error' ? 'var(--danger)' :
                                    notif.type === 'warning' ? 'var(--warning)' : 'var(--primary)'
                        }} />

                        <div style={{ flexShrink: 0, marginTop: '2px' }}>
                            {getIcon(notif.type)}
                        </div>

                        <div style={{ flex: 1 }}>
                            {notif.title && (
                                <h4 style={{ margin: '0 0 4px 0', fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>
                                    {notif.title}
                                </h4>
                            )}
                            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                                {notif.message}
                            </p>
                        </div>

                        <button
                            onClick={() => removeNotification(notif.id)}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                color: 'var(--text-muted)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '4px',
                                flexShrink: 0
                            }}
                        >
                            <X size={16} />
                        </button>
                    </div>
                ))}
            </div>
        </NotificationContext.Provider>
    );
};
