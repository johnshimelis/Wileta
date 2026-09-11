import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import NotificationDrawer from '../components/NotificationDrawer';
import DirectChatDrawer from '../components/DirectChatDrawer';
import {
    LifeBuoy, Mail, Send, MessageSquare, CheckCircle,
    AlertCircle, HelpCircle, ChevronDown, ChevronUp, Copy, Check,
    ExternalLink, Menu, X, Clock, ShieldCheck, Zap, ArrowRight,
    CornerDownRight, CreditCard, Sparkles, Building, Lock, Activity,
    Bell, User, Link as LinkIcon, Search, CheckCheck, RefreshCw,
    Paperclip, AlertTriangle
} from 'lucide-react';
import Logo from '../components/Logo';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { useNotification } from '../context/NotificationContext';
import { io } from 'socket.io-client';

const getSocketUrl = () => {
    if (import.meta.env.VITE_API_URL) {
        return import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '');
    }
    return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:5000'
        : 'https://wileta-backend.onrender.com';
};

const CATEGORY_CATALOG = [
    {
        id: 'PAYMENT',
        name: 'Payment & Checkout',
        icon: CreditCard,
        subcategories: [
            'Chapa Checkout Failed',
            'Card / Bank Gateway Error',
            'Telebirr Payment Timeout',
            'Charged but Transaction Pending',
            'Double Charge / Duplicate Payment',
            'Other Payment Issue'
        ]
    },
    {
        id: 'TIPPING',
        name: 'Tipping & Fan Support',
        icon: Sparkles,
        subcategories: [
            'Tip Not Showing on Creator Page',
            'OBS Stream Alert / Audio Not Triggering',
            'Supporter Message Missing / Glitched',
            'Anonymous Tip Privacy Question',
            'Leaderboard Rank Discrepancy',
            'Other Tipping Issue'
        ]
    },
    {
        id: 'WITHDRAWAL',
        name: 'Withdrawals & Bank Payouts',
        icon: Building,
        subcategories: [
            'Delayed Bank Transfer (CBE/Awash/Dashen/BOA)',
            'Delayed Telebirr Transfer',
            'Withdrawal Rejection / Failure',
            'Wrong Account Number Submitted',
            'Insufficient Withdrawable Balance',
            '24-Hour Liquidity Lock Question',
            'Other Withdrawal Issue'
        ]
    },
    {
        id: 'KYC',
        name: 'Fayda ID & Verification',
        icon: ShieldCheck,
        subcategories: [
            'Fayda ID Verification Rejected',
            'National ID Upload Glitch',
            'Liveness Selfie Camera Error',
            'Name Mismatch on ID vs Bank',
            'Verification Taking Longer Than 24h',
            'Other KYC Question'
        ]
    },
    {
        id: 'ACCOUNT',
        name: 'Account & Security',
        icon: User,
        subcategories: [
            'Login / Password Reset Issue',
            'Two-Factor Authentication (2FA) Reset',
            'Username / Handle Change Request',
            'Profile Picture / Bio Update Error',
            'Suspended Account Inquiry',
            'Other Account Issue'
        ]
    },
    {
        id: 'PAYOUT',
        name: 'Payout Method Setup',
        icon: Building,
        subcategories: [
            'Bank Account Link / Logo Upload',
            'Telebirr Phone Number Change',
            'Adding Secondary Bank Account',
            'Primary Payout Method Switch',
            'Other Payout Setup Question'
        ]
    },
    {
        id: 'TECHNICAL',
        name: 'Technical Bug Report',
        icon: Activity,
        subcategories: [
            'Website / Dashboard Display Bug',
            'Mobile App Freeze / Crash',
            'Slow Loading / Timeout Error',
            'QR Code Scanning Issue',
            'Other Technical Bug'
        ]
    },
    {
        id: 'SECURITY',
        name: 'Security & Fraud Report',
        icon: Lock,
        subcategories: [
            'Report Suspicious Tipping / Stolen Card',
            'Report Impersonation / Fake Creator',
            'Unauthorized Account Access',
            'Phishing / Scam Alert',
            'Other Security Concern'
        ]
    },
    {
        id: 'NOTIFICATION',
        name: 'SMS & Alerts',
        icon: Bell,
        subcategories: [
            'SMS Tip Alerts Not Received',
            'Email Verification / Receipt Delay',
            'Telegram Bot Alerts Disconnected',
            'Other Notification Issue'
        ]
    },
    {
        id: 'OTHER',
        name: 'General Inquiry',
        icon: HelpCircle,
        subcategories: [
            'Creator Partnership & Verification Request',
            'Feature Suggestion / Feedback',
            'Brand Sponsorship & Collaboration',
            'General Customer Service'
        ]
    }
];

