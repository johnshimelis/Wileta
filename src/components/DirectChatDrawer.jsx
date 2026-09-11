import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import {
    MessageSquare, X, Send, ShieldCheck, CheckCheck, Check,
    Sparkles, RefreshCw, AlertCircle, Clock, ChevronDown, User
} from 'lucide-react';
import { io } from 'socket.io-client';
import { soundFx } from '../utils/soundFx';

const getSocketUrl = () => {
    if (import.meta.env.VITE_API_URL) {
        return import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '');
    }
    return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:5000'
        : 'https://wileta-backend.onrender.com';
};

const SUGGESTED_TOPICS = [
    { label: '💳 Payout Question', text: 'Hello, I have a question regarding my recent payout.' },
    { label: '🛡️ Fayda KYC Status', text: 'Hi! Could you please verify the review status of my Fayda KYC ID?' },
    { label: '⚡ Tipping Issue', text: 'Hello, a supporter tipped me but I would like to verify the settlement.' },
    { label: '👋 Say Hello', text: 'Hello GurshaPay team!' }
];

export default function DirectChatDrawer() {
    const { user, api } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [inputMessage, setInputMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const [adminTyping, setAdminTyping] = useState(false);

    const drawerRef = useRef(null);
    const messagesEndRef = useRef(null);
    const socketRef = useRef(null);
    const typingTimeoutRef = useRef(null);

    // Auto-scroll to bottom
    const scrollToBottom = (smooth = true) => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
        }
    };

    // Fetch message history
    const fetchMessages = useCallback(async (markRead = false) => {
        if (!user || !api) return;
        try {
            setLoading(true);
            const res = await api.get('/chat/messages');
            if (res.data?.success) {
                setMessages(res.data.messages || []);
                if (markRead) {
                    setUnreadCount(0);
                }
            }
        } catch (err) {
            console.error('[DirectChat] Failed to fetch messages:', err);
        } finally {
            setLoading(false);
            setTimeout(() => scrollToBottom(false), 100);
        }
    }, [user, api]);

    // Fetch unread count for badge
    const fetchUnreadCount = useCallback(async () => {
        if (!user || !api) return;
        try {
            const res = await api.get('/chat/unread-count');
            if (res.data?.success) {
                setUnreadCount(res.data.unreadCount || 0);
            }
        } catch (err) {
            // Ignore background fetch error
        }
    }, [user, api]);

    // Mark messages as read explicitly
    const markMessagesAsRead = useCallback(async () => {
        if (!user || !api) return;
        try {
            await api.put('/chat/read');
            setUnreadCount(0);
        } catch (err) {
            // Ignore
        }
    }, [user, api]);

    // Initialize Socket.IO connection
    useEffect(() => {
        if (!user?._id) return;

        fetchUnreadCount();

        const socket = io(getSocketUrl(), {
            transports: ['websocket', 'polling'],
            reconnectionAttempts: 10,
            reconnectionDelay: 2000
        });

        socketRef.current = socket;

        socket.on('connect', () => {
            socket.emit('join_direct_chat', user._id);
            socket.emit('join', user._id);
        });

        // Incoming message from Admin in active direct chat
        socket.on('direct_chat_message', (payload) => {
            const newMsg = payload?.message;
            if (!newMsg) return;

            setMessages(prev => {
                // Avoid duplicates
                if (prev.some(m => m._id === newMsg._id)) return prev;
                return [...prev, newMsg];
            });

            if (newMsg.senderRole === 'ADMIN') {
                soundFx.playPop();
                if (isOpen) {
                    markMessagesAsRead();
                } else {
                    setUnreadCount(count => count + 1);
                }
            }
            setTimeout(() => scrollToBottom(true), 100);
        });

        // Background direct message notification
        socket.on('direct_message_notification', (payload) => {
            if (!isOpen) {
                setUnreadCount(payload?.unreadCount || 1);
                soundFx.playPop();
            }
        });

        // Read receipts update
        socket.on('direct_messages_read', (payload) => {
            if (payload?.readByRole === 'ADMIN') {
                setMessages(prev => prev.map(m => {
                    if (m.senderRole === 'CREATOR') {
                        return { ...m, readByAdmin: true };
                    }
                    return m;
                }));
            }
        });

        // Admin typing status
        socket.on('direct_chat_typing_status', (payload) => {
            if (payload?.senderRole === 'ADMIN') {
                setAdminTyping(!!payload.isTyping);
                if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
                if (payload.isTyping) {
                    typingTimeoutRef.current = setTimeout(() => setAdminTyping(false), 3500);
                }
            }
        });

        return () => {
            if (socketRef.current) {
                socketRef.current.emit('leave_direct_chat', user._id);
                socketRef.current.disconnect();
            }
        };
    }, [user?._id, isOpen, fetchUnreadCount, markMessagesAsRead]);

    // Handle open/close
    const toggleDrawer = () => {
        soundFx.playClick();
        if (!isOpen) {
            setIsOpen(true);
            fetchMessages(true);
        } else {
            setIsOpen(false);
        }
    };

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (drawerRef.current && !drawerRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    // Handle typing status broadcast
    const handleInputChange = (e) => {
        setInputMessage(e.target.value);
        if (socketRef.current && user?._id) {
            socketRef.current.emit('direct_chat_typing', {
                creatorId: user._id,
                senderRole: 'CREATOR',
                senderName: user.name || 'Creator',
                isTyping: e.target.value.length > 0
            });
        }
    };

    // Send Message
    const handleSendMessage = async (customText = null) => {
        const textToSend = (typeof customText === 'string' ? customText : inputMessage).trim();
        if (!textToSend || sending) return;

        soundFx.playClick();
        setSending(true);

        try {
            const res = await api.post('/chat/messages', { message: textToSend });
            if (res.data?.success && res.data.message) {
                const sentMsg = res.data.message;
                setMessages(prev => {
                    if (prev.some(m => m._id === sentMsg._id)) return prev;
                    return [...prev, sentMsg];
                });
                setInputMessage('');
                if (socketRef.current && user?._id) {
                    socketRef.current.emit('direct_chat_typing', {
                        creatorId: user._id,
                        senderRole: 'CREATOR',
                        senderName: user.name || 'Creator',
                        isTyping: false
                    });
                }
                setTimeout(() => scrollToBottom(true), 50);
            }
        } catch (err) {
            console.error('[DirectChat] Send error:', err);
            alert(err.response?.data?.error || 'Failed to send message. Please try again.');
        } finally {
            setSending(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const formatMessageTime = (dateStr) => {
        try {
            const d = new Date(dateStr);
            return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } catch {
            return '';
        }
    };

    return (
        <div style={{ position: 'relative' }} ref={drawerRef}>
            {/* Top Bar Message Icon Trigger Button */}
            <button
                onClick={toggleDrawer}
                aria-label="Direct Chat with GurshaPay Admin"
                title="Direct Chat with GurshaPay Support"
                style={{
                    position: 'relative',
                    background: 'var(--card-bg)',
                    border: '1px solid var(--border-color)',
                    color: isOpen ? 'var(--primary)' : 'var(--text-main)',
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
                    e.currentTarget.style.borderColor = isOpen ? 'var(--primary)' : 'var(--border-color)';
                    e.currentTarget.style.background = 'var(--card-bg)';
                }}
            >
                <MessageSquare size={18} />
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

            {/* Chat Floating Window / Drawer */}
            {isOpen && (
                <div
                    style={{
                        position: 'absolute',
                        top: 'calc(100% + 8px)',
                        right: 0,
                        width: '380px',
                        maxWidth: 'calc(100vw - 24px)',
                        height: '520px',
                        maxHeight: 'calc(100vh - 100px)',
                        background: 'var(--card-bg)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '16px',
                        boxShadow: '0 12px 36px rgba(0, 0, 0, 0.18), 0 4px 12px rgba(0, 0, 0, 0.08)',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                        zIndex: 1000,
                        animation: 'chatFadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                >
                    {/* Header */}
                    <div style={{
                        padding: '12px 16px',
                        borderBottom: '1px solid var(--border-color)',
                        background: 'var(--card-bg-subtle)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '10px'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{
                                position: 'relative',
                                width: '36px',
                                height: '36px',
                                borderRadius: '10px',
                                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#FFFFFF',
                                flexShrink: 0
                            }}>
                                <ShieldCheck size={20} />
                                <span style={{
                                    position: 'absolute',
                                    bottom: '-2px',
                                    right: '-2px',
                                    width: '10px',
                                    height: '10px',
                                    borderRadius: '50%',
                                    background: '#22C55E',
                                    border: '2px solid var(--card-bg)'
                                }} />
                            </div>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>
                                        GurshaPay Admin
                                    </span>
                                    <span style={{
                                        fontSize: '0.62rem',
                                        fontWeight: 700,
                                        padding: '1px 6px',
                                        borderRadius: '6px',
                                        background: 'rgba(16, 185, 129, 0.15)',
                                        color: '#10B981'
                                    }}>
                                        SUPPORT
                                    </span>
                                </div>
                                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: 0 }}>
                                    {adminTyping ? 'Typing a response...' : 'Instant direct messaging'}
                                </p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <button
                                onClick={() => fetchMessages(true)}
                                title="Refresh chat"
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'var(--text-muted)',
                                    cursor: 'pointer',
                                    padding: '6px',
                                    borderRadius: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                title="Close chat"
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'var(--text-muted)',
                                    cursor: 'pointer',
                                    padding: '6px',
                                    borderRadius: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <X size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Messages Body */}
                    <div style={{
                        flex: 1,
                        overflowY: 'auto',
                        padding: '14px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                        background: 'var(--bg-color)'
                    }}>
                        {/* Welcome Card */}
                        <div style={{
                            padding: '12px',
                            background: 'var(--card-bg)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '12px',
                            textAlign: 'center',
                            margin: '4px 0 8px 0'
                        }}>
                            <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)', margin: '0 0 4px 0' }}>
                                👋 Direct Support Channel
                            </p>
                            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>
                                Have questions regarding payouts, tips, or Fayda KYC? Message our administrative staff directly below.
                            </p>
                        </div>

                        {/* Quick Suggestion Pills */}
                        {messages.length === 0 && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', margin: '4px 0 10px 0' }}>
                                <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                    Quick topics:
                                </span>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                    {SUGGESTED_TOPICS.map((topic, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => handleSendMessage(topic.text)}
                                            style={{
                                                fontSize: '0.73rem',
                                                fontWeight: 600,
                                                padding: '5px 10px',
                                                borderRadius: '8px',
                                                background: 'var(--card-bg)',
                                                border: '1px solid var(--border-color)',
                                                color: 'var(--text-main)',
                                                cursor: 'pointer',
                                                transition: 'all 0.15s ease'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.borderColor = 'var(--primary)';
                                                e.currentTarget.style.color = 'var(--primary)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.borderColor = 'var(--border-color)';
                                                e.currentTarget.style.color = 'var(--text-main)';
                                            }}
                                        >
                                            {topic.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Chat Messages */}
                        {messages.map((msg) => {
                            const isMe = msg.senderRole === 'CREATOR';
                            return (
                                <div
                                    key={msg._id}
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: isMe ? 'flex-end' : 'flex-start',
                                        maxWidth: '85%',
                                        alignSelf: isMe ? 'flex-end' : 'flex-start'
                                    }}
                                >
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '5px',
                                        marginBottom: '2px',
                                        padding: '0 4px'
                                    }}>
                                        {!isMe && (
                                            <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#10B981' }}>
                                                {msg.senderName || 'GurshaPay Admin'}
                                            </span>
                                        )}
                                        <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                                            {formatMessageTime(msg.createdAt)}
                                        </span>
                                    </div>

                                    <div style={{
                                        padding: '9px 13px',
                                        borderRadius: isMe ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                                        background: isMe
                                            ? 'linear-gradient(135deg, var(--primary) 0%, #059669 100%)'
                                            : 'var(--card-bg)',
                                        color: isMe ? '#FFFFFF' : 'var(--text-main)',
                                        border: isMe ? 'none' : '1px solid var(--border-color)',
                                        fontSize: '0.82rem',
                                        lineHeight: 1.45,
                                        wordBreak: 'break-word',
                                        boxShadow: isMe
                                            ? '0 2px 6px rgba(16, 185, 129, 0.25)'
                                            : 'var(--shadow-xs)'
                                    }}>
                                        {msg.message}
                                    </div>

                                    {isMe && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '3px', marginTop: '2px', paddingRight: '2px' }}>
                                            {msg.readByAdmin ? (
                                                <CheckCheck size={12} color="#10B981" title="Seen by Admin" />
                                            ) : (
                                                <Check size={12} color="var(--text-muted)" title="Delivered" />
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                        {/* Admin Typing Indicator Bubble */}
                        {adminTyping && (
                            <div style={{
                                alignSelf: 'flex-start',
                                padding: '8px 12px',
                                background: 'var(--card-bg)',
                                border: '1px solid var(--border-color)',
                                borderRadius: '14px 14px 14px 2px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                            }}>
                                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary)', animation: 'pulse 1.2s infinite' }} />
                                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary)', animation: 'pulse 1.2s infinite 0.2s' }} />
                                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary)', animation: 'pulse 1.2s infinite 0.4s' }} />
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Footer */}
                    <div style={{
                        padding: '10px 14px',
                        borderTop: '1px solid var(--border-color)',
                        background: 'var(--card-bg-subtle)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                        <input
                            type="text"
                            value={inputMessage}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            placeholder="Write message to admin..."
                            disabled={sending}
                            style={{
                                flex: 1,
                                height: '38px',
                                padding: '0 12px',
                                borderRadius: '10px',
                                border: '1px solid var(--border-color)',
                                background: 'var(--card-bg)',
                                color: 'var(--text-main)',
                                fontSize: '0.82rem',
                                outline: 'none',
                                transition: 'border-color 0.15s ease'
                            }}
                            onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; }}
                            onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; }}
                        />

                        <button
                            onClick={() => handleSendMessage()}
                            disabled={!inputMessage.trim() || sending}
                            style={{
                                width: '38px',
                                height: '38px',
                                borderRadius: '10px',
                                background: !inputMessage.trim() || sending ? 'var(--card-bg-subtle)' : 'var(--primary)',
                                color: !inputMessage.trim() || sending ? 'var(--text-muted)' : '#FFFFFF',
                                border: '1px solid var(--border-color)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: !inputMessage.trim() || sending ? 'not-allowed' : 'pointer',
                                transition: 'all 0.15s ease',
                                flexShrink: 0
                            }}
                        >
                            <Send size={15} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
