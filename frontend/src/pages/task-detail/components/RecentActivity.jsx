import React from 'react';
import Icon from '../../../components/AppIcon';

const RecentActivity = ({ activity }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'status_change': return 'ArrowRightCircle';
      case 'comment_added': return 'MessageSquare';
      case 'attachment_added': return 'Paperclip';
      case 'description_updated': return 'FileText';
      case 'points_updated': return 'Hash';
      default: return 'Clock';
    }
  };

  const getActivityText = (item) => {
    switch (item.type) {
      case 'status_change':
        return `changed status from ${item.from} to ${item.to}`;
      case 'comment_added':
        return 'added a comment';
      case 'attachment_added':
        return `attached ${item.attachment}`;
      case 'description_updated':
        return 'updated the description';
      case 'points_updated':
        return `changed story points from ${item.from} to ${item.to}`;
      default:
        return 'made a change';
    }
  };

  return (
    <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
      {activity.map((item) => (
        <div key={item.id} className="flex space-x-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-secondary-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-secondary-700">{item.avatar}</span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start">
              <div className="flex-1">
                <p className="text-sm text-text-primary">
                  <span className="font-medium">{item.user}</span>{' '}
                  {getActivityText(item)}
                </p>
                <p className="text-xs text-text-secondary mt-1">{item.timestamp}</p>
              </div>
              <div className="ml-2 mt-1">
                <Icon name={getActivityIcon(item.type)} size={14} color="#64748B" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentActivity;