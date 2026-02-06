import React from 'react';
import Icon from '../../../components/AppIcon';

const UnacceptedTasks = ({ tasks, onAcceptTask }) => {
  if (!tasks || tasks.length === 0) {
    return null; // Or a message indicating no unaccepted tasks
  }

  return (
    <div className="bg-surface border border-border rounded-lg p-4 mb-4">
      <h3 className="text-lg font-semibold text-text-primary mb-3">Unaccepted Tasks</h3>
      <div className="space-y-3">
        {tasks.map(task => (
          <div key={task.id} className="flex items-center justify-between bg-secondary-50 p-3 rounded-md shadow-sm">
            <div className="flex-1">
              <p className="text-text-primary font-medium">{task.title}</p>
              <p className="text-sm text-secondary-600">Assigned to: {task.assignee ? task.assignee.name : 'Unassigned'}</p>
            </div>
            <button
              onClick={() => onAcceptTask(task.id)}
              className="ml-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors duration-200"
            >
              Accept
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UnacceptedTasks;