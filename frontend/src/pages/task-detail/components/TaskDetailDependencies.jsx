import React from 'react';
import Icon from '../../../components/AppIcon';

const TaskDetailDependencies = ({ dependencies, navigate }) => {
  const handleTaskClick = (taskId) => {
    navigate(`/task-detail?id=${taskId}`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'To Do': return 'bg-secondary-100 text-secondary-700';
      case 'In Progress': return 'bg-primary-100 text-primary-700';
      case 'In Review': return 'bg-warning-100 text-warning-700';
      case 'Done': return 'bg-success-100 text-success-700';
      default: return 'bg-secondary-100 text-secondary-700';
    }
  };

  const getDependencyIcon = (type) => {
    return type === 'blocks' ? 'ArrowDown' : 'ArrowUp';
  };

  const getDependencyColor = (type) => {
    return type === 'blocks' ? 'text-error' : 'text-warning';
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        {dependencies.map((dependency) => (
          <div 
            key={dependency.id}
            className="p-4 border border-border rounded-lg hover:border-primary hover:shadow-sm transition-all duration-200 cursor-pointer"
            onClick={() => handleTaskClick(dependency.id)}
          >
            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-lg ${getDependencyColor(dependency.type)} bg-opacity-10`}>
                <Icon name={getDependencyIcon(dependency.type)} size={20} className={getDependencyColor(dependency.type)} />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-sm font-mono text-text-secondary">{dependency.id}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(dependency.status)}`}>
                    {dependency.status}
                  </span>
                </div>
                <p className="font-medium text-text-primary">{dependency.title}</p>
                <p className="text-sm text-text-secondary mt-2">
                  This task {dependency.type === 'blocks' ? 'blocks' : 'is blocked by'} the current task
                </p>
              </div>
              <Icon name="ChevronRight" size={20} className="text-secondary-400" />
            </div>
          </div>
        ))}
      </div>

      {/* Add Dependency Button */}
      <button className="w-full p-3 border border-dashed border-border rounded-lg flex items-center justify-center space-x-2 text-secondary-600 hover:bg-secondary-50 transition-colors duration-200">
        <Icon name="Link" size={16} />
        <span>Add Dependency</span>
      </button>

      {/* Dependency Visualization */}
      <div className="mt-8">
        <h3 className="text-sm font-medium text-text-primary mb-4">Dependency Graph</h3>
        <div className="p-6 bg-secondary-50 border border-border rounded-lg">
          <div className="flex flex-col items-center">
            {/* Blocked By */}
            {dependencies.filter(d => d.type === 'blocked by').length > 0 && (
              <div className="mb-4">
                <div className="flex flex-col items-center">
                  <div className="px-3 py-1 bg-warning-100 text-warning-700 rounded-full text-xs font-medium mb-2">
                    Blocked By
                  </div>
                  <div className="flex space-x-2">
                    {dependencies
                      .filter(d => d.type === 'blocked by')
                      .map(dependency => (
                        <div 
                          key={dependency.id}
                          className="px-3 py-1 bg-white border border-border rounded-lg text-sm cursor-pointer hover:border-primary transition-colors duration-200"
                          onClick={() => handleTaskClick(dependency.id)}
                        >
                          {dependency.id}
                        </div>
                      ))
                    }
                  </div>
                </div>
                <div className="h-6 w-px bg-border mx-auto my-2"></div>
              </div>
            )}

            {/* Current Task */}
            <div className="px-4 py-2 bg-primary-100 border border-primary rounded-lg text-primary-700 font-medium mb-4">
              {dependencies.length > 0 ? dependencies[0].id.split('-')[0] : 'TASK'}-123
            </div>

            {/* Blocks */}
            {dependencies.filter(d => d.type === 'blocks').length > 0 && (
              <div className="mt-2">
                <div className="h-6 w-px bg-border mx-auto my-2"></div>
                <div className="flex flex-col items-center">
                  <div className="px-3 py-1 bg-error-100 text-error-700 rounded-full text-xs font-medium mb-2">
                    Blocks
                  </div>
                  <div className="flex space-x-2">
                    {dependencies
                      .filter(d => d.type === 'blocks')
                      .map(dependency => (
                        <div 
                          key={dependency.id}
                          className="px-3 py-1 bg-white border border-border rounded-lg text-sm cursor-pointer hover:border-primary transition-colors duration-200"
                          onClick={() => handleTaskClick(dependency.id)}
                        >
                          {dependency.id}
                        </div>
                      ))
                    }
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailDependencies;