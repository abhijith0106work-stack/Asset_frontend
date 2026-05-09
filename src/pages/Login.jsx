import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

        *, *::before, *::after {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        .login-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Sora', sans-serif;
          background: #060912;
          position: relative;
          overflow: hidden;
        }

        /* Animated background orbs */
        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.18;
          animation: drift 12s ease-in-out infinite;
        }
        .orb-1 {
          width: 500px; height: 500px;
          background: radial-gradient(circle, #6366f1, #312e81);
          top: -120px; left: -100px;
          animation-delay: 0s;
        }
        .orb-2 {
          width: 400px; height: 400px;
          background: radial-gradient(circle, #06b6d4, #0e7490);
          bottom: -80px; right: -80px;
          animation-delay: -4s;
        }
        .orb-3 {
          width: 300px; height: 300px;
          background: radial-gradient(circle, #8b5cf6, #4c1d95);
          bottom: 30%; left: 10%;
          animation-delay: -8s;
        }

        @keyframes drift {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -20px) scale(1.05); }
          66% { transform: translate(-20px, 30px) scale(0.95); }
        }

        /* Grid overlay */
        .grid-overlay {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(99, 102, 241, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99, 102, 241, 0.04) 1px, transparent 1px);
          background-size: 50px 50px;
          pointer-events: none;
        }

        /* Card */
        .login-card {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 420px;
          margin: 1rem;
          background: rgba(255, 255, 255, 0.035);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 24px;
          padding: 2.75rem 2.5rem;
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          box-shadow:
            0 0 0 1px rgba(99, 102, 241, 0.1),
            0 32px 80px rgba(0, 0, 0, 0.5),
            inset 0 1px 0 rgba(255,255,255,0.06);
          animation: cardIn 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        @keyframes cardIn {
          from { opacity: 0; transform: translateY(32px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* Top accent line */
        .card-accent {
          position: absolute;
          top: 0; left: 50%; transform: translateX(-50%);
          width: 60%; height: 2px;
          background: linear-gradient(90deg, transparent, #6366f1, #06b6d4, transparent);
          border-radius: 0 0 4px 4px;
        }

        /* Logo section */
        .logo-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 2rem;
          animation: fadeUp 0.6s 0.15s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .logo-wrapper {
          width: 80px;
          height: 80px;
          border-radius: 20px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.25rem;
          box-shadow: 0 8px 32px rgba(99, 102, 241, 0.2), inset 0 1px 0 rgba(255,255,255,0.08);
          position: relative;
          overflow: hidden;
        }

        .logo-wrapper::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(99,102,241,0.15), rgba(6,182,212,0.1));
        }

        .logo-wrapper img {
          width: 52px;
          height: 52px;
          object-fit: contain;
          position: relative;
          z-index: 1;
          filter: drop-shadow(0 2px 8px rgba(99,102,241,0.4));
        }

        .logo-fallback {
          width: 52px;
          height: 52px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.75rem;
          font-weight: 700;
          background: linear-gradient(135deg, #6366f1, #06b6d4);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: -1px;
          position: relative;
          z-index: 1;
        }

        .brand-name {
          font-size: 1.35rem;
          font-weight: 700;
          letter-spacing: -0.4px;
          background: linear-gradient(135deg, #e2e8f0 0%, #94a3b8 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .brand-tagline {
          font-size: 0.72rem;
          color: rgba(148, 163, 184, 0.6);
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin-top: 0.2rem;
          font-weight: 400;
        }

        /* Heading */
        .login-heading {
          text-align: center;
          margin-bottom: 1.75rem;
          animation: fadeUp 0.6s 0.22s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .login-heading h2 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #f1f5f9;
          letter-spacing: -0.5px;
        }

        .login-heading p {
          font-size: 0.82rem;
          color: rgba(148, 163, 184, 0.65);
          margin-top: 0.3rem;
          font-weight: 300;
        }

        /* Divider */
        .divider {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
          animation: fadeUp 0.6s 0.25s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .divider-line {
          flex: 1;
          height: 1px;
          background: rgba(255,255,255,0.07);
        }
        .divider-text {
          font-size: 0.7rem;
          color: rgba(148, 163, 184, 0.4);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          font-family: 'JetBrains Mono', monospace;
        }

        /* Error */
        .error-box {
          background: rgba(239, 68, 68, 0.08);
          border: 1px solid rgba(239, 68, 68, 0.25);
          border-radius: 10px;
          padding: 0.75rem 1rem;
          margin-bottom: 1.25rem;
          display: flex;
          align-items: center;
          gap: 0.6rem;
          animation: shake 0.4s ease;
        }
        .error-icon { font-size: 0.9rem; }
        .error-text {
          font-size: 0.8rem;
          color: #fca5a5;
          font-weight: 400;
          line-height: 1.4;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-6px); }
          40% { transform: translateX(6px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }

        /* Form */
        .form-fields {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          animation: fadeUp 0.6s 0.3s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .field-group {
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
        }

        .field-label {
          font-size: 0.75rem;
          font-weight: 500;
          color: rgba(148, 163, 184, 0.8);
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .field-wrap {
          position: relative;
        }

        .field-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(148, 163, 184, 0.35);
          font-size: 1rem;
          pointer-events: none;
          transition: color 0.2s;
        }

        .field-input {
          width: 100%;
          padding: 0.85rem 1rem 0.85rem 2.75rem;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          color: #e2e8f0;
          font-size: 0.88rem;
          font-family: 'Sora', sans-serif;
          font-weight: 400;
          outline: none;
          transition: all 0.2s ease;
          letter-spacing: 0.01em;
        }

        .field-input::placeholder {
          color: rgba(148, 163, 184, 0.25);
        }

        .field-input:focus {
          border-color: rgba(99, 102, 241, 0.5);
          background: rgba(99, 102, 241, 0.05);
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }

        .field-input:focus + .field-focus-ring {
          opacity: 1;
        }

        .field-wrap:focus-within .field-icon {
          color: rgba(99, 102, 241, 0.7);
        }

        /* Password toggle */
        .pw-toggle {
          position: absolute;
          right: 1rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: rgba(148, 163, 184, 0.35);
          cursor: pointer;
          padding: 0;
          font-size: 1rem;
          transition: color 0.2s;
          display: flex;
          align-items: center;
        }
        .pw-toggle:hover { color: rgba(148, 163, 184, 0.7); }

        /* Forgot */
        .forgot-row {
          display: flex;
          justify-content: flex-end;
          margin-top: -0.25rem;
        }
        .forgot-link {
          font-size: 0.75rem;
          color: rgba(99, 102, 241, 0.7);
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s;
        }
        .forgot-link:hover { color: #818cf8; }

        /* Submit button */
        .submit-btn {
          width: 100%;
          padding: 0.9rem;
          border: none;
          border-radius: 12px;
          font-family: 'Sora', sans-serif;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          letter-spacing: 0.02em;
          margin-top: 0.5rem;
          background: linear-gradient(135deg, #6366f1 0%, #4f46e5 50%, #06b6d4 100%);
          color: #fff;
          box-shadow: 0 4px 24px rgba(99, 102, 241, 0.35), 0 1px 0 rgba(255,255,255,0.1) inset;
          transition: all 0.25s ease;
          animation: fadeUp 0.6s 0.38s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .submit-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.12), transparent);
          opacity: 0;
          transition: opacity 0.2s;
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 8px 32px rgba(99, 102, 241, 0.45);
        }
        .submit-btn:hover::before { opacity: 1; }
        .submit-btn:active:not(:disabled) { transform: translateY(0); }
        .submit-btn:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        /* Spinner */
        .btn-content {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
        }
        .spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Footer */
        .login-footer {
          text-align: center;
          margin-top: 1.5rem;
          font-size: 0.75rem;
          color: rgba(148, 163, 184, 0.4);
          animation: fadeUp 0.6s 0.44s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .login-footer a {
          color: rgba(99, 102, 241, 0.75);
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s;
        }
        .login-footer a:hover { color: #818cf8; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="login-root">
        {/* Background */}
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div className="grid-overlay" />

        {/* Card */}
        <div className="login-card">
          <div className="card-accent" />

          {/* Logo */}
          <div className="logo-section">
            <div className="logo-wrapper">
              <img
                src="../Assets/logo.png"
                alt="Company Logo"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              {/* Fallback if logo.png not found */}
              <div className="logo-fallback" style={{ display: 'none' }}>A</div>
            </div>
            <div className="brand-name">Marysadan</div>
            <div className="brand-tagline">Secure Access Portal</div>
          </div>

          <div className="divider">
            <div className="divider-line" />
            <span className="divider-text">Sign in to continue</span>
            <div className="divider-line" />
          </div>

          {/* Error */}
          {error && (
            <div className="error-box">
              <span className="error-icon">⚠</span>
              <span className="error-text">{error}</span>
            </div>
          )}

          {/* Form */}
          <div className="form-fields">
            <div className="field-group">
              <label className="field-label">Email Address</label>
              <div className="field-wrap">
                <span className="field-icon">✉</span>
                <input
                  type="email"
                  className="field-input"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="field-group">
              <label className="field-label">Password</label>
              <div className="field-wrap">
                <span className="field-icon">🔒</span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="field-input"
                  placeholder="••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="pw-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? '🙈' : '👁'}
                </button>
              </div>
            </div>

            {/* <div className="forgot-row">
              <a href="/forgot-password" className="forgot-link">Forgot password?</a>
            </div> */}

            <button
              className="submit-btn"
              onClick={handleLogin}
              disabled={loading}
            >
              <span className="btn-content">
                {loading && <span className="spinner" />}
                {loading ? 'Signing in…' : 'Sign In'}
              </span>
            </button>
          </div>

          <div className="login-footer">
            
            {/* <a href="/register">Create one</a> */}
            <br /><br />
            © 2025 Marysadan · <a href="/privacy">Privacy</a> · <a href="/terms">Terms</a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
