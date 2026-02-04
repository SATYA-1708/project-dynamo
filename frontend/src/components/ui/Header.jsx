import React, { useState, useEffect } from 'react';
 import { useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import axios from 'axios';

const Header = ({ toggleSidebar, isSidebarOpen }) => {

  const navigate = useNavigate();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);

  // Placeholder for current user ID - replace with actual user context/auth
  // For demonstration, assuming a hardcoded user ID or fetching from a global state/context
  // In a real application, you'd get the current user's ID from an authentication context
  // For this example, we'll assume a user ID is available or fetched.
  useEffect(() => {
    const fetchUserData = async () => {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      console.log('User Info from localStorage:', userInfo);
      if (!userInfo || !userInfo.email) {
        setUserLoading(false);
        navigate('/login-register');
        return;
      }
      try {
        const res = await axios.get(`${import.meta.env.VITE_RENDER_BACKEND_URL}/api/users/email/${userInfo.email}`);
        setCurrentUser(res.data);
      } catch (err) {
        console.error('Error fetching user data:', err);
      } finally {
        setUserLoading(false);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (!userInfo || !userInfo.id) return; // Use userInfo.id for notifications
      setLoading(true);
      try {
        const res = await axios.get(`${import.meta.env.VITE_RENDER_BACKEND_URL}/api/notifications/${userInfo.id}`);
        setNotifications(res.data);
      } catch (err) {
        console.error('Error fetching notifications:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [currentUser]); // Fetch notifications when currentUser changes (on login/mount)

  const handleSearchClick = () => {
    const event = new KeyboardEvent('keydown', {
      key: 'k',
      ctrlKey: true,
      bubbles: true
    });
    document.dispatchEvent(event);
  };

  const handleNotificationClick = async (notificationId) => {
    try {
      await axios.patch(`${import.meta.env.VITE_RENDER_BACKEND_URL}/api/notifications/${notificationId}/read`);
      setNotifications(prevNotifications =>
        prevNotifications.map(n =>
          n._id === notificationId ? { ...n, read: true } : n
        )
      );
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + ' year' + (Math.floor(interval) === 1 ? '' : 's') + ' ago';
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + ' month' + (Math.floor(interval) === 1 ? '' : 's') + ' ago';
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + ' day' + (Math.floor(interval) === 1 ? '' : 's') + ' ago';
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + ' hour' + (Math.floor(interval) === 1 ? '' : 's') + ' ago';
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + ' minute' + (Math.floor(interval) === 1 ? '' : 's') + ' ago';
    return Math.floor(seconds) + ' second' + (Math.floor(seconds) === 1 ? '' : 's') + ' ago';
  };

  const handleSignOut = () => {
    // Clear user data from local storage or context
    localStorage.removeItem('userInfo'); // Assuming user info is stored here
    // Redirect to login page
    navigate('/login-register'); // Assuming you have a /login route
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-surface border-b border-border z-100">
      <div className="flex items-center justify-between h-full px-6">
        {/* Left Section - Workspace Selector */}
        <div className="flex items-center space-x-4">
          {/* Burger menu for mobile */}
          <div className="lg:hidden fixed top-4 left-4 z-500">
            <button onClick={() => { toggleSidebar(); }} className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500">
              <Icon name="Menu" size={24} color="currentColor" />
            </button>
          </div>
          {/* Logo for desktop */}
          <div className="hidden lg:flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Zap" size={18} color="white" />
            </div>
            <div>
              <h1 className="text-lg font-medium text-text-primary">TaskFlow Pro</h1>
              <p className="text-xs text-text-secondary">Development Team</p>
            </div>
          </div>
        </div>



        {/* Right Section - Actions & User */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={async () => {
                if (isNotificationOpen && notifications.length > 0) {
                  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                  if (userInfo && userInfo.id) {
                    try {
                      await axios.patch(`${import.meta.env.VITE_RENDER_BACKEND_URL}/api/notifications/mark-all-read/${userInfo.id}`);
                      setNotifications([]); // Clear notifications after marking all as read
                    } catch (err) {
                      console.error('Error marking all notifications as read:', err);
                    }
                  }
                }
                setIsNotificationOpen(!isNotificationOpen);
              }}
              className="relative p-2 text-secondary-600 hover:text-text-primary hover:bg-secondary-100 rounded-lg transition-colors duration-200"
            >
              <Icon name="Bell" size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-error text-white text-xs rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {isNotificationOpen && (
              <div className="absolute right-0 top-12 w-80 bg-surface border border-border rounded-lg shadow-lg z-150">
                <div className="p-4 border-b border-border">
                  <h3 className="font-medium text-text-primary">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {loading ? (
                    <div className="p-4 text-center text-text-secondary">Loading notifications...</div>
                  ) : notifications.length === 0 ? (
                    <div className="p-4 text-center text-text-secondary">No new notifications</div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification._id}
                        className="p-4 border-b border-border-light hover:bg-secondary-50 transition-colors duration-150 cursor-pointer"
                        onClick={() => handleNotificationClick(notification._id)}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`w-2 h-2 rounded-full mt-2 ${!notification.read ? 'bg-primary' : 'bg-secondary-300'}`} />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-text-primary">{notification.message}</p>
                            <p className="text-xs text-secondary-400 mt-2">{formatTimeAgo(notification.createdAt)}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="p-3 border-t border-border">
                  
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center space-x-3 p-2 hover:bg-secondary-100 rounded-lg transition-colors duration-200"
            >
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-primary-700">
                  {currentUser ? currentUser.username.charAt(0).toUpperCase() : '?'}
                </span>
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-text-primary">
                  {currentUser ? currentUser.username : 'Loading...'}
                </p>
                <p className="text-xs text-text-secondary">
                  {currentUser ? currentUser.email : 'Loading...'}
                </p>
              </div>
              <Icon name="ChevronDown" size={16} color="#64748B" />
            </button>

            {/* User Dropdown */}
            {isUserMenuOpen && (
              <div className="absolute right-0 top-12 w-56 bg-surface border border-border rounded-lg shadow-lg z-150">
                <div className="p-3 border-b border-border">
                  <p className="text-sm font-medium text-text-primary">
                    {currentUser ? currentUser.username : 'Loading...'}
                  </p>
                  <p className="text-xs text-text-secondary">
                    {currentUser ? currentUser.email : 'Loading...'}
                  </p>
                </div>
                <div className="py-2">
                  <button
                    onClick={handleSignOut}
                    className="w-full px-4 py-2 text-left text-sm text-error hover:bg-error-50 transition-colors duration-150 flex items-center space-x-3"
                  >
                    <Icon name="LogOut" size={16} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Click outside handlers */}
      {(isUserMenuOpen || isNotificationOpen) && (
        <div 
          className="fixed inset-0 z-90" 
          onClick={() => {
            setIsUserMenuOpen(false);
            setIsNotificationOpen(false);
          }}
        />
      )}
    </header>
  );
};

export default Header;