import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const ActivityLog = () => {
  // Mock activity log data
  const activityLogs = [
    {
      id: 1,
      user: {
        name: "Sarah Johnson",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg"
      },
      action: "added",
      target: "Michael Rodriguez",
      details: "as a Member to the workspace",
      timestamp: "Today at 2:34 PM",
      icon: "UserPlus",
      iconColor: "var(--color-success)"
    },
    {
      id: 2,
      user: {
        name: "Emily Chen",
        avatar: "https://randomuser.me/api/portraits/women/63.jpg"
      },
      action: "changed",
      target: "Jessica Taylor",
      details: "role from Member to Viewer",
      timestamp: "Yesterday at 11:15 AM",
      icon: "Shield",
      iconColor: "var(--color-primary)"
    },
    {
      id: 3,
      user: {
        name: "Sarah Johnson",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg"
      },
      action: "updated",
      target: "workspace settings",
      details: "changed workspace name from \'Project X\' to \'TaskFlow Pro'",
      timestamp: "Feb 27, 2024 at 9:22 AM",
      icon: "Settings",
      iconColor: "var(--color-secondary)"
    },
    {
      id: 4,
      user: {
        name: "David Kim",
        avatar: "https://randomuser.me/api/portraits/men/11.jpg"
      },
      action: "connected",
      target: "GitHub integration",
      details: "to repository \'taskflow/backend'",
      timestamp: "Feb 25, 2024 at 3:45 PM",
      icon: "Github",
      iconColor: "var(--color-text-primary)"
    },
    {
      id: 5,
      user: {
        name: "Emily Chen",
        avatar: "https://randomuser.me/api/portraits/women/63.jpg"
      },
      action: "removed",
      target: "Alex Thompson",
      details: "from the workspace",
      timestamp: "Feb 23, 2024 at 10:30 AM",
      icon: "UserMinus",
      iconColor: "var(--color-error)"
    },
    {
      id: 6,
      user: {
        name: "Sarah Johnson",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg"
      },
      action: "invited",
      target: "3 new members",
      details: "to join the workspace",
      timestamp: "Feb 20, 2024 at 2:15 PM",
      icon: "Mail",
      iconColor: "var(--color-warning)"
    },
    {
      id: 7,
      user: {
        name: "Robert Wilson",
        avatar: "https://randomuser.me/api/portraits/men/83.jpg"
      },
      action: "connected",
      target: "Slack integration",
      details: "to channel #project-updates",
      timestamp: "Feb 18, 2024 at 11:05 AM",
      icon: "MessageSquare",
      iconColor: "#4A154B" // Slack purple
    }
  ];

  // Group activities by date
  const groupedActivities = activityLogs.reduce((groups, activity) => {
    const date = activity.timestamp.includes('Today') 
      ? 'Today' : activity.timestamp.includes('Yesterday')
        ? 'Yesterday' : activity.timestamp.split(' at ')[0];
    
    if (!groups[date]) {
      groups[date] = [];
    }
    
    groups[date].push(activity);
    return groups;
  }, {});

  return (
    <div className="bg-surface border border-border rounded-lg overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-text-primary">Activity Log</h3>
          <div className="flex items-center space-x-2">
            <button className="p-2 text-secondary-600 hover:text-text-primary hover:bg-secondary-100 rounded-lg transition-colors duration-200">
              <Icon name="Filter" size={16} />
            </button>
            <button className="p-2 text-secondary-600 hover:text-text-primary hover:bg-secondary-100 rounded-lg transition-colors duration-200">
              <Icon name="Download" size={16} />
            </button>
          </div>
        </div>

        {/* Activity Timeline */}
        <div className="space-y-8">
          {Object.entries(groupedActivities).map(([date, activities]) => (
            <div key={date}>
              <h4 className="text-sm font-medium text-text-secondary mb-4">{date}</h4>
              <div className="space-y-6">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex">
                    <div className="flex-shrink-0 mr-4">
                      <div className="relative">
                        <Image 
                          src={activity.user.avatar} 
                          alt={activity.user.name} 
                          className="h-10 w-10 rounded-full object-cover border-2 border-surface"
                        />
                        <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-surface rounded-full flex items-center justify-center border-2 border-surface">
                          <Icon name={activity.icon} size={12} color={activity.iconColor} />
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-text-primary">
                        <span className="font-medium">{activity.user.name}</span>
                        {' '}
                        <span className="text-text-secondary">{activity.action}</span>
                        {' '}
                        <span className="font-medium">{activity.target}</span>
                        {' '}
                        <span className="text-text-secondary">{activity.details}</span>
                      </p>
                      <p className="text-xs text-text-secondary mt-1">
                        {activity.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        <div className="mt-8 text-center">
          <button className="px-4 py-2 border border-border rounded-lg text-text-secondary hover:text-text-primary hover:bg-secondary-50 transition-colors duration-200 text-sm flex items-center justify-center mx-auto">
            <Icon name="ChevronDown" size={16} className="mr-2" />
            Load More Activity
          </button>
        </div>
      </div>

      {/* Empty State - Shown when no activity logs */}
      {activityLogs.length === 0 && (
        <div className="p-8 text-center">
          <Icon name="Clock" size={48} color="#CBD5E1" className="mx-auto mb-4" />
          <p className="text-text-primary font-medium mb-2">No activity yet</p>
          <p className="text-text-secondary mb-6">Team activity will appear here as members take actions</p>
        </div>
      )}
    </div>
  );
};

export default ActivityLog;