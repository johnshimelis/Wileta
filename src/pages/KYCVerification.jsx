import React, { useState, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import NotificationDrawer from '../components/NotificationDrawer';
import {
    Upload, Camera, CheckCircle, AlertCircle,
    ArrowRight, ArrowLeft, ShieldCheck, LayoutDashboard,
    User, Settings, LogOut, TrendingUp, X, RefreshCw, Menu
} from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';
import { useNotification } from '../context/NotificationContext';

export default function KYCVerification() {
    const { user, api, logout, setUser } = useAuth();
    const { triggerNotification } = useNotification();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [files, setFiles] = useState({ idFront: null, idBack: null, liveness: null });
    const [previews, setPreviews] = useState({ idFront: null, idBack: null, liveness: null });
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Close on navigation
    React.useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [window.location.pathname]);

    // Camera state
    const [cameraActive, setCameraActive] = useState(false);
    const [cameraError, setCameraError] = useState('');
    const videoRef = useRef(null);
    const streamRef = useRef(null);

    const NavItem = ({ to, icon: Icon, label, active }) => (
        <Link to={to} className={`nav-item ${active ? 'active' : ''}`}>
            <Icon size={20} />
            <span className="nav-text">{label}</span>
        </Link>
    );

    const handleFileChange = (e, type) => {
        const file = e.target.files[0];
        if (file) {
            setFiles(prev => ({ ...prev, [type]: file }));
            setPreviews(prev => ({ ...prev, [type]: URL.createObjectURL(file) }));
            setError('');
        }
    };

    // ── Camera helpers ──────────────────────────────────────────────────
    const startCamera = useCallback(async () => {
        setCameraError('');
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } }
            });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
            setCameraActive(true);
        } catch (err) {
            setCameraError('Camera access denied. Please allow camera access or upload a photo instead.');
        }
    }, []);

    const stopCamera = useCallback(() => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(t => t.stop());
            streamRef.current = null;
        }
        setCameraActive(false);
    }, []);

    const capturePhoto = useCallback(() => {
        if (!videoRef.current) return;

        // Visual flash effect
        videoRef.current.style.opacity = '0.3';
        setTimeout(() => {
            if (videoRef.current) videoRef.current.style.opacity = '1';
        }, 150);

        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        canvas.getContext('2d').drawImage(videoRef.current, 0, 0);

        canvas.toBlob(blob => {
            if (!blob) return;
            // Store as a blob, let the FormData submission handle the filename
            const url = URL.createObjectURL(blob);
            setFiles(prev => ({ ...prev, liveness: blob }));
            setPreviews(prev => ({ ...prev, liveness: url }));
            setError('');
            stopCamera();
        }, 'image/jpeg', 0.9);
    }, [stopCamera]);

    const retakeSelfie = useCallback(() => {
        setFiles(prev => ({ ...prev, liveness: null }));
        setPreviews(prev => ({ ...prev, liveness: null }));
        startCamera();
    }, [startCamera]);

    const handleSubmit = async () => {
        if (!files.idFront || !files.idBack || !files.liveness) {
            setError('Please complete all three steps before submitting');
            return;
        }
        setUploading(true);
        setError('');
        try {
            const formData = new FormData();
            if (files.idFront) formData.append('idFront', files.idFront, files.idFront.name || 'idFront.jpg');
            if (files.idBack) formData.append('idBack', files.idBack, files.idBack.name || 'idBack.jpg');
            if (files.liveness) formData.append('liveness', files.liveness, files.liveness.name || 'selfie.jpg');

            const res = await api.post('/kyc/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            // Instantly update global context so Dashboard reflects 'pending'
            if (res.data && res.data.user) {
                setUser(res.data.user);
            }

            triggerNotification({
                title: 'Verification Submitted',
                message: 'Your documents are now under review.',
                type: 'success'
            });

            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to submit KYC. Please try again.');
            triggerNotification({
                title: 'Verification Failed',
                message: err.response?.data?.error || 'Failed to submit KYC. Please try again.',
                type: 'error'
            });
        } finally {
            setUploading(false);
        }
    };

    const StepIndicator = () => (
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
            {[1, 2, 3].map(s => (
                <div key={s} style={{
                    flex: 1, height: '5px', borderRadius: '3px',
                    background: step >= s ? 'var(--primary)' : 'var(--border-color)',
                    transition: 'all 0.3s ease'
                }} />
            ))}
        </div>
    );

    const UploadBox = ({ previewSrc, inputId, fieldName, label }) => (
        <div
            onClick={() => document.getElementById(inputId).click()}
            style={{
                height: '220px', border: `2px dashed ${previewSrc ? 'var(--primary)' : 'var(--border-color)'}`,
                borderRadius: '1rem', display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                overflow: 'hidden', background: previewSrc ? '#000' : 'var(--bg-color)', transition: 'all 0.2s'
            }}
        >
            {previewSrc ? (
                <img src={previewSrc} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            ) : (
                <>
                    <Upload size={36} color="var(--text-muted)" style={{ marginBottom: '0.75rem' }} />
                    <p style={{ fontWeight: 600, color: 'var(--text-main)' }}>{label}</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>PNG, JPG up to 10MB</p>
                </>
            )}
            <input type="file" id={inputId} accept="image/*" hidden onChange={(e) => handleFileChange(e, fieldName)} />
        </div>
    );

    return (
        <div className="app-layout">
            <div className="mobile-header-container mobile-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <img src="/logo.jpg" alt="Wileta Logo" style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} />
                    <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>Wileta</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <NotificationDrawer />
                    <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', cursor: 'pointer', display: 'flex' }}>
                        {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </div>

            {isMobileMenuOpen && (
                <div className="mobile-overlay" onClick={() => setIsMobileMenuOpen(false)}></div>
            )}

            <Sidebar isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />

            <main className="main-content" style={{
                background: 'radial-gradient(circle at top right, rgba(15, 157, 88, 0.05), transparent 500px), radial-gradient(circle at bottom left, rgba(66, 133, 244, 0.05), transparent 500px), var(--bg-color)',
                minHeight: '100vh',
                position: 'relative'
            }}>
                <div style={{ maxWidth: '620px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
                    <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
                        <div className="auth-icon" style={{ width: '60px', height: '60px', margin: '0 auto 1.25rem', background: 'var(--primary-light)', color: 'var(--primary)', boxShadow: '0 10px 25px -5px rgba(15, 157, 88, 0.3)' }}>
                            <ShieldCheck size={28} />
                        </div>
                        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.03em' }}>Identity Verification</h1>
                        <p style={{ color: 'var(--text-muted)', marginTop: '0.4rem' }}>Secure your account and enable Telebirr payouts</p>
                    </header>

                    <StepIndicator />

                    {error && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(239,68,68,0.08)', border: '1px solid var(--danger)', color: 'var(--danger)', borderRadius: '0.875rem', padding: '0.875rem 1.25rem', marginBottom: '1.5rem', fontWeight: 500 }}>
                            <AlertCircle size={18} /> {error}
                        </div>
                    )}

                    <div className="dashboard-card" style={{
                        background: 'rgba(255, 255, 255, 0.7)',
                        backdropFilter: 'blur(24px)',
                        WebkitBackdropFilter: 'blur(24px)',
                        border: '1px solid rgba(226, 232, 240, 0.5)',
                        boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.06), 0 0 0 1px rgba(226, 232, 240, 0.5)'
                    }}>
                        {/* STEP 1 - ID Front */}
                        {step === 1 && (
                            <div>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.4rem' }}>Step 1: ID Front</h3>
                                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Upload a clear photo of the front of your national ID or passport.</p>
                                <UploadBox previewSrc={previews.idFront} inputId="idFront" fieldName="idFront" label="Click to upload ID Front" />
                                {previews.idFront && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.75rem', color: 'var(--primary)', fontSize: '0.875rem', fontWeight: 600 }}>
                                        <CheckCircle size={14} /> Image uploaded
                                    </div>
                                )}
                                <button className="btn-primary" style={{ marginTop: '1.5rem' }} onClick={() => previews.idFront && setStep(2)} disabled={!previews.idFront}>
                                    Next Step <ArrowRight size={18} />
                                </button>
                            </div>
                        )}

                        {/* STEP 2 - ID Back */}
                        {step === 2 && (
                            <div>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.4rem' }}>Step 2: ID Back</h3>
                                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Upload a clear photo of the back side of your identity document.</p>
                                <UploadBox previewSrc={previews.idBack} inputId="idBack" fieldName="idBack" label="Click to upload ID Back" />
                                {previews.idBack && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.75rem', color: 'var(--primary)', fontSize: '0.875rem', fontWeight: 600 }}>
                                        <CheckCircle size={14} /> Image uploaded
                                    </div>
                                )}
                                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                                    <button className="btn-primary" style={{ background: 'var(--card-bg)', color: 'var(--text-main)', border: '1px solid var(--border-color)', boxShadow: 'none' }} onClick={() => setStep(1)}>
                                        <ArrowLeft size={18} /> Back
                                    </button>
                                    <button className="btn-primary" onClick={() => previews.idBack && setStep(3)} disabled={!previews.idBack}>
                                        Next Step <ArrowRight size={18} />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* STEP 3 - Live Selfie */}
                        {step === 3 && (
                            <div>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.4rem' }}>Step 3: Selfie Verification</h3>
                                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Take a live selfie holding your ID to verify your identity.</p>

                                {/* Camera active */}
                                <div style={{ position: 'relative', borderRadius: '50%', overflow: 'hidden', background: '#000', marginBottom: '2rem', width: '260px', height: '260px', margin: '0 auto 1.5rem', border: `4px solid ${previews.liveness ? 'var(--success)' : 'var(--primary-light)'}`, boxShadow: '0 10px 25px rgba(0,0,0,0.1)', display: cameraActive || previews.liveness ? 'block' : 'none' }}>
                                    <video
                                        ref={videoRef}
                                        autoPlay
                                        playsInline
                                        muted
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: previews.liveness ? 'none' : 'block' }}
                                    />
                                    {previews.liveness && (
                                        <img src={previews.liveness} alt="Selfie" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    )}
                                    {cameraActive && !previews.liveness && (
                                        <>
                                            <button onClick={stopCamera} style={{ position: 'absolute', top: '15px', right: '15px', background: 'rgba(0,0,0,0.5)', border: 'none', color: 'white', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
                                                <X size={16} />
                                            </button>
                                            <div style={{ position: 'absolute', bottom: '1.5rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '0.75rem', zIndex: 10 }}>
                                                <button
                                                    onClick={capturePhoto}
                                                    style={{ background: 'var(--primary)', border: '4px solid rgba(255,255,255,0.8)', color: '#fff', width: '56px', height: '56px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.2)', transition: 'transform 0.2s' }}
                                                    onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
                                                    onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                                >
                                                    <Camera size={24} />
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* Not camera active & no preview: show start UI */}
                                {!cameraActive && !previews.liveness && (
                                    <>
                                        <div style={{ height: '220px', border: '2px dashed var(--border-color)', borderRadius: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-color)', gap: '0.5rem', marginBottom: '1.5rem' }}>
                                            <Camera size={42} color="var(--text-muted)" />
                                            <p style={{ fontWeight: 600, color: 'var(--text-main)' }}>Live selfie required</p>
                                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Use your device camera to take a secure photo</p>
                                        </div>

                                        {cameraError && (
                                            <div style={{ fontSize: '0.85rem', color: 'var(--danger)', marginBottom: '0.75rem', fontWeight: 500 }}>{cameraError}</div>
                                        )}

                                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}>
                                            <button
                                                onClick={startCamera}
                                                className="btn-primary"
                                                style={{ minWidth: '200px' }}
                                            >
                                                <Camera size={18} /> Open Camera
                                            </button>
                                        </div>
                                    </>
                                )}

                                {/* Retake buttons when preview exists */}
                                {previews.liveness && (
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary)', fontSize: '0.875rem', fontWeight: 600 }}>
                                            <CheckCircle size={14} /> Selfie captured successfully
                                        </div>
                                        <button
                                            onClick={retakeSelfie}
                                            className="btn-primary"
                                            style={{ minWidth: '200px', background: 'var(--card-bg)', color: 'var(--text-main)', border: '1px solid var(--border-color)', boxShadow: 'none' }}
                                        >
                                            <RefreshCw size={18} /> Retake Selfie
                                        </button>
                                    </div>
                                )}

                                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                    <button className="btn-primary" style={{ flex: 1, background: 'var(--card-bg)', color: 'var(--text-main)', border: '1px solid var(--border-color)', boxShadow: 'none' }} onClick={() => { stopCamera(); setStep(2); }}>
                                        <ArrowLeft size={18} /> Back
                                    </button>
                                    <button className="btn-primary" style={{ flex: 2 }} onClick={handleSubmit} disabled={uploading || !previews.liveness}>
                                        {uploading ? <span className="spinner"></span> : <><CheckCircle size={18} /> Complete Verification</>}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
