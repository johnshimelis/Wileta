import React, { createContext, useContext, useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, Bell, XCircle } from 'lucide-react';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
    // Local ephemeral toasts
    const [notifications, setNotifications] = useState([]);

    // Persistent backend dropdown notifications
    const [drawerNotifications, setDrawerNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    // Safe access to AuthContext
    const authContext = useAuth();
    const user = authContext?.user;
    const api = authContext?.api;

    const fetchNotifications = async () => {
        if (!user || !api) return;
        try {
            const res = await api.get('/notifications');
            setDrawerNotifications(res.data);
            setUnreadCount(res.data.filter(n => !n.isRead).length);
        } catch (error) {
            console.error('Failed to fetch backend notifications', error);
        }
    };

    // Poll periodically or fetch on user change
    useEffect(() => {
        if (user && api) {
            fetchNotifications();
            const interval = setInterval(fetchNotifications, 60000); // Poll every 60s
            return () => clearInterval(interval);
        } else {
            setDrawerNotifications([]);
            setUnreadCount(0);
            setIsDrawerOpen(false);
        }
    }, [user, api]);

    const markAsRead = async (id) => {
        if (!api) return;

        // Optimistic UI update: Filter it completely out of memory and decrement unread
        const notif = drawerNotifications.find(n => n._id === id);
        if (notif && !notif.isRead) {
            setUnreadCount(prev => Math.max(0, prev - 1));
        }
        setDrawerNotifications(prev => prev.filter(n => n._id !== id));

        try {
            await api.delete(`/notifications/${id}`);
        } catch (error) {
            console.error('Failed to permanently delete notification', error);
            // Fallback for older backend
            try { await api.put(`/notifications/${id}/read`); } catch (e) { }
        }
    };

    const markAllAsRead = async () => {
        if (!api || unreadCount === 0) return;
        const currentUnread = drawerNotifications.filter(n => !n.isRead);
        setDrawerNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        setUnreadCount(0);
        try {
            await api.post('/notifications/mark-all-read');
        } catch (error) {
            console.error('Failed to mark all notifications as read', error);
            try { await Promise.all(currentUnread.map(n => api.put(`/notifications/${n._id}/read`))); } catch (e) { }
        }
    };

    const deleteAllNotifications = async () => {
        if (!api || drawerNotifications.length === 0) return;
        const currentNotifs = [...drawerNotifications];
        setDrawerNotifications([]);
        setUnreadCount(0);
        try {
            await api.delete('/notifications');
        } catch (error) {
            console.error('Bulk delete failed', error);
            try {
                await Promise.all(currentNotifs.map(n => api.delete(`/notifications/${n._id}`)));
            } catch (e) {
                console.error('Individual deletes failed too', e);
                try { await Promise.all(currentNotifs.map(n => api.put(`/notifications/${n._id}/read`))); } catch (err) { }
            }
        }
    };

    const toggleDrawer = () => setIsDrawerOpen(prev => !prev);

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
            isDrawerOpen,
            toggleDrawer,
            setIsDrawerOpen,
            markAsRead,
            markAllAsRead,
            deleteAllNotifications,
            getIcon
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
