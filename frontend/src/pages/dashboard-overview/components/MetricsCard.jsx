import React from 'react';
import Icon from '../../../components/AppIcon';

const MetricsCard = ({ title, value, icon, color, trend, onClick }) => {
  const getColorClasses = (color) => {
    switch (color) {
      case 'primary':
        return {
          bg: 'bg-primary-50',
          icon: 'bg-primary text-white',
          text: 'text-primary'
        };
      case 'secondary':
        return {
          bg: 'bg-secondary-50',
          icon: 'bg-secondary text-white',
          text: 'text-secondary'
        };
      case 'success':
        return {
          bg: 'bg-success-50',
          icon: 'bg-success text-white',
          text: 'text-success'
        };
      case 'warning':
        return {
          bg: 'bg-warning-50',
          icon: 'bg-warning text-white',
          text: 'text-warning-600'
        };
      case 'error':
        return {
          bg: 'bg-error-50',
          icon: 'bg-error text-white',
          text: 'text-error'
        };
      default:
        return {
          bg: 'bg-secondary-50',
          icon: 'bg-secondary text-white',
          text: 'text-secondary'
        };
    }
  };

  const colorClasses = getColorClasses(color);

  return (
    <div
      onClick={onClick}
      className={`${colorClasses.bg} border border-border rounded-lg p-6 transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:shadow-md hover:scale-105' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-text-secondary text-sm font-medium mb-2">{title}</p>
          <p className="text-3xl font-bold text-text-primary mb-1">{value}</p>
          {trend && (
            <p className={`text-sm ${colorClasses.text}`}>{trend}</p>
          )}
        </div>
        <div className={`w-12 h-12 ${colorClasses.icon} rounded-lg flex items-center justify-center`}>
          <Icon name={icon} size={24} />
        </div>
      </div>
    </div>
  );
};

export default MetricsCard;