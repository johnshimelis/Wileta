import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
    ArrowLeft, Send, ShieldCheck, CheckCheck, Check,
    Sparkles, RefreshCw, MessageSquare, AlertCircle, Clock,
    HelpCircle, Smile, Paperclip, ChevronDown, CheckCircle2
} from 'lucide-react';
import { io } from 'socket.io-client';
import { soundFx } from '../utils/soundFx';
import EthiopianFlag from '../components/EthiopianFlag';
import Logo from '../components/Logo';

const getSocketUrl = () => {
    if (import.meta.env.VITE_API_URL) {
        return import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '');
    }
    return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:5000'
        : 'https://wileta-backend.onrender.com';
};

const SUGGESTED_TOPICS = [
    { label: '💳 Payout Question', text: 'Hello! I have a question regarding my recent payout.' },
    { label: '🛡️ Fayda KYC Status', text: 'Hi! Could you please review my Fayda National ID verification status?' },
    { label: '⚡ Tipping Issue', text: 'Hello, a supporter tipped me and I want to verify the settlement.' },
    { label: '📱 Telebirr Setup', text: 'Hello! Need help setting up my Telebirr payout number.' }
];

export default function Chat() {
    const { user, api } = useAuth();
    const { t } = useLanguage();
    const navigate = useNavigate();

    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const [adminTyping, setAdminTyping] = useState(false);
    const [isConnected, setIsConnected] = useState(false);

    const messagesEndRef = useRef(null);
    const socketRef = useRef(null);
    const typingTimeoutRef = useRef(null);
    const textareaRef = useRef(null);

    const scrollToBottom = (smooth = true) => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
        }
    };

    // Fetch conversation history
    const fetchMessages = useCallback(async (markRead = true) => {
        if (!user || !api) return;
        try {
            setLoading(true);
            const res = await api.get('/chat/messages');
            if (res.data?.success) {
                setMessages(res.data.messages || []);
                if (markRead) {
                    await api.put('/chat/read');
                }
            }
        } catch (err) {
            console.error('[Chat] Failed to fetch conversation:', err);
        } finally {
            setLoading(false);
            setTimeout(() => scrollToBottom(false), 150);
        }
    }, [user, api]);

    // Socket.IO real-time direct chat connection
    useEffect(() => {
        if (!user?._id) return;

        fetchMessages(true);

        const socket = io(getSocketUrl(), {
            transports: ['websocket', 'polling'],
            reconnectionAttempts: 10,
            reconnectionDelay: 2000
        });

        socketRef.current = socket;

        socket.on('connect', () => {
            setIsConnected(true);
            socket.emit('join_direct_chat', user._id);
            socket.emit('join', user._id);
        });

        socket.on('disconnect', () => {
            setIsConnected(false);
        });

        // Incoming message from Admin
        socket.on('direct_chat_message', (payload) => {
            const newMsg = payload?.message;
            if (!newMsg) return;

            setMessages(prev => {
                if (prev.some(m => m._id === newMsg._id)) return prev;
                return [...prev, newMsg];
            });

            if (newMsg.senderRole === 'ADMIN') {
                soundFx.playPop();
                if (api) {
                    api.put('/chat/read').catch(() => {});
                }
            }
            setTimeout(() => scrollToBottom(true), 100);
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
    }, [user?._id, fetchMessages, api]);

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
            console.error('[Chat] Send error:', err);
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
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            background: 'var(--bg-color)',
            color: 'var(--text-main)',
            position: 'relative'
        }}>
            {/* Top Navigation Bar */}
            <header style={{
                height: '64px',
                padding: '0 1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid var(--border-color)',
                background: 'var(--card-bg)',
                position: 'sticky',
                top: 0,
                zIndex: 40,
                backdropFilter: 'blur(12px)',
                boxShadow: 'var(--shadow-sm)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <button
                        onClick={() => navigate(-1)}
                        style={{
                            background: 'var(--card-bg-subtle, rgba(255,255,255,0.05))',
                            border: '1px solid var(--border-color)',
                            color: 'var(--text-main)',
                            width: '38px',
                            height: '38px',
                            borderRadius: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease'
                        }}
                        aria-label="Go Back"
                    >
                        <ArrowLeft size={18} />
                    </button>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                            position: 'relative',
                            width: '40px',
                            height: '40px',
                            borderRadius: '12px',
                            background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#FFFFFF',
                            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                        }}>
                            <ShieldCheck size={22} />
                            <span style={{
                                position: 'absolute',
                                bottom: '-2px',
                                right: '-2px',
                                width: '12px',
                                height: '12px',
                                borderRadius: '50%',
                                background: isConnected ? '#22C55E' : '#EAB308',
                                border: '2px solid var(--card-bg)'
                            }} />
                        </div>

                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                                <h1 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, lineHeight: 1.2 }}>
                                    GurshaPay Support
                                </h1>
                                <span style={{
                                    fontSize: '0.62rem',
                                    fontWeight: 800,
                                    padding: '2px 6px',
                                    borderRadius: '6px',
                                    background: 'rgba(16, 185, 129, 0.15)',
                                    color: '#10B981',
                                    border: '1px solid rgba(16, 185, 129, 0.3)'
                                }}>
                                    OFFICIAL
                                </span>
                            </div>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0, marginTop: '2px' }}>
                                {adminTyping ? 'GurshaPay staff is typing...' : (isConnected ? '● Connected (In-App Direct)' : 'Connecting...')}
                            </p>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <button
                        onClick={() => fetchMessages(true)}
                        style={{
                            background: 'transparent',
                            border: '1px solid var(--border-color)',
                            color: 'var(--text-muted)',
                            width: '36px',
                            height: '36px',
                            borderRadius: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer'
                        }}
                        title="Refresh Messages"
                    >
                        <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
                    </button>
                </div>
            </header>

            {/* In-App Direct Notice Header */}
            <div style={{
                background: 'rgba(16, 185, 129, 0.08)',
                borderBottom: '1px solid rgba(16, 185, 129, 0.15)',
                padding: '0.5rem 1rem',
                fontSize: '0.75rem',
                color: '#10B981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                textAlign: 'center'
            }}>
                <ShieldCheck size={14} />
                <span>Encrypted in-app support channel. Messages are delivered directly inside GurshaPay without physical SMS.</span>
            </div>

            {/* Chat Body */}
            <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '1rem',
                maxWidth: '820px',
                width: '100%',
                margin: '0 auto',
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem'
            }}>
                {/* Welcome Card */}
                <div style={{
                    padding: '1.25rem',
                    background: 'var(--card-bg)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '16px',
                    textAlign: 'center',
                    marginBottom: '0.5rem',
                    boxShadow: 'var(--shadow-xs)'
                }}>
                    <div style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        background: 'rgba(16, 185, 129, 0.12)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 0.75rem auto',
                        color: 'var(--primary)'
                    }}>
                        <MessageSquare size={22} />
                    </div>
                    <h2 style={{ fontSize: '1rem', fontWeight: 800, margin: '0 0 0.35rem 0' }}>
                        GurshaPay Creator & Support Desk
                    </h2>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0 auto', maxWidth: '440px', lineHeight: 1.45 }}>
                        Ask questions about Telebirr & CBE bank payouts, Fayda National ID review, supporter tip settlements, or system assistance.
                    </p>
                </div>

                {/* Quick Suggestion Topic Buttons */}
                {messages.length === 0 && (
                    <div style={{ margin: '0.5rem 0 1rem 0' }}>
                        <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.5rem' }}>
                            Common Questions:
                        </p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            {SUGGESTED_TOPICS.map((topic, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleSendMessage(topic.text)}
                                    style={{
                                        fontSize: '0.8rem',
                                        fontWeight: 600,
                                        padding: '0.5rem 0.85rem',
                                        borderRadius: '10px',
                                        background: 'var(--card-bg)',
                                        border: '1px solid var(--border-color)',
                                        color: 'var(--text-main)',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.35rem',
                                        transition: 'all 0.15s ease'
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.borderColor = 'var(--primary)';
                                        e.currentTarget.style.color = 'var(--primary)';
                                    }}
                                    onMouseLeave={e => {
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

                {/* Messages List */}
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
                                gap: '6px',
                                marginBottom: '3px',
                                padding: '0 4px'
                            }}>
                                {!isMe && (
                                    <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#10B981', display: 'flex', alignItems: 'center', gap: '3px' }}>
                                        <ShieldCheck size={12} /> {msg.senderName || 'GurshaPay Admin'}
                                    </span>
                                )}
                                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                                    {formatMessageTime(msg.createdAt)}
                                </span>
                            </div>

                            <div style={{
                                padding: '10px 14px',
                                borderRadius: isMe ? '16px 16px 3px 16px' : '16px 16px 16px 3px',
                                background: isMe
                                    ? 'linear-gradient(135deg, var(--primary) 0%, #059669 100%)'
                                    : 'var(--card-bg)',
                                color: isMe ? '#FFFFFF' : 'var(--text-main)',
                                border: isMe ? 'none' : '1px solid var(--border-color)',
                                fontSize: '0.9rem',
                                lineHeight: 1.45,
                                wordBreak: 'break-word',
                                boxShadow: isMe
                                    ? '0 3px 8px rgba(16, 185, 129, 0.25)'
                                    : 'var(--shadow-xs)'
                            }}>
                                {msg.message}
                            </div>

                            {isMe && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '3px', marginTop: '2px', paddingRight: '4px' }}>
                                    {msg.readByAdmin ? (
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '2px', fontSize: '0.65rem', color: '#10B981', fontWeight: 700 }}>
                                            <CheckCheck size={13} color="#10B981" /> Seen by Support
                                        </span>
                                    ) : (
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '2px', fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                                            <Check size={13} color="var(--text-muted)" /> Delivered
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}

                {/* Admin Typing Indicator */}
                {adminTyping && (
                    <div style={{
                        alignSelf: 'flex-start',
                        padding: '10px 14px',
                        background: 'var(--card-bg)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '16px 16px 16px 3px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                    }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Support is typing</span>
                        <div style={{ display: 'flex', gap: '3px' }}>
                            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--primary)', animation: 'pulse 1s infinite' }} />
                            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--primary)', animation: 'pulse 1s infinite 0.2s' }} />
                            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--primary)', animation: 'pulse 1s infinite 0.4s' }} />
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input Bar Footer */}
            <div style={{
                position: 'sticky',
                bottom: 0,
                borderTop: '1px solid var(--border-color)',
                background: 'var(--card-bg)',
                padding: '0.75rem 1rem calc(0.75rem + env(safe-area-inset-bottom, 0px)) 1rem',
                backdropFilter: 'blur(12px)',
                zIndex: 30
            }}>
                <div style={{
                    maxWidth: '820px',
                    margin: '0 auto',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem'
                }}>
                    <input
                        ref={textareaRef}
                        type="text"
                        value={inputMessage}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        placeholder="Write a message to GurshaPay Support..."
                        disabled={sending}
                        style={{
                            flex: 1,
                            height: '46px',
                            padding: '0 1rem',
                            borderRadius: '12px',
                            border: '1px solid var(--border-color)',
                            background: 'var(--bg-color)',
                            color: 'var(--text-main)',
                            fontSize: '0.9rem',
                            outline: 'none',
                            boxSizing: 'border-box',
                            transition: 'border-color 0.15s ease'
                        }}
                        onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; }}
                        onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; }}
                    />

                    <button
                        onClick={() => handleSendMessage()}
                        disabled={!inputMessage.trim() || sending}
                        style={{
                            width: '46px',
                            height: '46px',
                            borderRadius: '12px',
                            background: !inputMessage.trim() || sending
                                ? 'var(--card-bg-subtle, rgba(255,255,255,0.05))'
                                : 'var(--primary)',
                            color: !inputMessage.trim() || sending ? 'var(--text-muted)' : '#FFFFFF',
                            border: '1px solid var(--border-color)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: !inputMessage.trim() || sending ? 'not-allowed' : 'pointer',
                            transition: 'all 0.15s ease',
                            flexShrink: 0,
                            boxShadow: inputMessage.trim() ? '0 2px 8px rgba(16, 185, 129, 0.3)' : 'none'
                        }}
                        title="Send Message"
                    >
                        <Send size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}
