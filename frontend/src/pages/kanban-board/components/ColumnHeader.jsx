import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const ColumnHeader = ({ column, taskCount, wipLimit }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isWipLimitExceeded = wipLimit && taskCount > wipLimit;
  const isWipLimitWarning = wipLimit && taskCount === wipLimit;

  const getColumnIcon = (title) => {
    switch (title) {
      case 'Backlog': return 'Inbox';
      case 'In Progress': return 'Play';
      case 'Review': return 'Eye';
      case 'Done': return 'CheckCircle';
      default: return 'Circle';
    }
  };

  return (
    <div className="flex items-center justify-between p-4 mb-3 bg-surface border border-border rounded-lg">
      <div className="flex items-center space-x-3">
        {/* Column Icon */}
        <div 
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: column.color }}
        />
        
        {/* Column Title and Count */}
        <div className="flex items-center space-x-2">
          <Icon name={getColumnIcon(column.title)} size={16} color="#64748B" />
          <h3 className="font-medium text-text-primary">{column.title}</h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            isWipLimitExceeded 
              ? 'bg-error-100 text-error-700' 
              : isWipLimitWarning
                ? 'bg-warning-100 text-warning-700' :'bg-secondary-100 text-secondary-700'
          }`}>
            {taskCount}
            {wipLimit && ` / ${wipLimit}`}
          </span>
        </div>

        {/* WIP Limit Warning */}
        {isWipLimitExceeded && (
          <div className="flex items-center space-x-1 text-error">
            <Icon name="AlertTriangle" size={14} />
            <span className="text-xs font-medium">WIP Exceeded</span>
          </div>
        )}
      </div>

      {/* Column Actions */}
      <div className="relative">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-1 text-secondary-600 hover:text-text-primary hover:bg-secondary-100 rounded transition-colors duration-200"
        >
          <Icon name="MoreHorizontal" size={16} />
        </button>

        {/* Dropdown Menu */}
        {isMenuOpen && (
          <div className="absolute right-0 top-8 w-48 bg-surface border border-border rounded-lg shadow-lg z-50">
            <div className="py-2">
              <button className="w-full px-4 py-2 text-left text-sm text-text-primary hover:bg-secondary-50 transition-colors duration-150 flex items-center space-x-3">
                <Icon name="Plus" size={14} />
                <span>Add task</span>
              </button>
              <button className="w-full px-4 py-2 text-left text-sm text-text-primary hover:bg-secondary-50 transition-colors duration-150 flex items-center space-x-3">
                <Icon name="Settings" size={14} />
                <span>Column settings</span>
              </button>
              <button className="w-full px-4 py-2 text-left text-sm text-text-primary hover:bg-secondary-50 transition-colors duration-150 flex items-center space-x-3">
                <Icon name="BarChart3" size={14} />
                <span>View analytics</span>
              </button>
              <div className="border-t border-border my-1" />
              <button className="w-full px-4 py-2 text-left text-sm text-text-primary hover:bg-secondary-50 transition-colors duration-150 flex items-center space-x-3">
                <Icon name="Archive" size={14} />
                <span>Archive all done</span>
              </button>
            </div>
          </div>
        )}

        {/* Click outside to close */}
        {isMenuOpen && (
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsMenuOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default ColumnHeader;