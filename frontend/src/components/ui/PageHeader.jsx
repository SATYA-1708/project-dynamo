// src/components/ui/PageHeader.jsx
import React from 'react';
import { useLocation } from 'react-router-dom';

const PageHeader = ({ title, description, actions, showBreadcrumb = false }) => {
  const location = useLocation();

  // Define navigation mapping for consistent menu names
  const navigationMapping = {
    '/dashboard-overview': {
      title: 'Dashboard Overview',
      description: 'Welcome back! Here\'s what\'s happening with your projects today.'
    },
    '/kanban-board': {
      title: 'Kanban Board', 
      description: 'Manage tasks with visual workflow'
    },
    '/sprint-planning': {
      title: 'Sprint Planning',
      description: 'Plan and organize your team\'s work into manageable sprints'
    },
    '/team-management': {
      title: 'Team Management',
      description: 'Member management and settings'
    },
    '/task-detail': {
      title: 'Task Details',
      description: 'View and manage task information'
    }
  };

  // Get current page info
  const currentPageInfo = navigationMapping[location.pathname] || {
    title: title || 'TaskFlow Pro',
    description: description || ''
  };

  // Use provided props or fall back to mapped values
  const pageTitle = title || currentPageInfo.title;
  const pageDescription = description || currentPageInfo.description;

  return (
    <div className="mb-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div className="mb-4 md:mb-0">
          <h1 className="text-2xl sm:text-2xl lg:text-2xl xl:text-2xl font-bold text-text-primary mb-2">
            {pageTitle}
          </h1>
          {pageDescription && (
            <p className="text-text-secondary">
              {pageDescription}
            </p>
          )}
        </div>
        
        {/* Action Buttons */}
        {actions && (
          <div className="flex items-center space-x-3">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;