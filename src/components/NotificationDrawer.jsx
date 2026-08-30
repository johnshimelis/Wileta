import React, { useRef, useEffect, useState } from 'react';
import { useNotification } from '../context/NotificationContext';
import { Bell, X, CheckCheck, Trash2, Smartphone, ShieldCheck, Heart, Sparkles, Check } from 'lucide-react';

export default function NotificationDrawer() {
    const {
        drawerNotifications, unreadCount,
        markAsRead, dismissNotification, markAllAsRead, deleteAllNotifications, getIcon
    } = useNotification();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const toggleDrawer = () => setIsDrawerOpen(prev => !prev);
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

    const formatRelativeTime = (dateString) => {
        try {
            const date = new Date(dateString);
            const now = new Date();
            const diffInSeconds = Math.floor((now - date) / 1000);
            
            if (diffInSeconds < 60) return 'Just now';
            if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
            if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
            if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        } catch {
            return 'Recent';
        }
    };

    const getNotificationTypeIcon = (notif) => {
        const title = (notif.title || '').toLowerCase();
        const msg = (notif.message || '').toLowerCase();

        if (title.includes('tip') || msg.includes('tip') || msg.includes('etb')) {
            return (
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(5, 150, 105, 0.12)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Sparkles size={16} />
                </div>
            );
        }
        if (title.includes('kyc') || title.includes('verified') || title.includes('security')) {
            return (
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(2, 132, 199, 0.12)', color: '#0284C7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <ShieldCheck size={16} />
                </div>
            );
        }
        return (
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(217, 119, 6, 0.12)', color: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Bell size={16} />
            </div>
        );
    };

    return (
        <div style={{ position: 'relative' }} ref={drawerRef}>
            <button
                onClick={toggleDrawer}
                aria-label="Notifications"
                style={{
                    position: 'relative',
                    background: 'var(--card-bg)',
                    border: '1px solid var(--border-color)',
                    color: isDrawerOpen ? 'var(--primary)' : 'var(--text-main)',
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    boxShadow: 'var(--shadow-xs)'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--primary)';
                    e.currentTarget.style.background = 'var(--card-bg-subtle)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = isDrawerOpen ? 'var(--primary)' : 'var(--border-color)';
                    e.currentTarget.style.background = 'var(--card-bg)';
                }}
            >
                <Bell size={18} />
                {unreadCount > 0 && (
                    <span style={{
                        position: 'absolute',
                        top: '-5px',
                        right: '-5px',
                        minWidth: '18px',
                        height: '18px',
                        padding: '0 4px',
                        background: '#EF4444',
                        color: '#FFFFFF',
                        borderRadius: '9999px',
                        border: '2px solid var(--bg-color)',
                        fontSize: '0.65rem',
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 4px rgba(239, 68, 68, 0.3)'
                    }}>
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {isDrawerOpen && (
                <div 
                className="notification-popover-menu" 
                style={{
                    maxHeight: '490px',
                    background: 'var(--card-bg)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '14px',
                    boxShadow: '0 15px 30px -5px rgba(15, 23, 42, 0.15), 0 10px 10px -5px rgba(15, 23, 42, 0.04)',
                    zIndex: 9999,
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden'
                }} 
                onClick={(e) => e.stopPropagation()}
            >
                    
                    {/* Header */}
                    <div style={{
                        padding: '1rem 1.25rem',
                        borderBottom: '1px solid var(--border-color)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        background: 'var(--card-bg)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)' }}>
                                Notifications
                            </h3>
                            {unreadCount > 0 && (
                                <span style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '0.15rem 0.45rem', borderRadius: '9999px', fontSize: '0.7rem', fontWeight: 800 }}>
                                    {unreadCount} new
                                </span>
                            )}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            {unreadCount > 0 && (
                                <button
                                    onClick={(e) => { e.stopPropagation(); markAllAsRead(); }}
                                    style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.775rem', cursor: 'pointer', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.25rem', padding: 0 }}
                                    title="Mark all as read"
                                >
                                    <CheckCheck size={14} /> Mark all read
                                </button>
                            )}
                            {drawerNotifications.length > 0 && (
                                <button
                                    onClick={(e) => { e.stopPropagation(); deleteAllNotifications(); }}
                                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.775rem', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem', padding: 0 }}
                                    title="Clear all notifications"
                                >
                                    <Trash2 size={13} /> Clear
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Notification List */}
                    <div style={{ overflowY: 'auto', flex: 1, padding: 0 }}>
                        {drawerNotifications.length === 0 ? (
                            <div style={{ padding: '3.5rem 1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                <div style={{ width: '48px', height: '48px', background: 'var(--card-bg-subtle)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.85rem', color: 'var(--text-muted)' }}>
                                    <Bell size={22} />
                                </div>
                                <h4 style={{ margin: '0 0 0.25rem 0', color: 'var(--text-main)', fontSize: '0.95rem', fontWeight: 800 }}>All Caught Up!</h4>
                                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>You don't have any unread notifications right now.</p>
                            </div>
                        ) : (
                            drawerNotifications.map((notif) => (
                                <div
                                    key={notif._id}
                                    style={{
                                        padding: '0.9rem 1.15rem',
                                        borderBottom: '1px solid var(--border-color)',
                                        background: notif.isRead ? 'transparent' : 'rgba(5, 150, 105, 0.04)',
                                        display: 'flex',
                                        gap: '0.75rem',
                                        alignItems: 'flex-start',
                                        transition: 'background 0.15s ease',
                                        position: 'relative',
                                        cursor: 'pointer'
                                    }}
                                    onClick={() => { if (!notif.isRead) markAsRead(notif._id); }}
                                    onMouseEnter={e => e.currentTarget.style.background = notif.isRead ? 'var(--card-bg-subtle)' : 'rgba(5, 150, 105, 0.08)'}
                                    onMouseLeave={e => e.currentTarget.style.background = notif.isRead ? 'transparent' : 'rgba(5, 150, 105, 0.04)'}
                                >
                                    {getNotificationTypeIcon(notif)}

                                    <div style={{ flex: 1, minWidth: 0, paddingRight: '1rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                                            <span style={{ fontSize: '0.85rem', fontWeight: notif.isRead ? 700 : 800, color: 'var(--text-main)', lineHeight: 1.3 }}>
                                                {notif.title}
                                            </span>
                                            {!notif.isRead && (
                                                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary)', flexShrink: 0 }}></span>
                                            )}
                                        </div>
                                        <p style={{ margin: '0 0 0.35rem 0', fontSize: '0.775rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                                            {notif.message}
                                        </p>
                                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                                            {formatRelativeTime(notif.createdAt)}
                                        </span>
                                    </div>

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            dismissNotification(notif._id);
                                        }}
                                        style={{
                                            position: 'absolute',
                                            top: '0.75rem',
                                            right: '0.75rem',
                                            background: 'none',
                                            border: 'none',
                                            color: 'var(--text-muted)',
                                            cursor: 'pointer',
                                            padding: '0.25rem',
                                            display: 'flex',
                                            opacity: 0.6
                                        }}
                                        title="Dismiss"
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
