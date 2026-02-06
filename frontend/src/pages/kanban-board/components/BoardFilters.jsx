import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const BoardFilters = ({ filters, onFiltersChange, tasks }) => {
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);

  const uniqueAssignees = [...new Set(tasks.map(task => task.assignee ? task.assignee.name : 'Unassigned'))];
  const uniquePriorities = ['Low', 'Medium', 'High', 'Critical'];

  const handleFilterChange = (filterType, value) => {
    onFiltersChange({
      ...filters,
      [filterType]: value
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      assignee: 'all',
      priority: 'all',
      sprint: 'all',
      search: ''
    });
  };

  const activeFiltersCount = Object.values(filters).filter(value => 
    value !== 'all' && value !== ''
  ).length;

  return (
    <div className="bg-surface border border-border rounded-lg p-4">
      {/* Search and Quick Filters */}
      <div className="flex items-center space-x-4 mb-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Icon 
            name="Search" 
            size={16} 
            color="#64748B" 
            className="absolute left-3 top-1/2 transform -translate-y-1/2" 
          />
          <input
            type="text"
            placeholder="Search tasks..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
          />
          {filters.search && (
            <button
              onClick={() => handleFilterChange('search', '')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-400 hover:text-text-primary"
            >
              <Icon name="X" size={16} />
            </button>
          )}
        </div>

        {/* Quick Filter Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors duration-200 ${
              isFiltersExpanded || activeFiltersCount > 0
                ? 'bg-primary text-white' :'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
            }`}
          >
            <Icon name="Filter" size={16} />
            <span className="text-sm">Filters</span>
            {activeFiltersCount > 0 && (
              <span className="bg-white text-primary text-xs px-1.5 py-0.5 rounded-full font-medium">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {activeFiltersCount > 0 && (
            <button
              onClick={clearAllFilters}
              className="px-3 py-2 text-sm text-secondary-600 hover:text-text-primary transition-colors duration-200"
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* Expanded Filters */}
      {isFiltersExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-border">
          {/* Assignee Filter */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Assignee
            </label>
            <select
              value={filters.assignee}
              onChange={(e) => handleFilterChange('assignee', e.target.value)}
              className="w-full p-2 border border-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
            >
              <option value="all">All assignees</option>
              {uniqueAssignees.map(assignee => (
                <option key={assignee} value={assignee}>{assignee}</option>
              ))}
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Priority
            </label>
            <select
              value={filters.priority}
              onChange={(e) => handleFilterChange('priority', e.target.value)}
              className="w-full p-2 border border-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
            >
              <option value="all">All priorities</option>
              {uniquePriorities.map(priority => (
                <option key={priority} value={priority}>{priority}</option>
              ))}
            </select>
          </div>

          {/* Sprint Filter */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Sprint
            </label>
            <select
              value={filters.sprint}
              onChange={(e) => handleFilterChange('sprint', e.target.value)}
              className="w-full p-2 border border-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
            >
              <option value="all">All sprints</option>
              <option value="current">Current Sprint</option>
              <option value="sprint-12">Sprint 12</option>
              <option value="sprint-11">Sprint 11</option>
              <option value="backlog">Backlog</option>
            </select>
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border">
          {filters.assignee !== 'all' && (
            <div className="flex items-center space-x-2 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
              <span>Assignee: {filters.assignee}</span>
              <button
                onClick={() => handleFilterChange('assignee', 'all')}
                className="hover:text-primary-900"
              >
                <Icon name="X" size={14} />
              </button>
            </div>
          )}
          
          {filters.priority !== 'all' && (
            <div className="flex items-center space-x-2 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
              <span>Priority: {filters.priority}</span>
              <button
                onClick={() => handleFilterChange('priority', 'all')}
                className="hover:text-primary-900"
              >
                <Icon name="X" size={14} />
              </button>
            </div>
          )}
          
          {filters.sprint !== 'all' && (
            <div className="flex items-center space-x-2 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
              <span>Sprint: {filters.sprint}</span>
              <button
                onClick={() => handleFilterChange('sprint', 'all')}
                className="hover:text-primary-900"
              >
                <Icon name="X" size={14} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BoardFilters;