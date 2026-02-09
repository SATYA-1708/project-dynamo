import React from 'react';
import Icon from '../../../components/AppIcon';

const PendingInvitations = () => {
  // Mock pending invitations data
  const pendingInvitations = [
    {
      id: 1,
      email: "alex.morgan@example.com",
      role: "Member",
      invitedBy: "Sarah Johnson",
      invitedOn: "Feb 28, 2024",
      expiresOn: "Mar 14, 2024"
    },
    {
      id: 2,
      email: "taylor.swift@example.com",
      role: "Admin",
      invitedBy: "Emily Chen",
      invitedOn: "Feb 25, 2024",
      expiresOn: "Mar 11, 2024"
    },
    {
      id: 3,
      email: "james.wilson@example.com",
      role: "Viewer",
      invitedBy: "Sarah Johnson",
      invitedOn: "Feb 20, 2024",
      expiresOn: "Mar 6, 2024"
    }
  ];

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'Admin': return 'bg-primary-100 text-primary-700';
      case 'Member': return 'bg-secondary-100 text-secondary-700';
      case 'Viewer': return 'bg-accent-100 text-accent-700';
      default: return 'bg-secondary-100 text-secondary-700';
    }
  };

  const handleResendInvitation = (id) => {
    console.log(`Resending invitation to ID: ${id}`);
    // In a real app, this would trigger an API call to resend the invitation
  };

  const handleCancelInvitation = (id) => {
    console.log(`Cancelling invitation ID: ${id}`);
    // In a real app, this would trigger an API call to cancel the invitation
  };

  return (
    <div className="bg-surface border border-border rounded-lg overflow-hidden">
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-secondary-50 border-b border-border">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Invited By
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Invited On
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Expires
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {pendingInvitations.map((invitation) => (
              <tr key={invitation.id} className="hover:bg-secondary-50 transition-colors duration-150">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-8 bg-secondary-100 rounded-full flex items-center justify-center">
                      <Icon name="Mail" size={16} color="#64748B" />
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-text-primary">{invitation.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${getRoleBadgeColor(invitation.role)}`}>
                    {invitation.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">
                  {invitation.invitedBy}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                  {invitation.invitedOn}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                  {invitation.expiresOn}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <button 
                      onClick={() => handleResendInvitation(invitation.id)}
                      className="px-3 py-1 text-primary border border-primary rounded-lg hover:bg-primary-50 transition-colors duration-200 text-xs flex items-center"
                    >
                      <Icon name="RefreshCw" size={12} className="mr-1" />
                      Resend
                    </button>
                    <button 
                      onClick={() => handleCancelInvitation(invitation.id)}
                      className="px-3 py-1 text-error border border-error rounded-lg hover:bg-error-50 transition-colors duration-200 text-xs flex items-center"
                    >
                      <Icon name="X" size={12} className="mr-1" />
                      Cancel
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden">
        <div className="divide-y divide-border">
          {pendingInvitations.map((invitation) => (
            <div key={invitation.id} className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-8 w-8 bg-secondary-100 rounded-full flex items-center justify-center">
                    <Icon name="Mail" size={16} color="#64748B" />
                  </div>
                  <div className="ml-3">
                    <div className="text-sm font-medium text-text-primary">{invitation.email}</div>
                    <span className={`mt-1 px-2 py-0.5 inline-flex text-xs leading-5 font-medium rounded-full ${getRoleBadgeColor(invitation.role)}`}>
                      {invitation.role}
                    </span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                <div className="flex flex-col">
                  <span className="text-text-secondary">Invited By</span>
                  <span className="text-text-primary">{invitation.invitedBy}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-text-secondary">Invited On</span>
                  <span className="text-text-primary">{invitation.invitedOn}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-text-secondary">Expires</span>
                  <span className="text-text-primary">{invitation.expiresOn}</span>
                </div>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={() => handleResendInvitation(invitation.id)}
                  className="flex-1 py-2 text-primary border border-primary rounded-lg hover:bg-primary-50 transition-colors duration-200 text-xs flex items-center justify-center"
                >
                  <Icon name="RefreshCw" size={12} className="mr-1" />
                  Resend
                </button>
                <button 
                  onClick={() => handleCancelInvitation(invitation.id)}
                  className="flex-1 py-2 text-error border border-error rounded-lg hover:bg-error-50 transition-colors duration-200 text-xs flex items-center justify-center"
                >
                  <Icon name="X" size={12} className="mr-1" />
                  Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Empty State - Shown when no pending invitations */}
      {pendingInvitations.length === 0 && (
        <div className="p-8 text-center">
          <Icon name="Mail" size={48} color="#CBD5E1" className="mx-auto mb-4" />
          <p className="text-text-primary font-medium mb-2">No pending invitations</p>
          <p className="text-text-secondary mb-6">All invitations have been accepted or expired</p>
          <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 flex items-center space-x-2 mx-auto">
            <Icon name="UserPlus" size={16} />
            <span>Invite New Members</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default PendingInvitations;