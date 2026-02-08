import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import RecentActivity from './RecentActivity';

const TaskDetailSidebar = ({ task, onPriorityChange, onAssigneeChange }) => {
  const [showActivity, setShowActivity] = useState(true);
  
  const priorityOptions = ['Low', 'Medium', 'High', 'Critical'];
  
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Low': return 'bg-secondary-100 text-secondary-700';
      case 'Medium': return 'bg-warning-100 text-warning-700';
      case 'High': return 'bg-error-100 text-error-700';
      case 'Critical': return 'bg-error text-white';
      default: return 'bg-secondary-100 text-secondary-700';
    }
  };

  const teamMembers = [
    { id: 1, name: "John Doe", avatar: "JD", email: "john.doe@company.com" },
    { id: 2, name: "Jane Smith", avatar: "JS", email: "jane.smith@company.com" },
    { id: 3, name: "Michael Chen", avatar: "MC", email: "michael.chen@company.com" },
    { id: 4, name: "Sarah Johnson", avatar: "SJ", email: "sarah.johnson@company.com" }
  ];

  return (
    <div className="space-y-6">
      {/* Priority */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">Priority</label>
        <div className="relative">
          <select
            value={task.priority}
            onChange={(e) => onPriorityChange(e.target.value)}
            className={`appearance-none w-full px-3 py-2 rounded-lg ${getPriorityColor(task.priority)} border border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500`}
          >
            {priorityOptions.map(priority => (
              <option key={priority} value={priority}>{priority}</option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
            <Icon name="ChevronDown" size={16} />
          </div>
        </div>
      </div>

      {/* Assignee */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">Assignee</label>
        <div className="relative">
          <select
            value={task.assignee.id}
            onChange={(e) => {
              const selectedMember = teamMembers.find(member => member.id === parseInt(e.target.value));
              onAssigneeChange(selectedMember);
            }}
            className="appearance-none w-full p-3 border border-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            {teamMembers.map(member => (
              <option key={member.id} value={member.id}>{member.name}</option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-secondary-500">
            <Icon name="ChevronDown" size={16} />
          </div>
        </div>
      </div>

      {/* Reporter */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">Reporter</label>
        <div className="flex items-center space-x-3 p-3 border border-border rounded-lg bg-white">
          <div className="w-8 h-8 bg-secondary-100 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-secondary-700">{task.reporter.avatar}</span>
          </div>
          <div>
            <p className="text-sm font-medium text-text-primary">{task.reporter.name}</p>
            <p className="text-xs text-text-secondary">{task.reporter.email}</p>
          </div>
        </div>
      </div>

      {/* Story Points */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">Story Points</label>
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-lg font-bold text-white">{task.storyPoints}</span>
          </div>
          <div className="flex space-x-1">
            {[1, 2, 3, 5, 8, 13].map(point => (
              <button 
                key={point}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                  task.storyPoints === point 
                    ? 'bg-primary-100 text-primary-700 border border-primary' :'bg-white text-text-secondary border border-border hover:bg-secondary-50'
                } transition-colors duration-200`}
              >
                {point}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Project & Sprint */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">Project</label>
          <div className="p-3 bg-white border border-border rounded-lg">
            <p className="text-sm text-text-primary">{task.project}</p>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">Sprint</label>
          <div className="p-3 bg-white border border-border rounded-lg">
            <p className="text-sm text-text-primary">{task.sprint}</p>
          </div>
        </div>
      </div>

      {/* Dates */}
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">Due Date</label>
          <div className="p-3 bg-white border border-border rounded-lg flex items-center justify-between">
            <p className="text-sm text-text-primary">{task.dueDate}</p>
            <Icon name="Calendar" size={16} color="#64748B" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Created</label>
            <p className="text-sm text-text-secondary">{task.createdAt}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Updated</label>
            <p className="text-sm text-text-secondary">{task.updatedAt}</p>
          </div>
        </div>
      </div>

      {/* Activity Timeline */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-text-primary">Activity</label>
          <button 
            onClick={() => setShowActivity(!showActivity)}
            className="p-1 text-secondary-600 hover:text-text-primary hover:bg-secondary-100 rounded transition-colors duration-200"
          >
            <Icon name={showActivity ? "ChevronUp" : "ChevronDown"} size={16} />
          </button>
        </div>
        
        {showActivity && <RecentActivity activity={task.activity} />}
      </div>
    </div>
  );
};

export default TaskDetailSidebar;