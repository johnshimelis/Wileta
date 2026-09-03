import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import NotificationDrawer from '../components/NotificationDrawer';
import {
    LifeBuoy, Mail, Send, MessageSquare, CheckCircle,
    AlertCircle, HelpCircle, ChevronDown, ChevronUp, Copy, Check,
    ExternalLink, Menu, X, Clock, ShieldCheck, Zap, ArrowRight, CornerDownRight
} from 'lucide-react';
import Logo from '../components/Logo';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { useNotification } from '../context/NotificationContext';

export default function Support() {
    const { user, api } = useAuth();
    const { triggerNotification } = useNotification();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Form state
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [phone, setPhone] = useState(user?.phone || '');
    const [category, setCategory] = useState('general_feedback');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [transactionRef, setTransactionRef] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [submittedSuccess, setSubmittedSuccess] = useState(false);
    const [copiedEmail, setCopiedEmail] = useState(false);

    // FAQ state
    const [openFaq, setOpenFaq] = useState(null);

    // User's tickets
    const [myTickets, setMyTickets] = useState([]);
    const [loadingTickets, setLoadingTickets] = useState(false);
    const [expandedTicketId, setExpandedTicketId] = useState(null);
    const [userReplyMap, setUserReplyMap] = useState({});
    const [replyingMap, setReplyingMap] = useState({});

    useEffect(() => {
        if (user) {
            setName(user.name || '');
            setEmail(user.email || '');
            setPhone(user.phone || '');
            fetchMyTickets();
        }
    }, [user]);

    const fetchMyTickets = async () => {
        setLoadingTickets(true);
        try {
            const res = await api.get('/support/my-tickets');
            if (res.data?.tickets) {
                setMyTickets(res.data.tickets);
            }
        } catch (e) {
            // Optional/silent fail if not logged in
        } finally {
            setLoadingTickets(false);
        }
    };

    const handleSendUserReply = async (ticketId) => {
        const text = userReplyMap[ticketId];
        if (!text || !text.trim()) return;

        setReplyingMap(prev => ({ ...prev, [ticketId]: true }));
        try {
            await api.post(`/support/ticket/${ticketId}/reply`, {
                message: text.trim()
            });
            setUserReplyMap(prev => ({ ...prev, [ticketId]: '' }));
            triggerNotification({
                title: 'Reply Sent',
                message: 'Your reply has been added to the ticket.',
                type: 'success'
            });
            fetchMyTickets();
        } catch (err) {
            triggerNotification({
                title: 'Failed to send reply',
                message: err.response?.data?.error || 'Please try again.',
                type: 'error'
            });
        } finally {
            setReplyingMap(prev => ({ ...prev, [ticketId]: false }));
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
                message: 'Please fill in your name, email, subject, and message.',
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
                subject,
                message,
                transactionRef: transactionRef.trim() || undefined
            });

            setSubmittedSuccess(true);
            setSubject('');
            setMessage('');
            setTransactionRef('');

            triggerNotification({
                title: 'Message Sent Successfully! 🚀',
                message: res.data?.message || 'Your support request has been submitted to the admin team.',
                type: 'success'
            });

            fetchMyTickets();
        } catch (err) {
            triggerNotification({
                title: 'Submission Failed',
                message: err.response?.data?.error || 'Failed to submit message. Please try again.',
                type: 'error'
            });
        } finally {
            setSubmitting(false);
        }
    };

    const faqs = [
        {
            q: 'How long do Telebirr and CBE Bank withdrawals take?',
            a: 'Once approved, Telebirr and CBE bank payouts are transferred directly to your account. Incoming tips enter a 24-hour virtual ledger lock for fraud prevention before moving to your available withdrawable balance.'
        },
        {
            q: 'How do I verify my Fayda National ID / KYC?',
            a: 'National ID verification and facial liveness must be completed using the GurshaPay Mobile App on Android/Google Play Store for tamper-proof biometric compliance.'
        },
        {
            q: 'How do I configure my OBS Live Stream Overlay?',
            a: 'Copy your unique OBS Stream Overlay URL from your dashboard and add it as a Browser Source (width 1920, height 1080) in OBS Studio. It includes built-in transparency and alert sound fanfares.'
        },
        {
            q: 'What should I do if a fan tip did not arrive?',
            a: 'Provide the Chapa transaction reference or tipper phone number in the contact form below with category "Tipping Issue". Our engineering team will trace the payment rail immediately.'
        }
    ];

    return (
        <div className="app-layout">
            {/* Mobile Header */}
            <div className="mobile-header">
                <Logo size="small" />
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
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

            <main className="main-content" style={{ maxWidth: '960px', margin: '0 auto', width: '100%' }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <h1 style={{ fontSize: 'clamp(1.4rem, 5vw, 1.85rem)', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.03em', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span>Support & Help Center</span>
                            <LifeBuoy size={26} color="var(--primary)" />
                        </h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem', marginBottom: 0 }}>
                            Send feedback, report an issue, or contact the GurshaPay admin team directly.
                        </p>
                    </div>

                    <div className="desktop-only">
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
                                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-main)' }}>Email Support</div>
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
                                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-main)' }}>Telegram Support</div>
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

                {/* Main Contact Form & FAQ Layout */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.75rem', marginBottom: '2rem' }}>
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
                                Send Message to Admin
                            </h2>
                        </div>

                        {submittedSuccess && (
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
                                <span style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 600 }}>
                                    Message received! Our engineering and support team will respond to your email.
                                </span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                                        Category
                                    </label>
                                    <select 
                                        value={category} 
                                        onChange={e => setCategory(e.target.value)}
                                        style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--card-bg-subtle)', color: 'var(--text-main)', fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box' }}
                                    >
                                        <option value="general_feedback">💡 General Feedback / Suggestion</option>
                                        <option value="payment_payout">💳 Payout & Withdrawal Inquiry</option>
                                        <option value="tip_issue">🎁 Tipping Issue / Missing Tip</option>
                                        <option value="kyc_fayda">🔒 KYC & ID Verification</option>
                                        <option value="account_security">🛡️ Account Security & Login</option>
                                        <option value="bug_report">🐛 Bug Report / Technical Issue</option>
                                        <option value="other">❓ Other Question</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                                        Tx Reference (Optional)
                                    </label>
                                    <input 
                                        type="text" 
                                        value={transactionRef} 
                                        onChange={e => setTransactionRef(e.target.value)} 
                                        placeholder="e.g. GP-TX-12345"
                                        style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--card-bg-subtle)', color: 'var(--text-main)', fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box' }}
                                    />
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                                    Subject
                                </label>
                                <input 
                                    type="text" 
                                    value={subject} 
                                    onChange={e => setSubject(e.target.value)} 
                                    placeholder="Brief summary of your question or feedback"
                                    required
                                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--card-bg-subtle)', color: 'var(--text-main)', fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box' }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                                    Detailed Message
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
                                Submit Message to Admin
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
                                <strong style={{ color: 'var(--text-main)' }}>Bank-Grade Security:</strong> All inquiries regarding payouts and transactions are encrypted and audited to protect creator balances and privacy.
                            </div>
                        </div>
                    </div>
                </div>

                {/* My Active Submitted Tickets Section (if logged in and has tickets) */}
                {myTickets.length > 0 && (
                    <div style={{
                        background: 'var(--card-bg)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '20px',
                        padding: '1.5rem',
                        marginBottom: '2rem',
                        boxShadow: 'var(--shadow-xs)'
                    }}>
                        <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Clock size={18} color="var(--primary)" />
                            <span>My Submitted Messages ({myTickets.length})</span>
                        </h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {myTickets.map(ticket => {
                                const isExpanded = expandedTicketId === ticket._id;
                                return (
                                    <div 
                                        key={ticket._id}
                                        style={{
                                            background: 'var(--card-bg-subtle)',
                                            border: '1px solid var(--border-color)',
                                            borderRadius: '12px',
                                            padding: '1rem',
                                            transition: 'all 0.15s ease'
                                        }}
                                    >
                                        <div 
                                            onClick={() => setExpandedTicketId(isExpanded ? null : ticket._id)}
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
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                                    <span style={{ fontWeight: 800, fontSize: '0.875rem', color: 'var(--text-main)' }}>
                                                        {ticket.subject}
                                                    </span>
                                                    <Badge variant={ticket.status === 'RESOLVED' ? 'success' : 'primary'} size="sm">
                                                        {ticket.status}
                                                    </Badge>
                                                </div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                                    Ticket #{ticket.ticketNumber || ticket._id.slice(-6).toUpperCase()} • {new Date(ticket.createdAt).toLocaleDateString()}
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <span style={{ fontSize: '0.775rem', color: 'var(--primary)', fontWeight: 700 }}>
                                                    {isExpanded ? 'Hide Thread' : 'View Thread'}
                                                </span>
                                                {isExpanded ? <ChevronUp size={16} color="var(--primary)" /> : <ChevronDown size={16} color="var(--text-muted)" />}
                                            </div>
                                        </div>

                                        {isExpanded && (
                                            <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                                                {/* Messages Thread */}
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '1rem' }}>
                                                    {ticket.messages && ticket.messages.length > 0 ? (
                                                        ticket.messages.map((m, idx) => {
                                                            const isAdmin = m.senderType === 'admin';
                                                            const isSystem = m.senderType === 'system';

                                                            if (isSystem) {
                                                                return (
                                                                    <div key={idx} style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                                                        <em>{m.message}</em>
                                                                    </div>
                                                                );
                                                            }

                                                            return (
                                                                <div 
                                                                    key={idx}
                                                                    style={{
                                                                        alignSelf: isAdmin ? 'flex-start' : 'flex-end',
                                                                        maxWidth: '85%',
                                                                        background: isAdmin ? 'rgba(16, 185, 129, 0.12)' : 'var(--card-bg)',
                                                                        border: isAdmin ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid var(--border-color)',
                                                                        borderRadius: '10px',
                                                                        padding: '0.65rem 0.85rem'
                                                                    }}
                                                                >
                                                                    <div style={{ fontSize: '0.725rem', fontWeight: 800, color: isAdmin ? 'var(--primary)' : 'var(--text-muted)', marginBottom: '2px' }}>
                                                                        {isAdmin ? '🛡️ GurshaPay Support' : 'You'} • {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                    </div>
                                                                    <div style={{ fontSize: '0.825rem', color: 'var(--text-main)', whiteSpace: 'pre-line', lineHeight: 1.4 }}>
                                                                        {m.message}
                                                                    </div>
                                                                </div>
                                                            );
                                                        })
                                                    ) : (
                                                        <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                                                            {ticket.message}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* User Reply Input */}
                                                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                                    <input
                                                        type="text"
                                                        value={userReplyMap[ticket._id] || ''}
                                                        onChange={(e) => setUserReplyMap({ ...userReplyMap, [ticket._id]: e.target.value })}
                                                        placeholder="Write a follow-up reply..."
                                                        onKeyDown={(e) => { if (e.key === 'Enter') handleSendUserReply(ticket._id); }}
                                                        style={{
                                                            flex: 1,
                                                            padding: '0.55rem 0.75rem',
                                                            borderRadius: '8px',
                                                            border: '1px solid var(--border-color)',
                                                            background: 'var(--card-bg)',
                                                            color: 'var(--text-main)',
                                                            fontSize: '0.825rem',
                                                            outline: 'none'
                                                        }}
                                                    />
                                                    <Button
                                                        variant="primary"
                                                        size="sm"
                                                        loading={replyingMap[ticket._id]}
                                                        disabled={!(userReplyMap[ticket._id] || '').trim()}
                                                        onClick={() => handleSendUserReply(ticket._id)}
                                                    >
                                                        Reply
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
