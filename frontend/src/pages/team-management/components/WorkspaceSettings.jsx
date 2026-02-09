import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const WorkspaceSettings = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [workspaceName, setWorkspaceName] = useState('TaskFlow Pro');
  const [workspaceDescription, setWorkspaceDescription] = useState('Development team workspace for sprint planning and task management');
  
  const handleSaveChanges = () => {
    // In a real app, this would save the changes to the backend
    console.log('Saving workspace changes:', { workspaceName, workspaceDescription });
    setIsEditing(false);
  };

  return (
    <div className="bg-surface border border-border rounded-lg overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-text-primary">Workspace Settings</h3>
          {!isEditing ? (
            <button 
              onClick={() => setIsEditing(true)}
              className="p-2 text-secondary-600 hover:text-text-primary hover:bg-secondary-100 rounded-lg transition-colors duration-200"
            >
              <Icon name="Edit" size={16} />
            </button>
          ) : (
            <button 
              onClick={() => setIsEditing(false)}
              className="p-2 text-secondary-600 hover:text-text-primary hover:bg-secondary-100 rounded-lg transition-colors duration-200"
            >
              <Icon name="X" size={16} />
            </button>
          )}
        </div>

        {/* Workspace Icon and Details */}
        <div className="flex items-center mb-6">
          <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center mr-4">
            <Icon name="Zap" size={32} color="white" />
          </div>
          <div className="flex-1">
            {isEditing ? (
              <input
                type="text"
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                className="w-full text-lg font-semibold text-text-primary bg-transparent border-b border-border focus:border-primary outline-none pb-1 mb-2"
              />
            ) : (
              <h4 className="text-lg font-semibold text-text-primary">{workspaceName}</h4>
            )}
            {isEditing ? (
              <textarea
                value={workspaceDescription}
                onChange={(e) => setWorkspaceDescription(e.target.value)}
                rows={2}
                className="w-full text-sm text-text-secondary bg-transparent border border-border rounded-lg p-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            ) : (
              <p className="text-sm text-text-secondary">{workspaceDescription}</p>
            )}
          </div>
        </div>

        {/* Workspace Details */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon name="Users" size={16} color="var(--color-text-secondary)" />
              <span className="text-sm text-text-secondary">Team Members</span>
            </div>
            <span className="text-sm font-medium text-text-primary">7 members</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon name="Calendar" size={16} color="var(--color-text-secondary)" />
              <span className="text-sm text-text-secondary">Created On</span>
            </div>
            <span className="text-sm font-medium text-text-primary">Jan 15, 2023</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon name="Shield" size={16} color="var(--color-text-secondary)" />
              <span className="text-sm text-text-secondary">Security Level</span>
            </div>
            <span className="text-sm font-medium text-text-primary">Enterprise</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon name="Database" size={16} color="var(--color-text-secondary)" />
              <span className="text-sm text-text-secondary">Storage Used</span>
            </div>
            <span className="text-sm font-medium text-text-primary">1.2 GB / 10 GB</span>
          </div>
        </div>

        {/* Security Settings */}
        <div className="mt-6 pt-6 border-t border-border">
          <h4 className="text-sm font-medium text-text-primary mb-4">Security Settings</h4>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-text-primary">Two-Factor Authentication</span>
                  <span className="px-2 py-0.5 bg-success-100 text-success-700 rounded-full text-xs font-medium">
                    Enabled
                  </span>
                </div>
                <p className="text-xs text-text-secondary mt-1">
                  Require 2FA for all workspace admins
                </p>
              </div>
              <div className="relative inline-block w-10 align-middle select-none">
                <input 
                  type="checkbox" 
                  name="toggle" 
                  id="toggle-2fa" 
                  className="sr-only"
                  defaultChecked={true}
                />
                <label 
                  htmlFor="toggle-2fa"
                  className="block h-6 overflow-hidden rounded-full bg-success cursor-pointer"
                >
                  <span className="block h-6 w-6 rounded-full bg-white transform translate-x-4 transition-transform duration-200"></span>
                </label>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-text-primary">Session Timeout</span>
                </div>
                <p className="text-xs text-text-secondary mt-1">
                  Automatically log out inactive users
                </p>
              </div>
              <select className="border border-border rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                <option value="30">30 minutes</option>
                <option value="60">1 hour</option>
                <option value="120">2 hours</option>
                <option value="240">4 hours</option>
                <option value="480">8 hours</option>
              </select>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-text-primary">IP Restrictions</span>
                </div>
                <p className="text-xs text-text-secondary mt-1">
                  Limit access to specific IP addresses
                </p>
              </div>
              <button className="px-3 py-1.5 border border-border rounded-lg text-sm hover:bg-secondary-50 transition-colors duration-200">
                Configure
              </button>
            </div>
          </div>
        </div>

        {/* Save Button - Only shown when editing */}
        {isEditing && (
          <div className="mt-6 pt-6 border-t border-border">
            <button
              onClick={handleSaveChanges}
              className="w-full py-2 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <Icon name="Save" size={16} />
              <span>Save Changes</span>
            </button>
          </div>
        )}

        {/* Danger Zone */}
        <div className="mt-6 pt-6 border-t border-border">
          <h4 className="text-sm font-medium text-error mb-4">Danger Zone</h4>
          <div className="space-y-3">
            <button className="w-full py-2 border border-error text-error rounded-lg hover:bg-error-50 transition-colors duration-200 text-sm">
              Transfer Ownership
            </button>
            <button className="w-full py-2 border border-error text-error rounded-lg hover:bg-error-50 transition-colors duration-200 text-sm">
              Delete Workspace
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceSettings;