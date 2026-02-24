import React, { useState } from 'react';
import { signIn } from '../../firebase';
import './LoginScreen.css';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Client-side validation
    if (!email.trim() || !password.trim()) {
      setError('Please enter your email and password.');
      return;
    }

    setLoading(true);
    try {
      await signIn(email, password);
      // Auth state change handled by App.js
    } catch (err) {
      if (err.code === 'auth/network-request-failed' || err.message === 'offline') {
        setError('No internet connection. Please check your network and try again.');
      } else {
        setError('Wrong email or password. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-screen">
      <div className="login-card">
        <div className="login-logo">
          <span className="login-logo-eye">👁</span>
          <h1 className="login-title">EyEagle</h1>
          <p className="login-subtitle">Bathroom Safety Audit</p>
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
          <label className="login-label" htmlFor="email">Email</label>
          <input
            id="email"
            className="login-input"
            type="email"
            autoComplete="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            disabled={loading}
            placeholder="you@example.com"
          />
          <label className="login-label" htmlFor="password">Password</label>
          <input
            id="password"
            className="login-input"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            disabled={loading}
            placeholder="••••••••"
          />
          {error && <p className="login-error">{error}</p>}
          <button className="login-btn" type="submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
