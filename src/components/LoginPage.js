import React, { useState } from 'react';
import './LoginPage.css';
import Dashboard from './Dashboard';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: 'Test@test.com',
    password: 'test@1234567',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  const VALID_EMAIL = 'Test@test.com';
  const VALID_PASSWORD = 'test@1234567';

  const validate = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Enter a valid email address';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password length at least 8 characters';
    }
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name] || errors.credentials) {
      setErrors((prev) => ({ ...prev, [name]: '', credentials: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);

    if (formData.email !== VALID_EMAIL || formData.password !== VALID_PASSWORD) {
      setErrors({ credentials: 'Invalid user credentials. Please try again.' });
      return;
    }

    setLoginSuccess(true);
  };

  if (loginSuccess) {
    return (
      <Dashboard
        userEmail={formData.email}
        onLogout={() => {
          setLoginSuccess(false);
          setFormData({ email: 'Test@test.com', password: 'test@1234567' });
          setErrors({});
        }}
      />
    );
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="logo">&#128274;</div>
          <h1>Welcome Back</h1>
          <p>Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className={errors.email ? 'input-error' : ''}
              autoComplete="email"
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className={errors.password ? 'input-error' : ''}
              autoComplete="current-password"
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          <div className="form-options">
            <label className="checkbox-label">
              <input type="checkbox" /> Remember me
            </label>
            <a href="#forgot" className="forgot-link">
              Forgot password?
            </a>
          </div>

          {errors.credentials && (
            <div className="credentials-error">{errors.credentials}</div>
          )}

          <button type="submit" className="btn-primary" disabled={isLoading}>
            {isLoading ? <span className="spinner"></span> : 'Sign In'}
          </button>
        </form>

        <p className="signup-text">
          Don&apos;t have an account?{' '}
          <a href="#signup" className="signup-link">
            Create one
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
