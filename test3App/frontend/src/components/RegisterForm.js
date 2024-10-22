import React, { useState } from 'react';
import './RegisterForm.css';
import axios from 'axios';

function RegisterForm() {
  const [activeTab, setActiveTab] = useState('register');
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    setFormData({ email: '', password: '' });
    setError('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const url = activeTab === 'register' ? '/api/auth/register' : '/api/auth/login';

    try {
      const response = await axios.post(`http://localhost:8000${url}`, formData, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.status === 201 || response.status === 200) {
        alert(activeTab === 'register' ? 'Registration successful!' : 'Login successful!');
        // Redirect to dashboard or another page
      }
    } catch (error) {
      if (error.response && error.response.data.error) {
        setError(error.response.data.error);
      } else {
        setError('An error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="register-login-container">
      <h1>User Registration and Secure Login</h1>
      <div className="tabs">
        <button className={activeTab === 'register' ? 'active' : ''} onClick={() => handleTabSwitch('register')}>
          Register
        </button>
        <button className={activeTab === 'login' ? 'active' : ''} onClick={() => handleTabSwitch('login')}>
          Login
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />
        </div>
        <button type="submit" className="primary-btn">
          {activeTab === 'register' ? 'Register' : 'Login'}
        </button>
        {activeTab === 'login' && <a href="#" className="forgot-password">Forgot Password?</a>}
      </form>
      {error && <div className="error-message">{error}</div>}
      <footer>
        <a href="#">Terms of Service</a>
        <a href="#">Privacy Policy</a>
      </footer>
    </div>
  );
}

export default RegisterForm;
