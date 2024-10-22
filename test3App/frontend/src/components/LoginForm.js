import React, { useState } from 'react';
import './LoginForm.css';
import axios from 'axios';

const LoginForm = () => {
  const [activeTab, setActiveTab] = useState('register');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setEmail('');
    setPassword('');
    setError('');
    setSuccess('');
  };

  const handleRegister = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/auth/register', {
        email,
        password,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setSuccess('Registration successful!');
    } catch (error) {
      setError(error.response?.data?.error || 'Registration failed');
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/auth/login', {
        email,
        password,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setSuccess('Login successful!');
      // Redirect to dashboard
      window.location.href = '/dashboard';
    } catch (error) {
      setError(error.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="login-form">
      <h1>User Registration and Secure Login</h1>
      <div className="nav-tabs">
        <button
          className={activeTab === 'register' ? 'active' : ''}
          onClick={() => handleTabClick('register')}
        >
          Register
        </button>
        <button
          className={activeTab === 'login' ? 'active' : ''}
          onClick={() => handleTabClick('login')}
        >
          Login
        </button>
      </div>
      <div className="form-content">
        {activeTab === 'register' && (
          <div className="register-form">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleRegister}>Register</button>
          </div>
        )}
        {activeTab === 'login' && (
          <div className="login-form">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLogin}>Login</button>
            <a href="/forgot-password">Forgot Password?</a>
          </div>
        )}
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}
      </div>
      <footer>
        <a href="/terms-of-service">Terms of Service</a>
        <a href="/privacy-policy">Privacy Policy</a>
      </footer>
    </div>
  );
};

export default LoginForm;
