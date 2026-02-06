import React from 'react';
import Icon from '../../../components/AppIcon';

const RecentActivity = ({ activities }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'task':
        return 'CheckSquare';
      case 'project':
        return 'Folder';
      case 'sprint':
        return 'Play';
      default:
        return 'Activity';
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'task':
        return 'text-primary';
      case 'project':
        return 'text-accent';
      case 'sprint':
        return 'text-success';
      default:
        return 'text-secondary';
    }
  };

  return (
    <div className="bg-surface border border-border rounded-lg">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-text-primary">Recent Activity</h3>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span className="text-xs text-text-secondary">Live</span>
            </div>
            <button className="p-1 text-secondary-600 hover:text-text-primary transition-colors duration-200">
              <Icon name="MoreHorizontal" size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {activities.map((activity, index) => (
          <div
            key={activity.id || index}
            className="p-4 border-b border-border-light last:border-b-0 hover:bg-secondary-50 transition-colors duration-150"
          >
            <div className="flex items-center space-x-3">
              <Icon
                name={getActivityIcon(activity.type)}
                size={20}
                className={getActivityColor(activity.type)}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary truncate">
                  {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}: {activity.name}
                </p>
                <span className="text-xs text-text-secondary">
                  {new Date(activity.createdAt).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-border">
        <button className="w-full text-sm text-primary hover:text-primary-700 transition-colors duration-200 flex items-center justify-center space-x-2">
          <Icon name="Eye" size={16} />
          <span>View All Activity</span>
        </button>
      </div>
    </div>
  );
};

export default RecentActivity;