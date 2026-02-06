import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';

const LoginRegister = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleAuthSuccess = () => {
    setIsLoading(true);
    // Simulate authentication process
    setTimeout(() => {
      setIsLoading(false);
      navigate('/dashboard-overview');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-background to-secondary-50 flex items-center justify-center px-4 py-8">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-300 flex items-center justify-center">
          <div className="bg-surface rounded-lg p-8 flex flex-col items-center space-y-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-text-primary font-medium">Signing you in...</p>
          </div>
        </div>
      )}

      {/* Main Authentication Container */}
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <Icon name="Zap" size={24} color="white" />
            </div>
            <h1 className="text-2xl font-bold text-text-primary">TaskFlow Pro</h1>
          </div>
          <p className="text-text-secondary text-lg">
            Streamline your development workflow with powerful task management
          </p>
        </div>

        {/* Authentication Card */}
        <div className="bg-surface rounded-2xl shadow-xl border border-border overflow-hidden">
          {/* Tab Navigation */}
          <div className="border-b border-border bg-secondary-50">
            <div className="flex">
              <button
                onClick={() => setActiveTab('login')}
                className={`flex-1 py-4 px-6 text-center font-medium transition-all duration-200 ${
                  activeTab === 'login' ?'text-primary border-b-2 border-primary bg-surface' :'text-text-secondary hover:text-text-primary hover:bg-secondary-100'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <Icon name="LogIn" size={20} />
                  <span>Sign In</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('register')}
                className={`flex-1 py-4 px-6 text-center font-medium transition-all duration-200 ${
                  activeTab === 'register' ?'text-primary border-b-2 border-primary bg-surface' :'text-text-secondary hover:text-text-primary hover:bg-secondary-100'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <Icon name="UserPlus" size={20} />
                  <span>Create Account</span>
                </div>
              </button>
            </div>
          </div>

          {/* Form Content */}
          <div className="grid lg:grid-cols-2 min-h-[600px]">
            {/* Left Panel - Main Form */}
            <div className="p-8 lg:p-12">
              <div className="max-w-md mx-auto">
                <div className="mb-8">
                  <h2 className="text-2xl font-semibold text-text-primary mb-2">
                    {activeTab === 'login' ? 'Welcome back!' : 'Get started today'}
                  </h2>
                  <p className="text-text-secondary">
                    {activeTab === 'login' ?'Sign in to your account to continue managing your projects' :'Create your account and join thousands of teams already using TaskFlow Pro'
                    }
                  </p>
                </div>

                {/* Forms */}
                {activeTab === 'login' ? (
                  <LoginForm onSuccess={handleAuthSuccess} />
                ) : (
                  <RegisterForm onSuccess={handleAuthSuccess} />
                )}


              </div>
            </div>

            {/* Right Panel - Features/Benefits */}
            <div className="bg-gradient-to-br from-primary-500 to-primary-700 p-8 lg:p-12 text-white flex flex-col justify-center">
              <div className="max-w-md mx-auto">
                <h3 className="text-2xl font-semibold mb-6">
                  {activeTab === 'login' ?'Continue your productivity journey' :'Join the future of task management'
                  }
                </h3>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon name="Kanban" size={18} color="white" />
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Visual Task Management</h4>
                      <p className="text-primary-100 text-sm">
                        Organize your work with intuitive Kanban boards and drag-and-drop functionality
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon name="Calendar" size={18} color="white" />
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Agile Sprint Planning</h4>
                      <p className="text-primary-100 text-sm">
                        Plan and track sprints with advanced analytics and velocity forecasting
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon name="Users" size={18} color="white" />
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Real-time Collaboration</h4>
                      <p className="text-primary-100 text-sm">
                        Work together seamlessly with live updates and team synchronization
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon name="BarChart3" size={18} color="white" />
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Advanced Analytics</h4>
                      <p className="text-primary-100 text-sm">
                        Get insights into team performance with comprehensive reporting tools
                      </p>
                    </div>
                  </div>
                </div>

                {/* Testimonial */}
                <div className="mt-8 p-4 bg-white bg-opacity-10 rounded-lg">
                  <p className="text-sm italic mb-3">
                    "TaskFlow Pro transformed how our team manages projects. The sprint planning features are incredible!"
                  </p>
                  <div className="flex items-center space-x-3">
                   
                   
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-text-secondary">
          <p>
            By continuing, you agree to our{' '}
            <button className="text-primary hover:text-primary-700 transition-colors duration-200">
              Terms of Service
            </button>{' '}
            and{' '}
            <button className="text-primary hover:text-primary-700 transition-colors duration-200">
              Privacy Policy
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginRegister;