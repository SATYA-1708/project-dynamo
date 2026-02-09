import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const IntegrationSettings = () => {
  // Mock integration states
  const [integrations, setIntegrations] = useState({
    github: {
      connected: true,
      account: 'taskflow-org',
      repositories: ['taskflow/frontend', 'taskflow/backend', 'taskflow/docs'],
      lastSync: '10 minutes ago'
    },
    slack: {
      connected: true,
      workspace: 'TaskFlow Team',
      channels: ['#project-updates', '#sprint-planning', '#general'],
      lastSync: '5 minutes ago'
    },
    jira: {
      connected: false,
      account: '',
      projects: [],
      lastSync: ''
    },
    figma: {
      connected: false,
      team: '',
      projects: [],
      lastSync: ''
    }
  });

  const handleDisconnect = (integration) => {
    // In a real app, this would disconnect the integration via API
    setIntegrations({
      ...integrations,
      [integration]: {
        ...integrations[integration],
        connected: false,
        account: '',
        repositories: [],
        workspace: '',
        channels: [],
        team: '',
        projects: [],
        lastSync: ''
      }
    });
  };

  const handleConnect = (integration) => {
    // In a real app, this would open OAuth flow or configuration modal
    console.log(`Connecting to ${integration}...`);
  };

  return (
    <div className="bg-surface border border-border rounded-lg overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-text-primary">Integrations</h3>
          <button className="p-2 text-secondary-600 hover:text-text-primary hover:bg-secondary-100 rounded-lg transition-colors duration-200">
            <Icon name="Plus" size={16} />
          </button>
        </div>

        {/* Integration Cards */}
        <div className="space-y-4">
          {/* GitHub Integration */}
          <div className="border border-border rounded-lg overflow-hidden">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[#24292e] rounded-lg flex items-center justify-center">
                  <Icon name="Github" size={20} color="white" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-text-primary">GitHub</h4>
                  <p className="text-xs text-text-secondary">
                    {integrations.github.connected 
                      ? `Connected to ${integrations.github.account}`
                      : 'Not connected'}
                  </p>
                </div>
              </div>
              <div>
                {integrations.github.connected ? (
                  <button 
                    onClick={() => handleDisconnect('github')}
                    className="px-3 py-1.5 border border-border rounded-lg text-xs hover:bg-secondary-50 transition-colors duration-200"
                  >
                    Disconnect
                  </button>
                ) : (
                  <button 
                    onClick={() => handleConnect('github')}
                    className="px-3 py-1.5 bg-primary text-white rounded-lg text-xs hover:bg-primary-700 transition-colors duration-200"
                  >
                    Connect
                  </button>
                )}
              </div>
            </div>
            
            {integrations.github.connected && (
              <div className="px-4 py-3 bg-secondary-50 border-t border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-text-secondary">Repositories</span>
                  <span className="text-xs text-text-secondary">Last sync: {integrations.github.lastSync}</span>
                </div>
                <div className="space-y-1.5">
                  {integrations.github.repositories.map((repo, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Icon name="GitBranch" size={12} color="var(--color-text-secondary)" />
                      <span className="text-xs text-text-primary">{repo}</span>
                    </div>
                  ))}
                </div>
                <button className="mt-3 text-xs text-primary hover:text-primary-700 transition-colors duration-200 flex items-center">
                  <Icon name="Settings" size={12} className="mr-1" />
                  Configure Webhook
                </button>
              </div>
            )}
          </div>

          {/* Slack Integration */}
          <div className="border border-border rounded-lg overflow-hidden">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[#4A154B] rounded-lg flex items-center justify-center">
                  <Icon name="MessageSquare" size={20} color="white" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-text-primary">Slack</h4>
                  <p className="text-xs text-text-secondary">
                    {integrations.slack.connected 
                      ? `Connected to ${integrations.slack.workspace}`
                      : 'Not connected'}
                  </p>
                </div>
              </div>
              <div>
                {integrations.slack.connected ? (
                  <button 
                    onClick={() => handleDisconnect('slack')}
                    className="px-3 py-1.5 border border-border rounded-lg text-xs hover:bg-secondary-50 transition-colors duration-200"
                  >
                    Disconnect
                  </button>
                ) : (
                  <button 
                    onClick={() => handleConnect('slack')}
                    className="px-3 py-1.5 bg-primary text-white rounded-lg text-xs hover:bg-primary-700 transition-colors duration-200"
                  >
                    Connect
                  </button>
                )}
              </div>
            </div>
            
            {integrations.slack.connected && (
              <div className="px-4 py-3 bg-secondary-50 border-t border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-text-secondary">Channels</span>
                  <span className="text-xs text-text-secondary">Last sync: {integrations.slack.lastSync}</span>
                </div>
                <div className="space-y-1.5">
                  {integrations.slack.channels.map((channel, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Icon name="Hash" size={12} color="var(--color-text-secondary)" />
                      <span className="text-xs text-text-primary">{channel}</span>
                    </div>
                  ))}
                </div>
                <button className="mt-3 text-xs text-primary hover:text-primary-700 transition-colors duration-200 flex items-center">
                  <Icon name="Settings" size={12} className="mr-1" />
                  Configure Notifications
                </button>
              </div>
            )}
          </div>

          {/* Other Integrations */}
          <div className="border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-medium text-text-primary">Other Integrations</h4>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {/* Jira */}
              <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-[#0052CC] rounded-lg flex items-center justify-center">
                    <Icon name="Trello" size={16} color="white" />
                  </div>
                  <span className="text-xs font-medium text-text-primary">Jira</span>
                </div>
                <button 
                  onClick={() => handleConnect('jira')}
                  className="px-2 py-1 bg-secondary-100 text-text-secondary rounded text-xs hover:bg-secondary-200 transition-colors duration-200"
                >
                  Connect
                </button>
              </div>
              
              {/* Figma */}
              <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-[#1E1E1E] rounded-lg flex items-center justify-center">
                    <Icon name="Figma" size={16} color="white" />
                  </div>
                  <span className="text-xs font-medium text-text-primary">Figma</span>
                </div>
                <button 
                  onClick={() => handleConnect('figma')}
                  className="px-2 py-1 bg-secondary-100 text-text-secondary rounded text-xs hover:bg-secondary-200 transition-colors duration-200"
                >
                  Connect
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Webhook Documentation */}
        <div className="mt-6 pt-6 border-t border-border">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium text-text-primary">Webhook API</h4>
            <button className="text-xs text-primary hover:text-primary-700 transition-colors duration-200 flex items-center">
              <Icon name="ExternalLink" size={12} className="mr-1" />
              View Docs
            </button>
          </div>
          <div className="bg-secondary-50 border border-border rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-text-primary">Webhook URL</span>
              <button className="p-1 text-secondary-600 hover:text-text-primary transition-colors duration-200">
                <Icon name="Copy" size={14} />
              </button>
            </div>
            <div className="bg-secondary-100 border border-border rounded p-2 font-mono text-xs text-text-secondary overflow-x-auto">
              https://api.taskflow.pro/webhooks/workspace/12345/events
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegrationSettings;