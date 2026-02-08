import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import MarkdownRenderer from './MarkdownRenderer';
import MarkdownEditor from './MarkdownEditor';

const TaskDetailContent = ({ task, isEditing, onDescriptionChange }) => {
  const [showFigma, setShowFigma] = useState(false);
  const [showLoom, setShowLoom] = useState(false);

  return (
    <div className="space-y-6">
      {/* Description */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-text-primary">Description</h3>
          {!isEditing && (
            <div className="flex space-x-2">
              <button 
                onClick={() => setShowFigma(!showFigma)}
                className={`flex items-center space-x-1 px-3 py-1 rounded-md text-xs font-medium ${
                  showFigma ? 'bg-primary-100 text-primary-700' : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
                } transition-colors duration-200`}
              >
                <Icon name="Figma" size={14} />
                <span>Figma</span>
              </button>
              <button 
                onClick={() => setShowLoom(!showLoom)}
                className={`flex items-center space-x-1 px-3 py-1 rounded-md text-xs font-medium ${
                  showLoom ? 'bg-primary-100 text-primary-700' : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
                } transition-colors duration-200`}
              >
                <Icon name="Video" size={14} />
                <span>Loom</span>
              </button>
            </div>
          )}
        </div>

        {isEditing ? (
          <MarkdownEditor 
            value={task.description} 
            onChange={onDescriptionChange} 
          />
        ) : (
          <div className="space-y-6">
            <MarkdownRenderer content={task.description} />
            
            {/* Figma Embed */}
            {showFigma && task.figmaEmbed && (
              <div className="mt-6 border border-border rounded-lg overflow-hidden">
                <div className="bg-secondary-50 px-4 py-2 border-b border-border flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Icon name="Figma" size={16} color="#64748B" />
                    <span className="text-sm font-medium text-text-primary">Figma Design</span>
                  </div>
                  <button 
                    onClick={() => setShowFigma(false)}
                    className="p-1 text-secondary-600 hover:text-text-primary hover:bg-secondary-100 rounded transition-colors duration-200"
                  >
                    <Icon name="X" size={14} />
                  </button>
                </div>
                <div className="h-96 w-full">
                  <iframe 
                    src={task.figmaEmbed} 
                    className="w-full h-full" 
                    allowFullScreen
                    title="Figma Design"
                  />
                </div>
              </div>
            )}
            
            {/* Loom Video */}
            {showLoom && task.loomVideo && (
              <div className="mt-6 border border-border rounded-lg overflow-hidden">
                <div className="bg-secondary-50 px-4 py-2 border-b border-border flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Icon name="Video" size={16} color="#64748B" />
                    <span className="text-sm font-medium text-text-primary">Loom Video</span>
                  </div>
                  <button 
                    onClick={() => setShowLoom(false)}
                    className="p-1 text-secondary-600 hover:text-text-primary hover:bg-secondary-100 rounded transition-colors duration-200"
                  >
                    <Icon name="X" size={14} />
                  </button>
                </div>
                <div className="h-96 w-full">
                  <iframe 
                    src={task.loomVideo} 
                    className="w-full h-full" 
                    allowFullScreen
                    title="Loom Video"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Labels */}
      <div>
        <h3 className="text-sm font-medium text-text-primary mb-3">Labels</h3>
        <div className="flex flex-wrap gap-2">
          {task.labels.map((label, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-secondary-100 text-secondary-700 rounded-full text-xs font-medium"
            >
              {label}
            </span>
          ))}
          {isEditing && (
            <button className="px-3 py-1 bg-secondary-50 text-secondary-500 rounded-full text-xs font-medium border border-dashed border-secondary-300 hover:bg-secondary-100 transition-colors duration-200">
              <Icon name="Plus" size={12} className="inline mr-1" />
              Add Label
            </button>
          )}
        </div>
      </div>

      {/* Time Tracking */}
      <div>
        <h3 className="text-sm font-medium text-text-primary mb-3">Time Tracking</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-3 bg-secondary-50 rounded-lg">
            <p className="text-xs text-text-secondary">Estimated</p>
            <p className="text-lg font-semibold text-text-primary">{task.timeTracking.estimated}</p>
          </div>
          <div className="text-center p-3 bg-primary-50 rounded-lg">
            <p className="text-xs text-text-secondary">Logged</p>
            <p className="text-lg font-semibold text-primary">{task.timeTracking.logged}</p>
          </div>
          <div className="text-center p-3 bg-warning-50 rounded-lg">
            <p className="text-xs text-text-secondary">Remaining</p>
            <p className="text-lg font-semibold text-warning-600">{task.timeTracking.remaining}</p>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-3">
          <div className="w-full h-2 bg-secondary-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full"
              style={{ 
                width: `${(parseInt(task.timeTracking.logged) / (parseInt(task.timeTracking.logged) + parseInt(task.timeTracking.remaining))) * 100}%` 
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailContent;