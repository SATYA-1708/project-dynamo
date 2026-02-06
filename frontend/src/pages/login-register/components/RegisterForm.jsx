import { useState } from 'react';
import axios from 'axios';
import Icon from '../../../components/AppIcon';

const RegisterForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: []
  });
  const [loading, setLoading] = useState(false);

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

    // Check password strength in real-time
    if (name === 'password') {
      checkPasswordStrength(value);
    }
  };

  const checkPasswordStrength = (password) => {
    const feedback = [];
    let score = 0;

    if (password.length >= 8) {
      score += 1;
    } else {
      feedback.push('At least 8 characters');
    }

    if (/[A-Z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('One uppercase letter');
    }

    if (/[a-z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('One lowercase letter');
    }

    if (/\d/.test(password)) {
      score += 1;
    } else {
      feedback.push('One number');
    }

    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      score += 1;
    } else {
      feedback.push('One special character');
    }

    setPasswordStrength({ score, feedback });
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength.score) {
      case 0:
      case 1: return 'bg-error';
      case 2:
      case 3: return 'bg-warning';
      case 4:
      case 5: return 'bg-success';
      default: return 'bg-secondary-300';
    }
  };

  const getPasswordStrengthText = () => {
    switch (passwordStrength.score) {
      case 0:
      case 1: return 'Weak';
      case 2:
      case 3: return 'Medium';
      case 4:
      case 5: return 'Strong';
      default: return '';
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (passwordStrength.score < 3) {
      newErrors.password = 'Password is too weak';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
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
      const response = await axios.post(`${import.meta.env.VITE_RENDER_BACKEND_URL}/api/users/register`, {
        username: formData.firstName + ' ' + formData.lastName, // Combine first and last name for username
        email: formData.email,
        password: formData.password
      });
      console.log('Registration successful:', response.data);
      onSuccess(); // Call the success handler passed from parent component
    } catch (error) {
      console.error('Registration error:', error.response ? error.response.data : error.message);
      setErrors({ general: error.response ? error.response.data.msg : 'Registration failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.general && (
        <p className="mt-1 text-sm text-error flex items-center space-x-1">
          <Icon name="AlertCircle" size={14} />
          <span>{errors.general}</span>
        </p>
      )}

      {/* Name Fields */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-text-primary mb-2">
            First name
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ${
              errors.firstName ? 'border-error' : 'border-border'
            }`}
            placeholder="John"
          />
          {errors.firstName && (
            <p className="mt-1 text-sm text-error flex items-center space-x-1">
              <Icon name="AlertCircle" size={14} />
              <span>{errors.firstName}</span>
            </p>
          )}
        </div>

        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-text-primary mb-2">
            Last name
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ${
              errors.lastName ? 'border-error' : 'border-border'
            }`}
            placeholder="Doe"
          />
          {errors.lastName && (
            <p className="mt-1 text-sm text-error flex items-center space-x-1">
              <Icon name="AlertCircle" size={14} />
              <span>{errors.lastName}</span>
            </p>
          )}
        </div>
      </div>

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
            placeholder="john.doe@company.com"
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
            placeholder="Create a strong password"
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

        {/* Password Strength Indicator */}
        {formData.password && (
          <div className="mt-2">
            <div className="flex items-center space-x-2 mb-2">
              <div className="flex-1 bg-secondary-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                  style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                />
              </div>
              <span className="text-xs font-medium text-text-secondary">
                {getPasswordStrengthText()}
              </span>
            </div>
            {passwordStrength.feedback.length > 0 && (
              <div className="text-xs text-text-secondary">
                <p>Password needs:</p>
                <ul className="list-disc list-inside ml-2">
                  {passwordStrength.feedback.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {errors.password && (
          <p className="mt-1 text-sm text-error flex items-center space-x-1">
            <Icon name="AlertCircle" size={14} />
            <span>{errors.password}</span>
          </p>
        )}
      </div>

      {/* Confirm Password Field */}
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-text-primary mb-2">
          Confirm password
        </label>
        <div className="relative">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 pl-12 pr-12 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ${
              errors.confirmPassword ? 'border-error' : 'border-border'
            }`}
            placeholder="Confirm your password"
          />
          <Icon 
            name="Lock" 
            size={20} 
            color={errors.confirmPassword ? 'var(--color-error)' : 'var(--color-secondary-400)'} 
            className="absolute left-4 top-1/2 transform -translate-y-1/2"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-secondary-400 hover:text-text-primary transition-colors duration-200"
          >
            <Icon name={showConfirmPassword ? 'EyeOff' : 'Eye'} size={20} />
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="mt-1 text-sm text-error flex items-center space-x-1">
            <Icon name="AlertCircle" size={14} />
            <span>{errors.confirmPassword}</span>
          </p>
        )}
      </div>

      {/* Terms Agreement */}
      <div>
        <label className="flex items-start space-x-3 cursor-pointer">
          <input
            type="checkbox"
            name="agreeToTerms"
            checked={formData.agreeToTerms}
            onChange={handleInputChange}
            className="w-4 h-4 text-primary border-border rounded focus:ring-primary-500 mt-1"
          />
          <span className="text-sm text-text-secondary">
            I agree to the{' '}
            <button type="button" className="text-primary hover:text-primary-700 transition-colors duration-200">
              Terms of Service
            </button>{' '}
            and{' '}
            <button type="button" className="text-primary hover:text-primary-700 transition-colors duration-200">
              Privacy Policy
            </button>
          </span>
        </label>
        {errors.agreeToTerms && (
          <p className="mt-1 text-sm text-error flex items-center space-x-1">
            <Icon name="AlertCircle" size={14} />
            <span>{errors.agreeToTerms}</span>
          </p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-primary text-white py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors duration-200 font-medium flex items-center justify-center space-x-2"
        disabled={loading}
      >
        {loading ? (
          <Icon name="Loader" size={20} className="animate-spin" />
        ) : (
          <Icon name="UserPlus" size={20} />
        )}
        <span>{loading ? 'Creating Account...' : 'Create Account'}</span>
      </button>
    </form>
  );
};

export default RegisterForm;