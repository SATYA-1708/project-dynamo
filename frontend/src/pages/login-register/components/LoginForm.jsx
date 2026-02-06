import React, { useState } from 'react';
import axios from 'axios';
import Icon from '../../../components/AppIcon';

const LoginForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Mock credentials for demonstration - REMOVE THIS AFTER INTEGRATION
  // const mockCredentials = {
  //   email: 'john.doe@company.com',
  //   password: 'TaskFlow2024!'
  // };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_RENDER_BACKEND_URL}/api/users/login`, {
        email: formData.email,
        password: formData.password
      });
      console.log('Login successful:', response.data);
      localStorage.setItem('userInfo', JSON.stringify(response.data.user)); // Store user info
      onSuccess(); // Call the success handler passed from parent component
    } catch (error) {
      console.error('Login error:', error.response ? error.response.data : error.message);
      setErrors({ general: error.response ? error.response.data.msg : 'Login failed' });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    setShowForgotPassword(true);
  };

  const handleForgotPasswordSubmit = (e) => {
    e.preventDefault();
    // Simulate password reset
    alert('Password reset link sent to your email!');
    setShowForgotPassword(false);
  };

  if (showForgotPassword) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <Icon name="Mail" size={48} color="var(--color-primary)" className="mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-text-primary mb-2">Reset your password</h3>
          <p className="text-text-secondary">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
          <div>
            <label htmlFor="resetEmail" className="block text-sm font-medium text-text-primary mb-2">
              Email address
            </label>
            <input
              type="email"
              id="resetEmail"
              name="resetEmail"
              required
              className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
              placeholder="Enter your email"
            />
          </div>

          <div className="space-y-3">
            <button
              type="submit"
              className="w-full bg-primary text-white py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors duration-200 font-medium"
            >
              Send Reset Link
            </button>
            
            <button
              type="button"
              onClick={() => setShowForgotPassword(false)}
              className="w-full text-text-secondary hover:text-text-primary transition-colors duration-200"
            >
              Back to Sign In
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* General Error */}
      {errors.general && (
        <div className="p-4 bg-error-50 border border-error-100 rounded-lg">
          <div className="flex items-center space-x-2">
            <Icon name="AlertCircle" size={16} color="var(--color-error)" />
            <p className="text-sm text-error">{errors.general}</p>
          </div>
        </div>
      )}

      {/* Email Field */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
          Email address
        </label>
        <div className="relative">
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 pl-12 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ${
              errors.email ? 'border-error' : 'border-border'
            }`}
            placeholder="Enter your email"
          />
          <Icon 
            name="Mail" 
            size={20} 
            color={errors.email ? 'var(--color-error)' : 'var(--color-secondary-400)'} 
            className="absolute left-4 top-1/2 transform -translate-y-1/2"
          />
        </div>
        {errors.email && (
          <p className="mt-1 text-sm text-error flex items-center space-x-1">
            <Icon name="AlertCircle" size={14} />
            <span>{errors.email}</span>
          </p>
        )}
      </div>

      {/* Password Field */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-text-primary mb-2">
          Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 pl-12 pr-12 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ${
              errors.password ? 'border-error' : 'border-border'
            }`}
            placeholder="Enter your password"
          />
          <Icon 
            name="Lock" 
            size={20} 
            color={errors.password ? 'var(--color-error)' : 'var(--color-secondary-400)'} 
            className="absolute left-4 top-1/2 transform -translate-y-1/2"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-secondary-400 hover:text-text-primary transition-colors duration-200"
          >
            <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={20} />
          </button>
        </div>
        {errors.password && (
          <p className="mt-1 text-sm text-error flex items-center space-x-1">
            <Icon name="AlertCircle" size={14} />
            <span>{errors.password}</span>
          </p>
        )}
      </div>

      {/* Remember Me & Forgot Password */}
      <div className="flex items-center justify-between">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            name="rememberMe"
            checked={formData.rememberMe}
            onChange={handleInputChange}
            className="w-4 h-4 text-primary border-border rounded focus:ring-primary-500"
          />
          <span className="text-sm text-text-secondary">Remember me</span>
        </label>
        
        <button
          type="button"
          onClick={handleForgotPassword}
          className="text-sm text-primary hover:text-primary-700 transition-colors duration-200"
        >
          Forgot password?
        </button>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full flex flex-row justify-center items-center gap-4 bg-primary text-white py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors duration-200 font-medium"
        disabled={loading}
      >
        {loading ? (
          <Icon name="Loader" size={20} className="animate-spin" />
        ) : (
          <Icon name="LogIn" size={20} />
        )}
        <span>{loading ? 'Signing In...' : 'Sign In'}</span>
      </button>
    </form>
  );
};

export default LoginForm;