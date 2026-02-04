import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';

const CommandPalette = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const navigationCommands = [
    { id: 'dashboard', label: 'Go to Dashboard', path: '/dashboard-overview', icon: 'LayoutDashboard', category: 'Navigation' },
    { id: 'kanban', label: 'Go to Kanban Board', path: '/kanban-board', icon: 'Kanban', category: 'Navigation' },
    { id: 'sprints', label: 'Go to Sprint Planning', path: '/sprint-planning', icon: 'Calendar', category: 'Navigation' },
    { id: 'analytics', label: 'Go to Analytics', path: '/analytics-dashboard', icon: 'BarChart3', category: 'Navigation' },
    { id: 'team', label: 'Go to Team Management', path: '/team-management', icon: 'Users', category: 'Navigation' },
  ];

  const actionCommands = [
    { id: 'new-task', label: 'Create New Task', action: 'create-task', icon: 'Plus', category: 'Actions' },
    { id: 'new-project', label: 'Create New Project', action: 'create-project', icon: 'FolderPlus', category: 'Actions' },
    { id: 'invite-member', label: 'Invite Team Member', action: 'invite-member', icon: 'UserPlus', category: 'Actions' },
    { id: 'export-data', label: 'Export Project Data', action: 'export-data', icon: 'Download', category: 'Actions' },
  ];

  const recentTasks = [
    { id: 'task-1', label: 'Fix authentication bug', type: 'Bug', icon: 'Bug', category: 'Recent Tasks' },
    { id: 'task-2', label: 'Design user dashboard', type: 'Design', icon: 'Palette', category: 'Recent Tasks' },
    { id: 'task-3', label: 'Implement API endpoints', type: 'Development', icon: 'Code', category: 'Recent Tasks' },
    { id: 'task-4', label: 'Update documentation', type: 'Documentation', icon: 'FileText', category: 'Recent Tasks' },
  ];

  const allCommands = [...navigationCommands, ...actionCommands, ...recentTasks];

  const filteredCommands = allCommands.filter(command =>
    command.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    command.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        setIsOpen(true);
        setSearchQuery('');
        setSelectedIndex(0);
      }

      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery]);

  const handleKeyNavigation = (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setSelectedIndex(prev => (prev + 1) % filteredCommands.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      handleCommandSelect(filteredCommands[selectedIndex]);
    }
  };

  const handleCommandSelect = (command) => {
    if (command.path) {
      navigate(command.path);
    } else if (command.action) {
      // Handle action commands
      console.log(`Executing action: ${command.action}`);
    } else if (command.type) {
      // Handle task selection
      console.log(`Opening task: ${command.label}`);
    }
    
    setIsOpen(false);
    setSearchQuery('');
  };

  const groupedCommands = filteredCommands.reduce((groups, command) => {
    const category = command.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(command);
    return groups;
  }, {});

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-300 flex items-start justify-center pt-20">
      <div className="w-full max-w-2xl mx-4 bg-surface rounded-lg shadow-xl border border-border">
        {/* Search Input */}
        <div className="flex items-center px-4 py-3 border-b border-border">
          <Icon name="Search" size={20} color="#64748B" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search for commands, tasks, or navigate..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyNavigation}
            className="flex-1 ml-3 bg-transparent text-text-primary placeholder-text-secondary outline-none"
          />
          <div className="flex items-center space-x-1 text-xs text-text-secondary">
            <kbd className="px-2 py-1 bg-secondary-100 rounded border">ESC</kbd>
            <span>to close</span>
          </div>
        </div>

        {/* Commands List */}
        <div className="max-h-96 overflow-y-auto">
          {filteredCommands.length === 0 ? (
            <div className="p-8 text-center">
              <Icon name="Search" size={48} color="#CBD5E1" className="mx-auto mb-4" />
              <p className="text-text-secondary">No commands found</p>
              <p className="text-sm text-text-secondary mt-1">Try searching for navigation, actions, or tasks</p>
            </div>
          ) : (
            Object.entries(groupedCommands).map(([category, commands]) => (
              <div key={category}>
                <div className="px-4 py-2 text-xs font-medium text-text-secondary uppercase tracking-wider bg-secondary-50 border-b border-border-light">
                  {category}
                </div>
                {commands.map((command, index) => {
                  const globalIndex = filteredCommands.indexOf(command);
                  const isSelected = globalIndex === selectedIndex;
                  
                  return (
                    <button
                      key={command.id}
                      onClick={() => handleCommandSelect(command)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-secondary-50 transition-colors duration-150 ${
                        isSelected ? 'bg-primary-50 border-r-2 border-primary' : ''
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        isSelected ? 'bg-primary text-white' : 'bg-secondary-100 text-secondary-600'
                      }`}>
                        <Icon name={command.icon} size={16} />
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${
                          isSelected ? 'text-primary' : 'text-text-primary'
                        }`}>
                          {command.label}
                        </p>
                        {command.type && (
                          <p className="text-xs text-text-secondary mt-1">{command.type}</p>
                        )}
                      </div>
                      {command.path && (
                        <div className="flex items-center space-x-1 text-xs text-text-secondary">
                          <kbd className="px-2 py-1 bg-secondary-100 rounded border">↵</kbd>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-border bg-secondary-50">
          <div className="flex items-center justify-between text-xs text-text-secondary">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <kbd className="px-2 py-1 bg-secondary-200 rounded border">↑</kbd>
                <kbd className="px-2 py-1 bg-secondary-200 rounded border">↓</kbd>
                <span>to navigate</span>
              </div>
              <div className="flex items-center space-x-1">
                <kbd className="px-2 py-1 bg-secondary-200 rounded border">↵</kbd>
                <span>to select</span>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <span>Powered by</span>
              <Icon name="Zap" size={12} color="#2563EB" />
              <span className="font-medium text-primary">TaskFlow</span>
            </div>
          </div>
        </div>
      </div>

      {/* Click outside to close */}
      <div 
        className="absolute inset-0 -z-10" 
        onClick={() => setIsOpen(false)}
      />
    </div>
  );
};

export default CommandPalette;