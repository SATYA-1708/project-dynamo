// src/components/ui/Sidebar.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import { useModal } from '../../context/ModalContext';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setIsProjectModalOpen, setIsSprintModalOpen, setIsTaskModalOpen, handleTaskCreated, handleProjectCreated, handleSprintCreated } = useModal();

  useEffect(() => {
    if (isOpen) {
      console.log('Sidebar is opening');
      document.body.style.overflow = 'hidden';
    } else {
      console.log('Sidebar is closing');
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const navigationItems = [
    {
      label: 'Dashboard',
      path: '/dashboard-overview',
      icon: 'LayoutDashboard',
      tooltip: 'Project overview and activity hub'
    },
    {
      label: 'Boards',
      path: '/kanban-board',
      icon: 'Kanban',
      tooltip: 'Visual task management'
    },
    {
      label: 'Sprints',
      path: '/sprint-planning',
      icon: 'Calendar',
      tooltip: 'Agile planning workspace'
    },
   
    {
      label: 'Team',
      path: '/team-management',
      icon: 'Users',
      tooltip: 'Member management and settings'
    }
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-80 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-16 bottom-0 bg-surface border-r border-border z-90 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] w-60
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        
        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {navigationItems.map((item) => {
              const isActive = isActivePath(item.path);
              
              return (
                <div key={item.path} className="relative group">
                  <button
                    onClick={() => handleNavigation(item.path)}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-primary text-white shadow-sm'
                        : 'text-text-secondary hover:text-text-primary hover:bg-secondary-100'
                    }`}
                  >
                    <Icon 
                      name={item.icon} 
                      size={20} 
                      color={isActive ? 'white' : 'currentColor'}
                    />
                    
                    <span className="font-medium text-sm">{item.label}</span>
                    
                    {isActive && (
                      <div className="ml-auto w-2 h-2 bg-white rounded-full" />
                    )}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Quick Actions Section */}
          <div className="mt-8 pt-6 border-t border-border">
            <h3 className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-3">
              Quick Actions
            </h3>
            <div className="space-y-2">
              <button className="w-full flex items-center space-x-3 px-3 py-2 text-text-secondary hover:text-text-primary hover:bg-secondary-100 rounded-lg transition-colors duration-200"
                onClick={() => setIsTaskModalOpen(true)}
              >
                <Icon name="Plus" size={16} />
                <span className="text-sm">New Task</span>
              </button>
              <button
              className="w-full flex items-center space-x-3 px-3 py-2 text-text-secondary hover:text-text-primary hover:bg-secondary-100 rounded-lg transition-colors duration-200"
              onClick={() => setIsProjectModalOpen(true)}
            >
              <Icon name="FolderPlus" size={18} />
              <span className="text-sm">New Project</span>
            </button>
            <button
              className="w-full flex items-center space-x-3 px-3 py-2 text-text-secondary hover:text-text-primary hover:bg-secondary-100 rounded-lg transition-colors duration-200"
              onClick={() => setIsSprintModalOpen(true)}
            >
              <Icon name="CalendarPlus" size={18} />
              <span className="text-sm">New Sprint</span>
            </button>
             
            </div>
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center space-x-3 p-3 bg-secondary-50 rounded-lg">
            <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center">
              <Icon name="CheckCircle" size={16} color="white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-text-primary">All systems operational</p>
              <p className="text-xs text-text-secondary">Last sync: 2 min ago</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;