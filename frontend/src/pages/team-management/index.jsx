// src/pages/team-management/index.jsx
import React, { useState, useEffect } from 'react';

import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import CommandPalette from '../../components/ui/CommandPalette';
import PageHeader from '../../components/ui/PageHeader';
import Icon from '../../components/AppIcon';
import MemberTable from './components/MemberTable';
import PendingInvitations from './components/PendingInvitations';
import InviteMemberModal from './components/InviteMemberModal';
import WorkspaceSettings from './components/WorkspaceSettings';
import IntegrationSettings from './components/IntegrationSettings';
import ActivityLog from './components/ActivityLog';

const TeamManagement = () => {
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('members');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('All');

  // Role filter options
  const roleOptions = ['All', 'Admin', 'Member', 'Viewer'];

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <CommandPalette />

      {/* Main Content */}
      <main className="pt-16 lg:pl-60">
        <div className="p-6">
          {/* Page Header */}
          <PageHeader 
            actions={
              <>
                <button 
                  onClick={() => setActiveTab('settings')}
                  className="px-4 py-2 bg-secondary-100 text-secondary-700 rounded-lg hover:bg-secondary-200 transition-colors duration-200 flex items-center space-x-2"
                >
                  <Icon name="Settings" size={16} />
                  <span>Settings</span>
                </button>
                <button 
                  onClick={() => setIsInviteModalOpen(true)}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 flex items-center space-x-2"
                >
                  <Icon name="UserPlus" size={16} />
                  <span>Invite Member</span>
                </button>
              </>
            }
          />

          {/* Content Area */}
          <div className="flex flex-col gap-6">
            {/* Main Column */}
            <div className="w-full">
              {/* Tabs */}
              <div className="border-b border-border mb-6">
                <div className="flex space-x-8">
                  <button
                    onClick={() => setActiveTab('members')}
                    className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                      activeTab === 'members' ?'border-primary text-primary' :'border-transparent text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    Team Members
                  </button>
          
                 
                </div>
              </div>

              {/* Toolbar */}
              {activeTab === 'members' && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Icon name="Search" size={16} color="#64748B" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search members..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-border rounded-lg w-full sm:w-80 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <label htmlFor="role-filter" className="text-sm text-text-secondary">
                        Role:
                      </label>
                      <select
                        id="role-filter"
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                        className="border border-border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      >
                        {roleOptions.map(role => (
                          <option key={role} value={role}>{role}</option>
                        ))}
                      </select>
                    </div>
                    <div className="relative">
                      <button className="flex items-center space-x-2 px-3 py-2 border border-border rounded-lg hover:bg-secondary-50 transition-colors duration-200">
                        <Icon name="MoreHorizontal" size={16} />
                        <span className="text-sm">Bulk Actions</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab Content */}
              {activeTab === 'members' && <MemberTable searchQuery={searchQuery} roleFilter={selectedRole} />}
              {activeTab === 'pending' && <PendingInvitations />}
              {activeTab === 'activity' && <ActivityLog />}
            </div>

            {/* Settings Section - Moved from sidebar to bottom */}
            <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              <WorkspaceSettings />
              <IntegrationSettings />
            </div>
          </div>
        </div>
      </main>

      {/* Invite Member Modal */}
      <InviteMemberModal 
        isOpen={isInviteModalOpen} 
        onClose={() => setIsInviteModalOpen(false)} 
      />
    </div>
  );
};

export default TeamManagement;