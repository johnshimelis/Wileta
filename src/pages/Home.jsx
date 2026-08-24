import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    ArrowRight, Smartphone, Wallet, ShieldCheck, Zap,
    CheckCircle, MessageSquare, Heart, Video, Sparkles,
    ChevronDown, ChevronUp, Copy, Users
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { useLanguage } from '../context/LanguageContext';

export default function Home() {
    const { t } = useLanguage();
    const navigate = useNavigate();

    // Interactive Hero Simulator state
    const [simAmount, setSimAmount] = useState('100');
    const [simMessage, setSimMessage] = useState('Keep making amazing content! ☕');
    const [simSuccess, setSimSuccess] = useState(false);

    // FAQ Accordion state
    const [openFaq, setOpenFaq] = useState(null);

    const toggleFaq = (index) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    const handleSimulateTip = (e) => {
        e.preventDefault();
        setSimSuccess(true);
        setTimeout(() => setSimSuccess(false), 4000);
    };

    const faqs = [
        {
            q: "How do Ethiopian creators receive money on GurshaPay?",
            a: "Supporters can tip you in seconds using their Telebirr wallet. Your earnings accumulate in your GurshaPay balance, and you can withdraw directly to your verified Telebirr number or linked Ethiopian bank account (Commercial Bank of Ethiopia, Bank of Abyssinia, Awash, Dashen, etc.)."
        },
        {
            q: "How does the OBS Live Stream Alert Overlay work?",
            a: "Every GurshaPay creator receives a unique Browser Source URL in their dashboard. Simply paste this URL into OBS Studio or Streamlabs. Whenever a fan sends you a tip, an on-screen alert animation with sound and their custom message pops up in real-time."
        },
        {
            q: "What is KYC Identity Verification and why is it needed?",
            a: "To comply with national financial regulations and protect creator earnings against fraud, we require a quick, one-time KYC verification (National ID or Passport photo + selfie) before processing withdrawals."
        },
        {
            q: "Can supporters leave custom messages with their tips?",
            a: "Yes! Supporters can write a personal shoutout message when sending a tip. These messages appear on your public supporter leaderboard and on your live stream overlay."
        }
    ];

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-color)' }}>
            <Navbar />

            {/* HERO SECTION */}
            <section style={{ padding: '5rem 1.5rem 4rem', maxWidth: 'var(--container-max)', margin: '0 auto' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '3.5rem', alignItems: 'center' }}>
                    <div>
                        <Badge variant="primary" size="md" icon={Sparkles} style={{ marginBottom: '1.25rem', padding: '0.4rem 0.85rem' }}>
                            Ethiopia's #1 Creator Monetization Platform
                        </Badge>
                        <h1 className="heading-display" style={{ marginBottom: '1.25rem' }}>
                            Turn Support Into <span className="text-gradient">Sustainable Income.</span>
                        </h1>
                        <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: 1.6 }}>
                            The modern, trusted platform for Ethiopian YouTubers, streamers, artists, and podcasters to receive direct tips via Telebirr and local banks.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
                            <Button
                                variant="primary"
                                size="lg"
                                icon={ArrowRight}
                                iconPosition="right"
                                onClick={() => navigate('/signup')}
                            >
                                Start Receiving Tips Free
                            </Button>
                            <a href="#how-it-works">
                                <Button variant="secondary" size="lg">
                                    See How It Works
                                </Button>
                            </a>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
                            <div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-main)' }}>0%</div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Setup Fee</div>
                            </div>
                            <div style={{ width: '1px', height: '32px', background: 'var(--border-color)' }}></div>
                            <div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-main)' }}>Instant</div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Telebirr Payouts</div>
                            </div>
                            <div style={{ width: '1px', height: '32px', background: 'var(--border-color)' }}></div>
                            <div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-main)' }}>OBS Ready</div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Stream Alerts</div>
                            </div>
                        </div>
                    </div>

                    {/* INTERACTIVE TIPPING PREVIEW SIMULATOR */}
                    <div>
                        <Card padding="none" style={{ borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-xl)', border: '1px solid var(--border-color)' }}>
                            <div style={{ background: 'linear-gradient(135deg, #064E3B 0%, #0A5C36 100%)', padding: '1.5rem', color: 'white', position: 'relative' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                                        <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'white', color: 'var(--primary)', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>
                                            H
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>Support Hana Tadesse</div>
                                            <div style={{ fontSize: '0.8rem', opacity: 0.85 }}>@hanacreates • Verified Creator</div>
                                        </div>
                                    </div>
                                    <Badge variant="success" size="sm" icon={CheckCircle} style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}>
                                        Live Demo
                                    </Badge>
                                </div>
                            </div>

                            <div style={{ padding: '1.75rem' }}>
                                {simSuccess ? (
                                    <div className="animate-fade-in" style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                                        <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--success-light)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                                            <CheckCircle size={32} />
                                        </div>
                                        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.35rem' }}>Tip Successfully Sent!</h3>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
                                            Hana received <strong style={{ color: 'var(--primary)' }}>{simAmount} ETB</strong> directly in her Telebirr balance.
                                        </p>
                                        <Badge variant="primary">OBS Alert Triggered ⚡</Badge>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSimulateTip}>
                                        <label className="form-label" style={{ marginBottom: '0.65rem' }}>Select Tip Amount (ETB)</label>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', marginBottom: '1.25rem' }}>
                                            {['50', '100', '250', '500'].map((amt) => (
                                                <button
                                                    key={amt}
                                                    type="button"
                                                    onClick={() => setSimAmount(amt)}
                                                    style={{
                                                        padding: '0.65rem 0',
                                                        borderRadius: 'var(--radius-md)',
                                                        border: simAmount === amt ? '2px solid var(--primary)' : '2px solid var(--border-color)',
                                                        background: simAmount === amt ? 'var(--primary-light)' : 'var(--card-bg)',
                                                        color: simAmount === amt ? 'var(--primary)' : 'var(--text-main)',
                                                        fontWeight: 800,
                                                        fontSize: '0.95rem',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.2s ease'
                                                    }}
                                                >
                                                    {amt} ETB
                                                </button>
                                            ))}
                                        </div>

                                        <div className="form-group">
                                            <label className="form-label">Support Message</label>
                                            <input
                                                type="text"
                                                className="form-input"
                                                value={simMessage}
                                                onChange={(e) => setSimMessage(e.target.value)}
                                                placeholder="Say something inspiring..."
                                            />
                                        </div>

                                        <Button
                                            type="submit"
                                            variant="primary"
                                            size="lg"
                                            icon={Smartphone}
                                            className="btn-full"
                                        >
                                            Send {simAmount} ETB with Telebirr
                                        </Button>
                                    </form>
                                )}
                            </div>
                        </Card>
                    </div>
                </div>
            </section>

            {/* TRUSTED PAYOUT CHANNELS */}
            <section id="payouts" style={{ padding: '3rem 1.5rem', background: 'var(--card-bg)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
                <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', textAlign: 'center' }}>
                    <p style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                        Seamless Integration with Leading Ethiopian Financial Services
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '3rem', flexWrap: 'wrap', opacity: 0.85 }}>
                        <span style={{ fontWeight: 800, fontSize: '1.25rem', color: '#0072CE' }}>Telebirr</span>
                        <span style={{ fontWeight: 800, fontSize: '1.25rem', color: '#5C2D91' }}>Commercial Bank of Ethiopia</span>
                        <span style={{ fontWeight: 800, fontSize: '1.25rem', color: '#F89B2B' }}>Bank of Abyssinia</span>
                        <span style={{ fontWeight: 800, fontSize: '1.25rem', color: '#00539F' }}>Awash Bank</span>
                        <span style={{ fontWeight: 800, fontSize: '1.25rem', color: '#F37021' }}>Dashen Bank</span>
                    </div>
                </div>
            </section>

            {/* HOW IT WORKS */}
            <section id="how-it-works" style={{ padding: '6rem 1.5rem', maxWidth: 'var(--container-max)', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <Badge variant="primary" style={{ marginBottom: '0.75rem' }}>Simple 3-Step Flow</Badge>
                    <h2 style={{ fontSize: '2.25rem', fontWeight: 900 }}>How GurshaPay Works</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '600px', margin: '0.5rem auto 0' }}>
                        Start earning from your audience in under two minutes with zero technical hassle.
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                    <Card hover style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1.25rem' }}>
                            1
                        </div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Claim Your Link</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                            Create your free creator profile in seconds and get your customized link (e.g. <code>gurshapay.com/@yourname</code>).
                        </p>
                    </Card>

                    <Card hover style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: 'rgba(212, 175, 55, 0.15)', background: 'rgba(212, 175, 55, 0.15)', color: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1.25rem' }}>
                            2
                        </div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Share With Your Audience</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                            Drop your link in your YouTube descriptions, TikTok bio, Telegram channel, or embed our OBS overlay in your live streams.
                        </p>
                    </Card>

                    <Card hover style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: 'rgba(5, 150, 105, 0.15)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1.25rem' }}>
                            3
                        </div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Withdraw Directly</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                            Receive automated notifications for every tip. Transfer funds straight to Telebirr or your Ethiopian bank account anytime.
                        </p>
                    </Card>
                </div>
            </section>

            {/* FEATURES SECTION */}
            <section id="features" style={{ padding: '6rem 1.5rem', background: 'var(--card-bg-subtle)' }}>
                <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <Badge variant="primary" style={{ marginBottom: '0.75rem' }}>Built for Ethiopian Creators</Badge>
                        <h2 style={{ fontSize: '2.25rem', fontWeight: 900 }}>Everything You Need to Monetize</h2>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
                        <Card hover>
                            <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-md)', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                                <Video size={22} />
                            </div>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.5rem' }}>OBS Stream Alert Overlay</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                                Stream on YouTube, TikTok, or Twitch with real-time sound and visual tip alerts that keep your viewers engaged.
                            </p>
                        </Card>

                        <Card hover>
                            <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-md)', background: 'rgba(212, 175, 55, 0.15)', color: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                                <Users size={22} />
                            </div>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Top Fans Leaderboard</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                                Celebrate your biggest supporters with automated monthly and lifetime supporter leaderboards on your profile.
                            </p>
                        </Card>

                        <Card hover>
                            <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-md)', background: 'rgba(5, 150, 105, 0.15)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                                <ShieldCheck size={22} />
                            </div>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Bank-Grade Security & KYC</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                                End-to-end encrypted transactions, verified identity protection, and zero exposure of your private bank credentials.
                            </p>
                        </Card>
                    </div>
                </div>
            </section>

            {/* FAQ SECTION */}
            <section id="faq" style={{ padding: '6rem 1.5rem', maxWidth: '800px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
                    <Badge variant="neutral" style={{ marginBottom: '0.75rem' }}>Got Questions?</Badge>
                    <h2 style={{ fontSize: '2.25rem', fontWeight: 900 }}>Frequently Asked Questions</h2>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {faqs.map((faq, index) => (
                        <Card
                            key={index}
                            padding="none"
                            style={{ overflow: 'hidden', cursor: 'pointer' }}
                            onClick={() => toggleFaq(index)}
                        >
                            <div style={{ padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-main)' }}>{faq.q}</span>
                                {openFaq === index ? <ChevronUp size={18} color="var(--primary)" /> : <ChevronDown size={18} color="var(--text-muted)" />}
                            </div>
                            {openFaq === index && (
                                <div style={{ padding: '0 1.5rem 1.5rem', color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                                    {faq.a}
                                </div>
                            )}
                        </Card>
                    ))}
                </div>
            </section>

            {/* FINAL CTA */}
            <section style={{ padding: '5rem 1.5rem', maxWidth: 'var(--container-max)', margin: '0 auto 4rem' }}>
                <Card
                    style={{
                        background: 'linear-gradient(135deg, #064E3B 0%, #0A5C36 100%)',
                        color: 'white',
                        padding: '4rem 2rem',
                        textAlign: 'center',
                        borderRadius: 'var(--radius-xl)',
                        boxShadow: 'var(--shadow-xl)'
                    }}
                >
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'white', marginBottom: '1rem' }}>
                        Ready to Start Receiving Support?
                    </h2>
                    <p style={{ fontSize: '1.1rem', opacity: 0.9, maxWidth: '600px', margin: '0 auto 2rem' }}>
                        Join Ethiopia's top creators and start accepting tips via Telebirr and local banks today.
                    </p>
                    <Button
                        variant="secondary"
                        size="lg"
                        icon={ArrowRight}
                        iconPosition="right"
                        onClick={() => navigate('/signup')}
                        style={{ background: 'white', color: 'var(--primary)', fontWeight: 800 }}
                    >
                        Create Your Free Account
                    </Button>
                </Card>
            </section>

            <Footer />
        </div>
    );
}
