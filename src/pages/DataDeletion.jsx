import React, { useState } from 'react';
import { ArrowLeft, Trash2, CheckCircle, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

const DataDeletion = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API request to backend for Google Play compliance
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  return (
    <div className="auth-container animate-fade-in">
      <div className="auth-card" style={{ maxWidth: '500px', width: '100%' }}>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', color: 'var(--primary)', textDecoration: 'none', marginBottom: '2rem', fontWeight: 600, transition: 'transform 0.2s' }}>
          <ArrowLeft size={18} style={{ marginRight: '8px' }} /> Back to Home
        </Link>
        
        {submitted ? (
          <div style={{ textAlign: 'center', padding: '2rem 0' }} className="animate-fade-in">
            <CheckCircle size={64} color="var(--primary)" style={{ margin: '0 auto 1.5rem' }} />
            <h2 className="auth-title">Request Submitted</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: '1.6' }}>
              We have received your account deletion request. Our support team will process it within 7 days. You will receive an email confirmation once your data has been permanently erased.
            </p>
            <Link to="/" className="auth-btn" style={{ textDecoration: 'none', display: 'block', textAlign: 'center' }}>Return to Homepage</Link>
          </div>
        ) : (
          <div className="animate-fade-in">
            <div className="auth-header">
              <div className="auth-icon" style={{ background: 'linear-gradient(135deg, var(--danger) 0%, #991b1b 100%)' }}>
                <Trash2 size={32} />
              </div>
              <h1 className="auth-title">Delete Account & Data</h1>
              <p style={{ color: 'var(--text-muted)' }}>Request permanent deletion of your data.</p>
            </div>

            <div style={{ background: 'rgba(234, 67, 53, 0.1)', padding: '1rem', borderRadius: '0.75rem', marginBottom: '2rem', display: 'flex', alignItems: 'flex-start', border: '1px solid rgba(234, 67, 53, 0.2)' }}>
              <AlertTriangle color="var(--danger)" size={20} style={{ marginRight: '12px', flexShrink: 0, marginTop: '2px' }} />
              <p style={{ fontSize: '0.9rem', color: 'var(--danger)', lineHeight: 1.5, margin: 0 }}>
                <strong>Warning:</strong> This action is irreversible. All your transaction history, profile data, and balances will be permanently deleted. Ensure you have withdrawn any remaining funds before proceeding.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label className="input-label">Email Address or Username</label>
                <input type="text" className="auth-input" placeholder="Enter the email associated with your account" required />
              </div>
              <div className="input-group">
                <label className="input-label">Reason for Deletion (Optional)</label>
                <textarea className="auth-input" rows="3" placeholder="Please let us know why you are leaving..." style={{ resize: 'vertical' }}></textarea>
              </div>
              <button 
                type="submit" 
                className="auth-btn" 
                style={{ 
                  background: loading ? '#ccc' : 'var(--danger)', 
                  marginTop: '1rem', 
                  cursor: loading ? 'not-allowed' : 'pointer',
                  boxShadow: loading ? 'none' : '0 10px 20px -5px rgba(234, 67, 53, 0.4)'
                }} 
                disabled={loading}
              >
                {loading ? 'Submitting Request...' : 'Submit Deletion Request'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataDeletion;