export default function Support() {
    const { user, api } = useAuth();
    const { triggerNotification } = useNotification();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Form state
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [phone, setPhone] = useState(user?.phone || '');
    const [category, setCategory] = useState('PAYMENT');
    const [subcategory, setSubcategory] = useState(CATEGORY_CATALOG[0].subcategories[0]);
    const [priority, setPriority] = useState('NORMAL');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [relatedTransactionId, setRelatedTransactionId] = useState('');
    const [relatedWithdrawalId, setRelatedWithdrawalId] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [submittedCaseId, setSubmittedCaseId] = useState(null);
    const [copiedEmail, setCopiedEmail] = useState(false);

    // Lookup state
    const [recentTips, setRecentTips] = useState([]);
    const [recentWithdrawals, setRecentWithdrawals] = useState([]);

    // FAQ state
    const [openFaq, setOpenFaq] = useState(null);

    // User's cases
    const [myCases, setMyCases] = useState([]);
    const [loadingCases, setLoadingCases] = useState(false);
    const [expandedCaseId, setExpandedCaseId] = useState(null);
    const [caseMessagesMap, setCaseMessagesMap] = useState({});
    const [userReplyMap, setUserReplyMap] = useState({});
    const [replyingMap, setReplyingMap] = useState({});
    const [closingMap, setClosingMap] = useState({});
    const [agentTypingMap, setAgentTypingMap] = useState({});
    const [failedMessagesMap, setFailedMessagesMap] = useState({});

    // Filter & Search state for My Cases
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [categoryFilter, setCategoryFilter] = useState('ALL');

    // Socket Reference
    const socketRef = useRef(null);
    const messagesEndRef = useRef(null);

    // When category changes, update subcategory default
    const handleCategoryChange = (newCat) => {
        setCategory(newCat);
        const catObj = CATEGORY_CATALOG.find(c => c.id === newCat);
        if (catObj && catObj.subcategories.length > 0) {
            setSubcategory(catObj.subcategories[0]);
        }
    };

    // Socket.io Real-Time Setup
    useEffect(() => {
        const socket = io(getSocketUrl(), {
            transports: ['websocket', 'polling'],
            reconnectionAttempts: 10,
            reconnectionDelay: 2000
        });
        socketRef.current = socket;

        if (user?._id) {
            socket.emit('join', user._id);
        }

        // Listen for real-time messages
        socket.on('new_case_message', ({ caseId, message, caseStatus }) => {
            setCaseMessagesMap(prev => {
                const existing = prev[caseId] || [];
                // Check deduplication
                if (existing.some(m => m.messageId === message.messageId || m._id === message._id)) {
                    return prev;
                }
                return { ...prev, [caseId]: [...existing, message] };
            });

            // Update case in list
            setMyCases(prev => prev.map(c => {
                const cId = c.caseId || c.ticketNumber || c._id;
                if (cId === caseId || c._id === caseId) {
                    return {
                        ...c,
                        status: caseStatus || c.status,
                        lastResponse: {
                            senderType: message.senderType,
                            senderRole: message.senderRole,
                            senderName: message.senderName,
                            message: message.message,
                            respondedAt: new Date()
                        },
                        updatedAt: new Date(),
                        unreadCustomerCount: (message.senderRole === 'ADMIN' || message.senderRole === 'SUPPORT_AGENT') ? (c.unreadCustomerCount || 0) + 1 : c.unreadCustomerCount
                    };
                }
                return c;
            }));

            // Alert user if message is from staff
            if (message.senderRole === 'ADMIN' || message.senderRole === 'SUPPORT_AGENT' || message.senderType === 'admin') {
                triggerNotification({
                    title: `Support Reply #${caseId} 💬`,
                    message: `${message.senderName || 'Agent'}: "${message.message.substring(0, 70)}..."`,
                    type: 'info'
                });
            }
        });

        // Listen for read receipts
        socket.on('case_messages_read', ({ caseId, readByRole, readAt }) => {
            if (readByRole === 'ADMIN' || readByRole === 'SUPPORT_AGENT') {
                setCaseMessagesMap(prev => {
                    const existing = prev[caseId] || [];
                    return {
                        ...prev,
                        [caseId]: existing.map(m => {
                            if (m.senderRole === 'USER' || m.senderRole === 'CREATOR' || m.senderType === 'user') {
                                return { ...m, readStatus: 'READ', readAt };
                            }
                            return m;
                        })
                    };
                });
            }
        });

        // Listen for status changes
        socket.on('case_status_changed', ({ caseId, status, resolution }) => {
            setMyCases(prev => prev.map(c => {
                const cId = c.caseId || c.ticketNumber || c._id;
                if (cId === caseId || c._id === caseId) {
                    return { ...c, status, resolution: resolution || c.resolution };
                }
                return c;
            }));
        });

        // Listen for typing status
        socket.on('case_typing_status', ({ caseId, senderName, isTyping }) => {
            setAgentTypingMap(prev => ({
                ...prev,
                [caseId]: isTyping ? senderName : null
            }));
        });

        return () => {
            socket.disconnect();
        };
    }, [user, triggerNotification]);

    // Handle case room join / leave
    useEffect(() => {
        if (!socketRef.current) return;
        if (expandedCaseId) {
            socketRef.current.emit('join_case', expandedCaseId);
            // Fetch latest messages & auto-mark read
            fetchCaseMessages(expandedCaseId);
        }
        return () => {
            if (expandedCaseId && socketRef.current) {
                socketRef.current.emit('leave_case', expandedCaseId);
            }
        };
    }, [expandedCaseId]);

    const fetchLookupEntities = async () => {
        try {
            const res = await api.get('/support/lookup-entities');
            if (res.data?.success) {
                setRecentTips(res.data.recentTips || []);
                setRecentWithdrawals(res.data.recentWithdrawals || []);
            }
        } catch (e) {}
    };

    const fetchMyCases = async () => {
        setLoadingCases(true);
        try {
            const res = await api.get('/support/my-cases');
            if (res.data?.cases) {
                setMyCases(res.data.cases);
            }
        } catch (e) {}
        finally {
            setLoadingCases(false);
        }
    };

    const fetchCaseMessages = async (caseId) => {
        try {
            const res = await api.get(`/support/cases/${caseId}/messages`);
            if (res.data?.messages) {
                setCaseMessagesMap(prev => ({
                    ...prev,
                    [caseId]: res.data.messages
                }));
                // Update unread count to 0 in list
                setMyCases(prev => prev.map(c => {
                    const cId = c.caseId || c.ticketNumber || c._id;
                    if (cId === caseId || c._id === caseId) {
                        return { ...c, unreadCustomerCount: 0 };
                    }
                    return c;
                }));
            }
        } catch (e) {}
    };

    useEffect(() => {
        if (user) {
            setName(user.name || '');
            setEmail(user.email || '');
            setPhone(user.phone || '');
            fetchMyCases();
            fetchLookupEntities();
        }
    }, [user]);

    const handleSendUserReply = async (caseId, retryText = null) => {
        const text = retryText || userReplyMap[caseId];
        if (!text || !text.trim()) return;

        const optimisticMsgId = `OPT-${Date.now()}`;
        const optimisticMsg = {
            messageId: optimisticMsgId,
            caseId,
            senderRole: user?.isOnboarded ? 'CREATOR' : 'USER',
            senderType: 'user',
            senderName: user?.name || name || 'You',
            message: text.trim(),
            deliveryStatus: 'PENDING',
            readStatus: 'UNREAD',
            createdAt: new Date(),
            timestamp: new Date()
        };

        // Optimistic UI Append
        setCaseMessagesMap(prev => ({
            ...prev,
            [caseId]: [...(prev[caseId] || []), optimisticMsg]
        }));
        setUserReplyMap(prev => ({ ...prev, [caseId]: '' }));
        setFailedMessagesMap(prev => ({ ...prev, [caseId]: null }));
        setReplyingMap(prev => ({ ...prev, [caseId]: true }));

        try {
            const res = await api.post(`/support/cases/${caseId}/messages`, {
                message: text.trim()
            });

            if (res.data?.messageData) {
                setCaseMessagesMap(prev => ({
                    ...prev,
                    [caseId]: (prev[caseId] || []).map(m => m.messageId === optimisticMsgId ? res.data.messageData : m)
                }));
            }
            fetchMyCases();
        } catch (err) {
            // Mark failed for retry
            setCaseMessagesMap(prev => ({
                ...prev,
                [caseId]: (prev[caseId] || []).map(m => m.messageId === optimisticMsgId ? { ...m, deliveryStatus: 'FAILED' } : m)
            }));
            setFailedMessagesMap(prev => ({ ...prev, [caseId]: text.trim() }));
            triggerNotification({
                title: 'Message Delivery Failed',
                message: err.response?.data?.error || 'Could not reach support rail. Tap to retry.',
                type: 'error'
            });
        } finally {
            setReplyingMap(prev => ({ ...prev, [caseId]: false }));
        }
    };

    const handleCloseCase = async (caseId) => {
        setClosingMap(prev => ({ ...prev, [caseId]: true }));
        try {
            await api.post(`/support/cases/${caseId}/close`, {});
            triggerNotification({
                title: 'Case Closed',
                message: 'Your support case has been marked as closed.',
                type: 'success'
            });
            fetchMyCases();
        } catch (err) {
            triggerNotification({
                title: 'Action Failed',
                message: err.response?.data?.error || 'Could not close case.',
                type: 'error'
            });
        } finally {
            setClosingMap(prev => ({ ...prev, [caseId]: false }));
        }
    };

    const handleCopyEmail = () => {
        navigator.clipboard.writeText('support@gurshapay.com');
        setCopiedEmail(true);
        setTimeout(() => setCopiedEmail(false), 2200);
        triggerNotification({
            title: 'Email Copied',
            message: 'support@gurshapay.com copied to clipboard.',
            type: 'info'
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
            triggerNotification({
                title: 'Missing Fields',
                message: 'Please fill in your name, email, subject, and detailed description.',
                type: 'error'
            });
            return;
        }

        setSubmitting(true);
        try {
            const res = await api.post('/support/submit', {
                name,
                email,
                phone,
                category,
                subcategory,
                priority,
                subject,
                description: message,
                message,
                relatedTransactionId: relatedTransactionId || undefined,
                relatedWithdrawalId: relatedWithdrawalId || undefined,
                transactionRef: relatedTransactionId || undefined
            });

            const newCaseId = res.data?.caseId || res.data?.ticketNumber;
            setSubmittedCaseId(newCaseId);
            setSubject('');
            setMessage('');
            setRelatedTransactionId('');
            setRelatedWithdrawalId('');

            triggerNotification({
                title: 'Case Submitted Successfully! 🚀',
                message: `Your case #${newCaseId} has been submitted. You can track real-time responses below.`,
                type: 'success'
            });

            fetchMyCases();
        } catch (err) {
            triggerNotification({
                title: 'Submission Failed',
                message: err.response?.data?.error || 'Failed to submit case. Please try again.',
                type: 'error'
            });
        } finally {
            setSubmitting(false);
        }
    };

    // Filtered cases
    const filteredCases = useMemo(() => {
        return myCases.filter(c => {
            const subj = (c.subject || '').toLowerCase();
            const id = (c.caseId || c.ticketNumber || c._id || '').toLowerCase();
            const desc = (c.description || c.message || '').toLowerCase();
            const status = (c.status || 'OPEN').toUpperCase();
            const cat = (c.category || 'OTHER').toUpperCase();

            const matchesSearch = !searchQuery.trim() ||
                subj.includes(searchQuery.toLowerCase()) ||
                id.includes(searchQuery.toLowerCase()) ||
                desc.includes(searchQuery.toLowerCase());

            const matchesStatus = statusFilter === 'ALL' ||
                status === statusFilter ||
                (statusFilter === 'OPEN' && (status === 'OPEN' || status === 'IN_PROGRESS'));

            const matchesCategory = categoryFilter === 'ALL' || cat === categoryFilter;

            return matchesSearch && matchesStatus && matchesCategory;
        });
    }, [myCases, searchQuery, statusFilter, categoryFilter]);

    const faqs = [
        {
            q: 'How long do Telebirr and CBE Bank withdrawals take?',
            a: 'Telebirr and CBE bank disbursements are processed securely. Tips receive a 24-hour virtual ledger lock for fraud prevention before transferring automatically to your withdrawable balance.'
        },
        {
            q: 'How do I complete Fayda ID / KYC verification?',
            a: 'National ID verification and facial liveness must be completed using the GurshaPay Mobile App on Android for biometric security and compliance.'
        },
        {
            q: 'How do I configure my OBS Live Stream Overlay?',
            a: 'Copy your unique OBS Stream Overlay URL from your creator dashboard and add it as a Browser Source (width 1920, height 1080) in OBS Studio. It includes real-time fanfare alerts.'
        },
        {
            q: 'What should I do if a fan tip did not arrive?',
            a: 'Select category "Payment & Checkout" or "Tipping & Fan Support" in the form below and select your linked transaction. Our team will verify the payment rail directly with Chapa/Telebirr.'
        }
    ];

    const currentCategoryObj = CATEGORY_CATALOG.find(c => c.id === category) || CATEGORY_CATALOG[0];

    return (
        <div className="app-layout">
            {/* Mobile Header */}
            <div className="mobile-header">
                <Logo size="small" />
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <DirectChatDrawer />
                    <NotificationDrawer />
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', cursor: 'pointer', display: 'flex' }}
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            <Sidebar isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />

            <main className="main-content" style={{ maxWidth: '980px', margin: '0 auto', width: '100%' }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <h1 style={{ fontSize: 'clamp(1.4rem, 5vw, 1.85rem)', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.03em', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span>Support & Case Center</span>
                            <LifeBuoy size={26} color="var(--primary)" />
                        </h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem', marginBottom: 0 }}>
                            Real-time two-way support case messaging, tracking, and dispute management.
                        </p>
                    </div>

                    <div className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <DirectChatDrawer />
                        <NotificationDrawer />
                    </div>
                </div>

                {/* Quick Channels Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                    gap: '1rem',
                    marginBottom: '2rem'
                }}>
                    {/* Direct Email Card */}
                    <div style={{
                        background: 'var(--card-bg)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '16px',
                        padding: '1.25rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        boxShadow: 'var(--shadow-xs)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.12)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Mail size={20} />
                            </div>
                            <div>
                                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-main)' }}>Email Operations</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Average reply within 2 hours</div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--card-bg-subtle)', padding: '0.5rem 0.75rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)' }}>support@gurshapay.com</span>
                            <button
                                onClick={handleCopyEmail}
                                style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: 700 }}
                            >
                                {copiedEmail ? <Check size={14} /> : <Copy size={14} />}
                                {copiedEmail ? 'Copied' : 'Copy'}
                            </button>
                        </div>
                    </div>

                    {/* Telegram Official Channel */}
                    <div style={{
                        background: 'var(--card-bg)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '16px',
                        padding: '1.25rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        boxShadow: 'var(--shadow-xs)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(14, 165, 233, 0.12)', color: '#0EA5E9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <MessageSquare size={20} />
                            </div>
                            <div>
                                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-main)' }}>Telegram Creator Desk</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Direct 24/7 creator community</div>
                            </div>
                        </div>
                        <a 
                            href="https://t.me/GurshaPaySupport" 
                            target="_blank" 
                            rel="noreferrer"
                            style={{ textDecoration: 'none' }}
                        >
                            <Button variant="outline" size="sm" style={{ width: '100%', justifyContent: 'center', gap: '4px' }}>
                                <span>Open @GurshaPaySupport</span>
                                <ExternalLink size={13} />
                            </Button>
                        </a>
                    </div>
                </div>

                {/* Main Case Submission Form & FAQ Layout */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.75rem', marginBottom: '2rem' }}>
                    {/* Contact Form */}
                    <div style={{
                        background: 'var(--card-bg)',
                        border: '1.5px solid var(--border-color)',
                        borderRadius: '20px',
                        padding: 'clamp(1.25rem, 4vw, 1.75rem)',
                        boxShadow: 'var(--shadow-xs)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                            <Send size={18} color="var(--primary)" />
                            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                                Open a Support Case
                            </h2>
                        </div>

                        {submittedCaseId && (
                            <div style={{
                                background: 'rgba(16, 185, 129, 0.1)',
                                border: '1px solid var(--primary)',
                                borderRadius: '12px',
                                padding: '1rem',
                                marginBottom: '1.25rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem'
                            }}>
                                <CheckCircle size={20} color="var(--primary)" style={{ flexShrink: 0 }} />
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 600 }}>
                                    Case <strong>#{submittedCaseId}</strong> logged! Real-time two-way messaging is active in the discussion panel below.
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {/* Submitter Name & Email */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                                        Your Name
                                    </label>
                                    <input 
                                        type="text" 
                                        value={name} 
                                        onChange={e => setName(e.target.value)} 
                                        placeholder="Full name"
                                        required
                                        style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--card-bg-subtle)', color: 'var(--text-main)', fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                                        Email Address
                                    </label>
                                    <input 
                                        type="email" 
                                        value={email} 
                                        onChange={e => setEmail(e.target.value)} 
                                        placeholder="email@domain.com"
                                        required
                                        style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--card-bg-subtle)', color: 'var(--text-main)', fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box' }}
                                    />
                                </div>
                            </div>

                            {/* Category & Subcategory Selectors */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                                        Category
                                    </label>
                                    <select 
                                        value={category} 
                                        onChange={e => handleCategoryChange(e.target.value)}
                                        style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--card-bg-subtle)', color: 'var(--text-main)', fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box' }}
                                    >
                                        {CATEGORY_CATALOG.map(cat => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                                        Issue Subcategory
                                    </label>
                                    <select 
                                        value={subcategory} 
                                        onChange={e => setSubcategory(e.target.value)}
                                        style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--card-bg-subtle)', color: 'var(--text-main)', fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box' }}
                                    >
                                        {currentCategoryObj.subcategories.map((sub, idx) => (
                                            <option key={idx} value={sub}>
                                                {sub}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Priority & Phone Number */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                                        Priority
                                    </label>
                                    <select 
                                        value={priority} 
                                        onChange={e => setPriority(e.target.value)}
                                        style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--card-bg-subtle)', color: 'var(--text-main)', fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box' }}
                                    >
                                        <option value="NORMAL">Normal</option>
                                        <option value="HIGH">High Priority</option>
                                        <option value="URGENT">Urgent (Blocking Issue)</option>
                                        <option value="LOW">Low Priority</option>
                                    </select>
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                                        Phone Number (Optional)
                                    </label>
                                    <input 
                                        type="tel" 
                                        value={phone} 
                                        onChange={e => setPhone(e.target.value)} 
                                        placeholder="+251 9..."
                                        style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--card-bg-subtle)', color: 'var(--text-main)', fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box' }}
                                    />
                                </div>
                            </div>

                            {/* 1-Click Entity Linker (if user has recent transactions or withdrawals) */}
                            {category === 'WITHDRAWAL' && recentWithdrawals.length > 0 && (
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.35rem' }}>
                                        Link Recent Withdrawal (Optional)
                                    </label>
                                    <select
                                        value={relatedWithdrawalId}
                                        onChange={e => setRelatedWithdrawalId(e.target.value)}
                                        style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--card-bg-subtle)', color: 'var(--text-main)', fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box' }}
                                    >
                                        <option value="">-- None / General Withdrawal Issue --</option>
                                        {recentWithdrawals.map(w => (
                                            <option key={w._id} value={w.reference}>
                                                {w.reference} - {(w.amountRequested || 0).toFixed(2)} ETB ({w.bankName || w.payoutMethod}) [{w.status}]
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {(category === 'PAYMENT' || category === 'TIPPING') && recentTips.length > 0 && (
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.35rem' }}>
                                        Link Recent Tip Transaction (Optional)
                                    </label>
                                    <select
                                        value={relatedTransactionId}
                                        onChange={e => setRelatedTransactionId(e.target.value)}
                                        style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--card-bg-subtle)', color: 'var(--text-main)', fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box' }}
                                    >
                                        <option value="">-- None / General Tipping Issue --</option>
                                        {recentTips.map(t => (
                                            <option key={t._id} value={t.tx_ref}>
                                                {t.tx_ref} - {(t.amount || t.grossAmount || 0).toFixed(2)} ETB ({t.supporterName || 'Supporter'}) [{t.status}]
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {/* Subject */}
                            <div>
                                <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                                    Subject
                                </label>
                                <input 
                                    type="text" 
                                    value={subject} 
                                    onChange={e => setSubject(e.target.value)} 
                                    placeholder="Brief summary of your question or issue"
                                    required
                                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--card-bg-subtle)', color: 'var(--text-main)', fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box' }}
                                />
                            </div>

                            {/* Detailed Description */}
                            <div>
                                <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                                    Detailed Description
                                </label>
                                <textarea 
                                    rows={4}
                                    value={message} 
                                    onChange={e => setMessage(e.target.value)} 
                                    placeholder="Explain your inquiry, issue, or feedback in detail..."
                                    required
                                    style={{ width: '100%', padding: '0.75rem 0.85rem', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--card-bg-subtle)', color: 'var(--text-main)', fontSize: '0.85rem', outline: 'none', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }}
                                />
                            </div>

                            <Button 
                                type="submit" 
                                variant="primary" 
                                size="md" 
                                loading={submitting}
                                icon={Send}
                                style={{ width: '100%', justifyContent: 'center' }}
                            >
                                Submit Support Case
                            </Button>
                        </form>
                    </div>

                    {/* FAQ & Quick Help */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{
                            background: 'var(--card-bg)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '20px',
                            padding: '1.5rem',
                            boxShadow: 'var(--shadow-xs)'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                                <HelpCircle size={18} color="var(--primary)" />
                                <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                                    Frequently Asked Questions
                                </h2>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                                {faqs.map((faq, idx) => {
                                    const isOpen = openFaq === idx;
                                    return (
                                        <div 
                                            key={idx}
                                            style={{
                                                border: '1px solid var(--border-color)',
                                                borderRadius: '12px',
                                                overflow: 'hidden',
                                                background: 'var(--card-bg-subtle)',
                                                transition: 'all 0.15s ease'
                                            }}
                                        >
                                            <button
                                                type="button"
                                                onClick={() => setOpenFaq(isOpen ? null : idx)}
                                                style={{
                                                    width: '100%',
                                                    padding: '0.85rem 1rem',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    background: 'none',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    textAlign: 'left',
                                                    color: 'var(--text-main)',
                                                    fontWeight: 700,
                                                    fontSize: '0.85rem'
                                                }}
                                            >
                                                <span>{faq.q}</span>
                                                {isOpen ? <ChevronUp size={16} color="var(--primary)" /> : <ChevronDown size={16} color="var(--text-muted)" />}
                                            </button>
                                            {isOpen && (
                                                <div style={{ padding: '0 1rem 0.85rem', fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                                                    {faq.a}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Security Assurance */}
                        <div style={{
                            background: 'rgba(16, 185, 129, 0.06)',
                            border: '1px solid rgba(16, 185, 129, 0.2)',
                            borderRadius: '16px',
                            padding: '1.25rem',
                            display: 'flex',
                            gap: '0.75rem',
                            alignItems: 'flex-start'
                        }}>
                            <ShieldCheck size={20} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                                <strong style={{ color: 'var(--text-main)' }}>Bank-Grade Protection:</strong> Real-time two-way messaging is encrypted and audited with end-to-end delivery tracking.
                            </div>
                        </div>
                    </div>
                </div>

                {/* My Active Support Cases Hub */}
                {myCases.length > 0 && (
                    <div style={{
                        background: 'var(--card-bg)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '20px',
                        padding: '1.5rem',
                        marginBottom: '2rem',
                        boxShadow: 'var(--shadow-xs)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Clock size={18} color="var(--primary)" />
                                <span>My Support Cases ({myCases.length})</span>
                            </h2>

                            {/* Search and Category Filter */}
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                                <div style={{ position: 'relative' }}>
                                    <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                    <input
                                        type="text"
                                        placeholder="Search cases..."
                                        value={searchQuery}
                                        onChange={e => setSearchQuery(e.target.value)}
                                        style={{ padding: '0.45rem 0.65rem 0.45rem 1.85rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--card-bg-subtle)', color: 'var(--text-main)', fontSize: '0.8rem', outline: 'none', width: '160px' }}
                                    />
                                </div>
                                <select
                                    value={statusFilter}
                                    onChange={e => setStatusFilter(e.target.value)}
                                    style={{ padding: '0.45rem 0.65rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--card-bg-subtle)', color: 'var(--text-main)', fontSize: '0.8rem', outline: 'none' }}
                                >
                                    <option value="ALL">All Statuses</option>
                                    <option value="OPEN">Open / In Progress</option>
                                    <option value="WAITING_FOR_USER">Waiting User</option>
                                    <option value="WAITING_FOR_INTERNAL_REVIEW">Needs Review</option>
                                    <option value="RESOLVED">Resolved</option>
                                    <option value="CLOSED">Closed</option>
                                </select>
                            </div>
                        </div>

                        {filteredCases.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                                No support cases match your filter criteria.
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {filteredCases.map(c => {
                                    const caseId = c.caseId || c.ticketNumber || c._id;
                                    const isExpanded = expandedCaseId === caseId || expandedCaseId === c._id;
                                    const isResolved = c.status === 'RESOLVED';
                                    const isWaitingUser = c.status === 'WAITING_FOR_USER';
                                    const isClosed = c.status === 'CLOSED';

                                    const messages = caseMessagesMap[caseId] || caseMessagesMap[c._id] || c.messages || [];
                                    const lastResponseMsg = c.lastResponse?.message || c.description || c.message;
                                    const hasUnread = (c.unreadCustomerCount || 0) > 0;
                                    const isTypingAgent = agentTypingMap[caseId] || agentTypingMap[c._id];

                                    return (
                                        <div 
                                            key={c._id}
                                            style={{
                                                background: 'var(--card-bg-subtle)',
                                                border: `1px solid ${hasUnread ? 'var(--primary)' : isWaitingUser ? '#6366F1' : isResolved ? '#10B981' : isClosed ? 'var(--border-color)' : 'var(--border-color)'}`,
                                                borderRadius: '12px',
                                                padding: '1rem',
                                                transition: 'all 0.15s ease',
                                                boxShadow: hasUnread ? '0 0 0 1px var(--primary)' : 'none'
                                            }}
                                        >
                                            <div 
                                                onClick={() => setExpandedCaseId(isExpanded ? null : (c.caseId || c._id))}
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    cursor: 'pointer',
                                                    flexWrap: 'wrap',
                                                    gap: '0.75rem'
                                                }}
                                            >
                                                <div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                                                        <span style={{ fontWeight: 800, fontSize: '0.875rem', color: 'var(--text-main)' }}>
                                                            {c.subject}
                                                        </span>
                                                        <Badge variant={isResolved ? 'success' : isWaitingUser ? 'primary' : isClosed ? 'neutral' : 'warning'} size="sm">
                                                            {c.status}
                                                        </Badge>
                                                        {hasUnread && (
                                                            <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#fff', background: '#10B981', padding: '1px 7px', borderRadius: '999px' }}>
                                                                {c.unreadCustomerCount} New
                                                            </span>
                                                        )}
                                                        {c.priority && c.priority !== 'NORMAL' && (
                                                            <span style={{ fontSize: '0.7rem', fontWeight: 800, color: c.priority === 'URGENT' ? '#DC2626' : '#D97706', background: c.priority === 'URGENT' ? 'rgba(220,38,38,0.1)' : 'rgba(217,119,6,0.1)', padding: '2px 6px', borderRadius: '4px' }}>
                                                                {c.priority}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                                        Case #{caseId} • Category: {c.category} • {c.subcategory && `(${c.subcategory}) • `} Updated: {new Date(c.updatedAt || c.createdAt).toLocaleDateString()}
                                                    </div>
                                                    {lastResponseMsg && !isExpanded && (
                                                        <div style={{ fontSize: '0.775rem', color: 'var(--text-secondary)', marginTop: '4px', maxWidth: '600px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                            <em>Last response: {lastResponseMsg}</em>
                                                        </div>
                                                    )}
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <span style={{ fontSize: '0.775rem', color: 'var(--primary)', fontWeight: 700 }}>
                                                        {isExpanded ? 'Close Chat' : 'Open Two-Way Chat'}
                                                    </span>
                                                    {isExpanded ? <ChevronUp size={16} color="var(--primary)" /> : <ChevronDown size={16} color="var(--text-muted)" />}
                                                </div>
                                            </div>

                                            {isExpanded && (
                                                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                                                    {/* Resolution Box if resolved */}
                                                    {c.resolution && (
                                                        <div style={{
                                                            background: 'rgba(16, 185, 129, 0.08)',
                                                            border: '1px solid rgba(16, 185, 129, 0.3)',
                                                            borderRadius: '8px',
                                                            padding: '10px 14px',
                                                            marginBottom: '1rem'
                                                        }}>
                                                            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                                <CheckCheck size={14} /> RESOLUTION SUMMARY:
                                                            </div>
                                                            <div style={{ fontSize: '0.825rem', color: 'var(--text-main)' }}>
                                                                {c.resolution}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Real-time Two-Way Chat Messages Thread */}
                                                    <div style={{
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        gap: '10px',
                                                        marginBottom: '1rem',
                                                        maxHeight: '380px',
                                                        overflowY: 'auto',
                                                        padding: '4px'
                                                    }}>
                                                        {messages.length > 0 ? (
                                                            messages.map((m, idx) => {
                                                                const isAdmin = m.senderRole === 'ADMIN' || m.senderRole === 'SUPPORT_AGENT' || m.senderType === 'admin';
                                                                const isSystem = m.senderType === 'system' || m.senderRole === 'SYSTEM';
                                                                const isMe = !isAdmin && !isSystem;

                                                                const isRead = m.readStatus === 'READ';
                                                                const isFailed = m.deliveryStatus === 'FAILED';
                                                                const isPending = m.deliveryStatus === 'PENDING';

                                                                if (isSystem) {
                                                                    return (
                                                                        <div key={idx} style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', padding: '2px 0' }}>
                                                                            <em>{m.message}</em>
                                                                        </div>
                                                                    );
                                                                }

                                                                return (
                                                                    <div 
                                                                        key={m.messageId || idx}
                                                                        style={{
                                                                            alignSelf: isAdmin ? 'flex-start' : 'flex-end',
                                                                            maxWidth: '85%',
                                                                            background: isAdmin ? 'rgba(16, 185, 129, 0.12)' : 'var(--card-bg)',
                                                                            border: isFailed ? '1px solid #EF4444' : isAdmin ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid var(--border-color)',
                                                                            borderRadius: '12px',
                                                                            padding: '0.65rem 0.85rem',
                                                                            position: 'relative'
                                                                        }}
                                                                    >
                                                                        <div style={{ fontSize: '0.725rem', fontWeight: 800, color: isAdmin ? 'var(--primary)' : 'var(--text-muted)', marginBottom: '3px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                                                                            <span>{isAdmin ? '🛡️ GurshaPay Support' : 'You'}</span>
                                                                            <span style={{ fontSize: '0.7rem', fontWeight: 500 }}>
                                                                                {new Date(m.createdAt || m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                            </span>
                                                                        </div>

                                                                        <div style={{ fontSize: '0.825rem', color: 'var(--text-main)', whiteSpace: 'pre-line', lineHeight: 1.45 }}>
                                                                            {m.message}
                                                                        </div>

                                                                        {/* Status & Read Receipt Indicator */}
                                                                        {isMe && (
                                                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '3px', marginTop: '3px', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                                                                                {isPending && <span style={{ color: '#D97706' }}>Sending...</span>}
                                                                                {isFailed && (
                                                                                    <span 
                                                                                        onClick={() => handleSendUserReply(caseId, m.message)}
                                                                                        style={{ color: '#EF4444', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '2px' }}
                                                                                    >
                                                                                        <AlertTriangle size={11} /> Failed (Tap to retry)
                                                                                    </span>
                                                                                )}
                                                                                {!isPending && !isFailed && (
                                                                                    isRead ? (
                                                                                        <span style={{ color: '#10B981', display: 'flex', alignItems: 'center', gap: '1px' }}>
                                                                                            <CheckCheck size={13} /> Read
                                                                                        </span>
                                                                                    ) : (
                                                                                        <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '1px' }}>
                                                                                            <Check size={12} /> Delivered
                                                                                        </span>
                                                                                    )
                                                                                )}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                );
                                                            })
                                                        ) : (
                                                            <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                                                                {c.description || c.message}
                                                            </div>
                                                        )}

                                                        {isTypingAgent && (
                                                            <div style={{ alignSelf: 'flex-start', fontSize: '0.75rem', color: 'var(--primary)', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                                <span className="dot-flashing"></span> Support officer is typing...
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* User Reply Input & Close Action */}
                                                    {c.status !== 'CLOSED' && (
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                                                <input
                                                                    type="text"
                                                                    value={userReplyMap[caseId] || ''}
                                                                    onChange={(e) => {
                                                                        setUserReplyMap({ ...userReplyMap, [caseId]: e.target.value });
                                                                        if (socketRef.current) {
                                                                            socketRef.current.emit('case_typing', { caseId, senderName: user?.name || 'Customer', isTyping: e.target.value.length > 0 });
                                                                        }
                                                                    }}
                                                                    placeholder="Type your message to support..."
                                                                    onKeyDown={(e) => { if (e.key === 'Enter') handleSendUserReply(caseId); }}
                                                                    style={{
                                                                        flex: 1,
                                                                        padding: '0.65rem 0.85rem',
                                                                        borderRadius: '10px',
                                                                        border: '1px solid var(--border-color)',
                                                                        background: 'var(--card-bg)',
                                                                        color: 'var(--text-main)',
                                                                        fontSize: '0.85rem',
                                                                        outline: 'none'
                                                                    }}
                                                                />
                                                                <Button
                                                                    variant="primary"
                                                                    size="sm"
                                                                    loading={replyingMap[caseId]}
                                                                    disabled={!(userReplyMap[caseId] || '').trim()}
                                                                    onClick={() => handleSendUserReply(caseId)}
                                                                >
                                                                    <Send size={14} /> Send
                                                                </Button>
                                                            </div>

                                                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                                <button
                                                                    onClick={() => handleCloseCase(caseId)}
                                                                    disabled={closingMap[caseId]}
                                                                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.75rem', cursor: 'pointer', textDecoration: 'underline' }}
                                                                >
                                                                    {closingMap[caseId] ? 'Closing case...' : 'Mark case as resolved & close'}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
