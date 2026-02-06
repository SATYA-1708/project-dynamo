import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const KanbanCard = ({ 
  task, 
  viewMode, 
  isSelected, 
  isMultiSelectMode, 
  isDragging, 
  onClick 
}) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Low': return 'bg-secondary-100 text-secondary-700';
      case 'Medium': return 'bg-warning-100 text-warning-700';
      case 'High': return 'bg-error-100 text-error-700';
      case 'Critical': return 'bg-error text-white';
      default: return 'bg-secondary-100 text-secondary-700';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'Low': return 'ArrowDown';
      case 'Medium': return 'Minus';
      case 'High': return 'ArrowUp';
      case 'Critical': return 'AlertTriangle';
      default: return 'Minus';
    }
  };

  const isOverdue = new Date(task.dueDate) < new Date();

  return (
    <div
      onClick={onClick}
      className={`bg-surface border rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
        isDragging ? 'shadow-lg rotate-2 scale-105' : ''
      } ${
        isSelected ? 'ring-2 ring-primary border-primary' : 'border-border hover:border-primary-300'
      } ${
        isMultiSelectMode ? 'hover:ring-2 hover:ring-primary-300' : ''
      }`}
    >
      {/* Card Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          {isMultiSelectMode && (
            <div className={`w-4 h-4 border-2 rounded flex items-center justify-center ${
              isSelected ? 'bg-primary border-primary' : 'border-secondary-300'
            }`}>
              {isSelected && <Icon name="Check" size={12} color="white" />}
            </div>
          )}
          <span className="text-xs font-mono text-text-secondary">{task.id.toUpperCase()}</span>
        </div>
        <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getPriorityColor(task.priority)}`}>
          <Icon name={getPriorityIcon(task.priority)} size={12} />
          {viewMode === 'detailed' && <span>{task.priority}</span>}
        </div>
      </div>

      {/* Task Title */}
      <h3 className="text-sm font-medium text-text-primary mb-2 line-clamp-2">
        {task.title}
      </h3>

      {/* Task Description - Only in detailed view */}
      {viewMode === 'detailed' && (
        <p className="text-xs text-text-secondary mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Labels */}
      {task.labels && task.labels.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {task.labels.slice(0, viewMode === 'detailed' ? 3 : 2).map((label, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-secondary-100 text-secondary-700 rounded text-xs font-medium"
            >
              {label}
            </span>
          ))}
          {task.labels.length > (viewMode === 'detailed' ? 3 : 2) && (
            <span className="px-2 py-1 bg-secondary-100 text-secondary-700 rounded text-xs font-medium">
              +{task.labels.length - (viewMode === 'detailed' ? 3 : 2)}
            </span>
          )}
        </div>
      )}

      {/* Due Date - Only if exists */}
      {task.dueDate && (
        <div className={`flex items-center space-x-1 mb-3 text-xs ${
          isOverdue ? 'text-error' : 'text-text-secondary'
        }`}>
          <Icon name="Calendar" size={12} />
          <span>{new Date(task.dueDate).toLocaleDateString()}</span>
          {isOverdue && <Icon name="AlertCircle" size={12} color="var(--color-error)" />}
        </div>
      )}

      {/* Card Footer */}
      <div className="flex items-center justify-between">
        {/* Assignee */}
        <div className="flex items-center space-x-2">
          {task.assignee.avatar ? (
            <Image
              src={task.assignee.avatar}
              alt={task.assignee.name}
              className="w-6 h-6 rounded-full object-cover"
            />
          ) : (
            <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-xs font-medium text-primary-700">
                {task.assignee.initials}
              </span>
            </div>
          )}
          {viewMode === 'detailed' && (
            <span className="text-xs text-text-secondary truncate max-w-20">
              {task.assignee.name}
            </span>
          )}
        </div>

        {/* Metadata */}
        <div className="flex items-center space-x-3">
          {/* Story Points */}
          {task.storyPoints && (
            <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
              <span className="text-xs font-bold text-white">{task.storyPoints}</span>
            </div>
          )}

          {/* Attachments */}
          {task.attachments > 0 && (
            <div className="flex items-center space-x-1 text-text-secondary">
              <Icon name="Paperclip" size={12} />
              <span className="text-xs">{task.attachments}</span>
            </div>
          )}

          {/* Comments */}
          {task.comments > 0 && (
            <div className="flex items-center space-x-1 text-text-secondary">
              <Icon name="MessageCircle" size={12} />
              <span className="text-xs">{task.comments}</span>
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar - Only for In Progress tasks */}
      {task.status === 'In Progress' && viewMode === 'detailed' && (
        <div className="mt-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-text-secondary">Progress</span>
            <span className="text-xs text-text-secondary">65%</span>
          </div>
          <div className="w-full bg-secondary-200 rounded-full h-1.5">
            <div className="bg-primary h-1.5 rounded-full" style={{ width: '65%' }}></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KanbanCard;