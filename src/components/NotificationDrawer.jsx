import React, { useRef, useEffect } from 'react';
import { useNotification } from '../context/NotificationContext';
import { Bell, X, CheckCircle } from 'lucide-react';

export default function NotificationDrawer() {
    const {
        drawerNotifications, unreadCount, isDrawerOpen,
        toggleDrawer, setIsDrawerOpen, markAsRead, markAllAsRead, deleteAllNotifications, getIcon
    } = useNotification();
    const drawerRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (drawerRef.current && !drawerRef.current.contains(event.target)) {
                setIsDrawerOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [setIsDrawerOpen]);

    const formatTime = (dateString) => {
        const d = new Date(dateString);
        return d.toLocaleDateString() + ' at ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div style={{ position: 'relative' }} ref={drawerRef}>
            <button
                onClick={toggleDrawer}
                style={{
                    background: 'var(--card-bg)',
                    border: '1px solid var(--border-color)',
                    color: isDrawerOpen ? 'var(--primary)' : 'var(--text-main)',
                    padding: '0.6rem',
                    borderRadius: '0.75rem',
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span style={{
                        position: 'absolute', top: '-6px', right: '-6px',
                        minWidth: '20px', height: '20px', padding: '0 5px',
                        background: 'var(--danger)', color: 'white',
                        borderRadius: '10px', border: '2px solid var(--bg-color)',
                        fontSize: '0.7rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {isDrawerOpen && (
                <div className="animate-scale-in notification-drawer-content" style={{
                    position: 'absolute',
                    top: 'calc(100% + 12px)',
                    right: 0,
                    width: '360px',
                    maxHeight: '480px',
                    background: 'var(--card-bg)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '1.25rem',
                    boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                    zIndex: 9999,
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden'
                }}>
                    <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-color)' }}>
                        <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)' }}>Notifications</h3>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            {unreadCount > 0 && (
                                <button
                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); markAllAsRead(); }}
                                    style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}
                                    title="Mark all as read"
                                >
                                    <CheckCircle size={14} /> Read
                                </button>
                            )}
                            {drawerNotifications.length > 0 && (
                                <button
                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); deleteAllNotifications(); }}
                                    style={{ background: 'none', border: 'none', color: 'var(--danger)', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}
                                    title="Delete all notifications"
                                >
                                    <X size={14} /> Clear All
                                </button>
                            )}
                        </div>
                    </div>

                    <div style={{ overflowY: 'auto', flex: 1, padding: '0.5rem 0' }}>
                        {drawerNotifications.length === 0 ? (
                            <div style={{ padding: '3rem 2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                <div style={{ width: '64px', height: '64px', background: 'var(--border-color)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', opacity: 0.5 }}>
                                    <Bell size={28} />
                                </div>
                                <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-main)', fontSize: '1.05rem', fontWeight: 700 }}>All caught up!</h4>
                                <p style={{ margin: 0, fontSize: '0.9rem' }}>You don't have any new notifications right now.</p>
                            </div>
                        ) : (
                            drawerNotifications.map(notif => (
                                <div
                                    key={notif._id}
                                    style={{
                                        padding: '1rem 1.25rem',
                                        borderBottom: '1px solid var(--border-color)',
                                        background: notif.isRead ? 'transparent' : 'var(--primary-light)',
                                        display: 'flex',
                                        gap: '12px',
                                        alignItems: 'flex-start',
                                        transition: 'background 0.3s ease',
                                        position: 'relative'
                                    }}
                                >
                                    <div style={{ marginTop: '2px', flexShrink: 0 }}>
                                        {getIcon(notif.type)}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                                            <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', paddingRight: '20px' }}>
                                                {notif.title}
                                            </h4>
                                        </div>
                                        <p style={{ margin: '0 0 8px 0', fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                                            {notif.message}
                                        </p>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, opacity: 0.8 }}>
                                            {formatTime(notif.createdAt)}
                                        </span>
                                    </div>
                                    <button
                                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); markAsRead(notif._id); }}
                                        style={{
                                            position: 'absolute', top: '12px', right: '12px',
                                            background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '50%', width: '24px', height: '24px',
                                            cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                                        }}
                                        title={notif.isRead ? "Dismiss" : "Mark as read"}
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
