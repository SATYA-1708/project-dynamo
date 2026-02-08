import React from 'react';
import Icon from '../../../components/AppIcon';

const TaskDetailHeader = ({ 
  task, 
  isEditing, 
  setIsEditing, 
  onClose, 
  onSave,
  onTitleChange,
  onStatusChange
}) => {
  const statusOptions = ['To Do', 'In Progress', 'In Review', 'Done'];

  const getStatusColor = (status) => {
    switch (status) {
      case 'To Do': return 'bg-secondary-100 text-secondary-700';
      case 'In Progress': return 'bg-primary-100 text-primary-700';
      case 'In Review': return 'bg-warning-100 text-warning-700';
      case 'Done': return 'bg-success-100 text-success-700';
      default: return 'bg-secondary-100 text-secondary-700';
    }
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between p-6 border-b border-border bg-secondary-50">
      <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
        <div className="flex items-center space-x-2 mb-4 md:mb-0">
          <Icon name="Square" size={20} color="#64748B" />
          <span className="text-sm font-mono text-text-secondary">{task.id}</span>
        </div>
        
        {isEditing ? (
          <input
            type="text"
            value={task.title}
            onChange={(e) => onTitleChange(e.target.value)}
            className="w-full md:w-auto text-xl font-semibold text-text-primary bg-white border border-border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
          />
        ) : (
          <h1 className="text-xl font-semibold text-text-primary">{task.title}</h1>
        )}
      </div>

      <div className="flex items-center space-x-3 mt-4 md:mt-0">
        {/* Status Dropdown */}
        <div className="relative">
          <select
            value={task.status}
            onChange={(e) => onStatusChange(e.target.value)}
            className={`appearance-none px-3 py-1.5 rounded-full text-sm font-medium ${getStatusColor(task.status)} border border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500`}
          >
            {statusOptions.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
            <Icon name="ChevronDown" size={14} />
          </div>
        </div>

        {/* Edit/Save Button */}
        {isEditing ? (
          <button
            onClick={onSave}
            className="p-2 text-success hover:text-success-600 hover:bg-success-50 rounded-lg transition-colors duration-200"
            aria-label="Save changes"
          >
            <Icon name="Save" size={20} />
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 text-secondary-600 hover:text-text-primary hover:bg-secondary-100 rounded-lg transition-colors duration-200"
            aria-label="Edit task"
          >
            <Icon name="Edit" size={20} />
          </button>
        )}

        {/* Close Button */}
        <button
          onClick={onClose}
          className="p-2 text-secondary-600 hover:text-text-primary hover:bg-secondary-100 rounded-lg transition-colors duration-200"
          aria-label="Close task details"
        >
          <Icon name="X" size={20} />
        </button>
      </div>
    </div>
  );
};

export default TaskDetailHeader;