import React, { useState, useEffect, useRef } from 'react';
import Icon from '../../../components/AppIcon';

const InviteMemberModal = ({ isOpen, onClose }) => {
  const [emails, setEmails] = useState('');
  const [selectedRole, setSelectedRole] = useState('Member');
  const [message, setMessage] = useState('');
  const [emailError, setEmailError] = useState('');
  const modalRef = useRef(null);
  
  // Role options with descriptions
  const roleOptions = [
    { 
      value: 'Admin', 
      label: 'Admin', 
      description: 'Full access to all workspace settings, can manage members and billing'
    },
    { 
      value: 'Member', 
      label: 'Member', 
      description: 'Can create and edit tasks, participate in sprints, and view analytics'
    },
    { 
      value: 'Viewer', 
      label: 'Viewer', 
      description: 'Read-only access to tasks and sprints, cannot make changes'
    }
  ];

  // Default invitation message
  const defaultMessage = `Hi there,

I'd like to invite you to join our TaskFlow Pro workspace. We use it to manage our projects and collaborate on tasks.

Looking forward to working with you!`;

  useEffect(() => {
    if (isOpen) {
      setMessage(defaultMessage);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const validateEmails = (emailString) => {
    if (!emailString.trim()) {
      setEmailError('Please enter at least one email address');
      return false;
    }
    
    const emailList = emailString.split(',').map(email => email.trim());
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    const invalidEmails = emailList.filter(email => !emailRegex.test(email));
    
    if (invalidEmails.length > 0) {
      setEmailError(`Invalid email format: ${invalidEmails.join(', ')}`);
      return false;
    }
    
    setEmailError('');
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateEmails(emails)) {
      // In a real app, this would send the invitation
      console.log('Inviting:', emails.split(',').map(email => email.trim()));
      console.log('Role:', selectedRole);
      console.log('Message:', message);
      
      // Reset form and close modal
      setEmails('');
      setSelectedRole('Member');
      setMessage(defaultMessage);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-200 flex items-center justify-center p-4">
      <div 
        ref={modalRef}
        className="w-full max-w-2xl bg-surface rounded-lg shadow-xl border border-border overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-text-primary">Invite Team Members</h2>
          <button
            onClick={onClose}
            className="p-2 text-secondary-600 hover:text-text-primary hover:bg-secondary-100 rounded-lg transition-colors duration-200"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-6">
            {/* Email Input */}
            <div>
              <label htmlFor="emails" className="block text-sm font-medium text-text-primary mb-2">
                Email Addresses <span className="text-error">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Icon name="Mail" size={16} color="#64748B" />
                </div>
                <input
                  id="emails"
                  type="text"
                  value={emails}
                  onChange={(e) => {
                    setEmails(e.target.value);
                    if (emailError) validateEmails(e.target.value);
                  }}
                  placeholder="Enter email addresses separated by commas"
                  className={`pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                    emailError ? 'border-error' : 'border-border'
                  }`}
                />
              </div>
              {emailError && (
                <p className="mt-2 text-sm text-error flex items-center">
                  <Icon name="AlertCircle" size={14} className="mr-1" />
                  {emailError}
                </p>
              )}
              <p className="mt-2 text-xs text-text-secondary">
                You can invite multiple people by separating email addresses with commas.
              </p>
            </div>

            {/* Role Selection */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-text-primary mb-2">
                Role <span className="text-error">*</span>
              </label>
              <div className="space-y-3">
                {roleOptions.map((role) => (
                  <div 
                    key={role.value}
                    className={`flex items-start p-3 border rounded-lg cursor-pointer transition-colors duration-200 ${
                      selectedRole === role.value 
                        ? 'border-primary bg-primary-50' :'border-border hover:bg-secondary-50'
                    }`}
                    onClick={() => setSelectedRole(role.value)}
                  >
                    <div className="flex items-center h-5">
                      <input
                        type="radio"
                        id={`role-${role.value}`}
                        name="role"
                        value={role.value}
                        checked={selectedRole === role.value}
                        onChange={() => setSelectedRole(role.value)}
                        className="h-4 w-4 text-primary border-secondary-300 focus:ring-primary"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label 
                        htmlFor={`role-${role.value}`} 
                        className={`font-medium ${
                          selectedRole === role.value ? 'text-primary' : 'text-text-primary'
                        }`}
                      >
                        {role.label}
                      </label>
                      <p className="text-text-secondary mt-1">{role.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Custom Message */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-text-primary mb-2">
                Invitation Message
              </label>
              <textarea
                id="message"
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
              <p className="mt-2 text-xs text-text-secondary">
                Personalize your invitation message (optional).
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end p-6 border-t border-border bg-secondary-50 space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-border rounded-lg text-text-primary hover:bg-secondary-100 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 flex items-center space-x-2"
            >
              <Icon name="Send" size={16} />
              <span>Send Invitations</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InviteMemberModal;