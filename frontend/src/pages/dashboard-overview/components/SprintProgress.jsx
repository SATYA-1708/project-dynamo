import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Icon from '../../../components/AppIcon';

const SprintProgress = ({ sprintData, onViewDetails }) => {
  const { currentSprint, velocityData = [] } = sprintData || {};

  if (!currentSprint || currentSprint.message) {
    return (
      <div className="bg-surface border border-border rounded-lg p-6 text-center text-text-secondary">
        <p className="text-lg font-semibold mb-2">No current sprints</p>
        <p>Create a new sprint to see its progress here.</p>
      </div>
    );
  }

  const completionPercentage = Math.round(currentSprint.progress || 0);

  const formatTooltip = (value, name) => {
    if (name === 'ideal') return [`${value} points`, 'Ideal Burndown'];
    if (name === 'actual') return [`${value} points`, 'Actual Progress'];
    return [value, name];
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-surface border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-text-primary mb-2">{`Day ${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {formatTooltip(entry.value, entry.dataKey)[1]}: {formatTooltip(entry.value, entry.dataKey)[0]}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-surface border border-border rounded-lg">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-text-primary">Sprint Progress</h3>
          <button
            onClick={onViewDetails}
            className="text-primary hover:text-primary-700 transition-colors duration-200 flex items-center space-x-1"
          >
            <span className="text-sm">View Details</span>
            <Icon name="ExternalLink" size={14} />
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Current Sprint Overview */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-text-primary">{currentSprint.name}</h4>
            <span className="text-sm text-text-secondary">
              {currentSprint.remainingDays} days remaining
            </span>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-text-secondary">
              </span>
              <span className="text-sm font-medium text-text-primary">{completionPercentage}%</span>
            </div>
            <div className="w-full bg-secondary-200 rounded-full h-3">
              <div
                className="bg-primary h-3 rounded-full transition-all duration-300"
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Sprint Stats */}
          
        </div>

      
      </div>
    </div>
  );
};

export default SprintProgress;