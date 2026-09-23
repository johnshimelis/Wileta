import React from 'react';
import { ArrowLeft, ShieldCheck, Database, Lock, Eye, Mail, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const PrivacyPolicy = () => {
  const { t } = useLanguage();

  return (
    <div className="auth-container animate-fade-in" style={{ padding: '4rem 1rem' }}>
      <div className="dashboard-card" style={{ maxWidth: '850px', width: '100%', margin: '0 auto', padding: '3rem', position: 'relative', overflow: 'hidden' }}>
        
        {/* Decorative background blur */}
        <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '300px', height: '300px', background: 'var(--primary)', filter: 'blur(100px)', opacity: '0.1', zIndex: 0, borderRadius: '50%' }}></div>
        <div style={{ position: 'absolute', bottom: '-100px', left: '-100px', width: '300px', height: '300px', background: 'var(--secondary)', filter: 'blur(100px)', opacity: '0.1', zIndex: 0, borderRadius: '50%' }}></div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', color: 'var(--text-muted)', textDecoration: 'none', marginBottom: '2.5rem', fontWeight: 700, fontSize: '0.9rem', transition: 'all 0.2s', padding: '0.5rem 1rem', background: 'var(--bg-color)', borderRadius: '2rem', border: '1px solid var(--border-color)' }} className="hover-scale">
            <ArrowLeft size={16} style={{ marginRight: '8px' }} /> {t('returnToHomeBtn', 'Return to Home')}
          </Link>
          
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div style={{ width: '80px', height: '80px', background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', boxShadow: '0 10px 25px -5px rgba(10, 92, 54, 0.2)' }}>
              <ShieldCheck size={40} />
            </div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-main)', letterSpacing: '-0.03em', marginBottom: '0.5rem' }}>{t('privacyPolicyTitle', 'Privacy Policy')}</h1>
            <p style={{ color: 'var(--primary)', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '0.85rem' }}>{t('privacyUpdatedDate', 'GurshaPay • Last updated: June 30, 2026')}</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Section 1 */}
            <div className="policy-section" style={{ background: 'var(--bg-color)', padding: '2rem', borderRadius: '1.5rem', border: '1px solid var(--border-color)', transition: 'transform 0.2s', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Database size={20} />
                </div>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>{t('infoWeCollectTitle', '1. Information We Collect')}</h2>
              </div>
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '1rem', margin: 0, paddingLeft: '3.5rem' }}>
                {t('infoWeCollectText', 'We collect personal information such as your name, email address, phone number, and financial transaction data when you use GurshaPay to tip creators or receive tips. We also automatically collect device information, IP addresses, and app usage data to improve our services.')}
              </p>
            </div>

            {/* Section 2 */}
            <div className="policy-section" style={{ background: 'var(--bg-color)', padding: '2rem', borderRadius: '1.5rem', border: '1px solid var(--border-color)', transition: 'transform 0.2s', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Eye size={20} />
                </div>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>{t('howWeUseDataTitle', '2. How We Use Your Data')}</h2>
              </div>
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '1rem', margin: 0, paddingLeft: '3.5rem' }}>
                {t('howWeUseDataText', 'We use your data to facilitate Telebirr transactions, verify your identity (KYC compliance), prevent fraud, and provide customer support. Your public tipping activity may be visible on the platform according to your privacy settings.')}
              </p>
            </div>

            {/* Section 3 */}
            <div className="policy-section" style={{ background: 'var(--bg-color)', padding: '2rem', borderRadius: '1.5rem', border: '1px solid var(--border-color)', transition: 'transform 0.2s', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Lock size={20} />
                </div>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>{t('dataSharingTitle', '3. Data Sharing & Security')}</h2>
              </div>
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '1rem', margin: 0, paddingLeft: '3.5rem' }}>
                {t('dataSharingText', 'We share necessary transaction data with our payment partners (Telebirr) to process your payments. We use industry-standard encryption to protect your data. We strictly do not sell your personal data to third parties.')}
              </p>
            </div>

            {/* Section 4 */}
            <div className="policy-section" style={{ background: 'var(--bg-color)', padding: '2rem', borderRadius: '1.5rem', border: '1px solid var(--border-color)', transition: 'transform 0.2s', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FileText size={20} />
                </div>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>{t('yourRightsTitle', '4. Your Rights & Data Protection')}</h2>
              </div>
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '1rem', margin: 0, paddingLeft: '3.5rem' }}>
                {t('yourRightsText', 'You retain full rights to inspect, update, or permanently delete your account data at any time via your account settings or our official Data Deletion portal.')}
              </p>
            </div>
            
            {/* Contact */}
            <div style={{ marginTop: '2rem', padding: '2rem', background: 'linear-gradient(135deg, rgba(10, 92, 54, 0.05) 0%, rgba(212, 175, 55, 0.05) 100%)', borderRadius: '1.5rem', textAlign: 'center', border: '1px dashed var(--primary)' }}>
              <Mail size={24} color="var(--primary)" style={{ margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>{t('privacyContactTitle', '5. Contact & Inquiries')}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{t('privacyContactText', 'If you have any questions or concerns regarding our privacy practices, our legal team is available 24/7 at support@gurshapay.com or via our in-app support center.')}</p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
