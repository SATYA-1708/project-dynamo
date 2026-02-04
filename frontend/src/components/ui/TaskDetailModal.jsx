import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';

const TaskDetailModal = ({ isOpen, onClose, taskId }) => {
  const [task, setTask] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('details');



  useEffect(() => {
    if (isOpen && taskId) {
      const fetchTaskDetails = async () => {
        try {
          const response = await fetch(`/api/tasks/${taskId}`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setTask({
            name: data.name,
            details: data.details,
            status: data.status,
            priority: data.priority,
            assignee: data.assignee,
            project: data.project,
            sprint: data.sprint,
            dueDate: data.dueDate,
            createdAt: data.createdAt,
            // Keep other necessary fields if they are used elsewhere, or remove them if not.
            comments: data.comments || [],
            attachments: data.attachments || [],
            dependencies: data.dependencies || [],
            title: data.title,
            description: data.description,
            id: data.id,
            reporter: data.reporter,
            storyPoints: data.storyPoints,
            labels: data.labels,
            updatedAt: data.updatedAt,
            timeTracking: data.timeTracking
          });
        } catch (error) {
          console.error('Error fetching task details:', error);
          setTask(null);
        }
      };
      fetchTaskDetails();
    }
  }, [isOpen, taskId]);

  const handleClose = () => {
    setIsEditing(false);
    setActiveTab('details');
    onClose();
  };

  const handleStatusChange = (newStatus) => {
    setTask(prev => ({ ...prev, status: newStatus }));
  };

  const handlePriorityChange = (newPriority) => {
    setTask(prev => ({ ...prev, priority: newPriority }));
  };

  const statusOptions = ['To Do', 'In Progress', 'In Review', 'Done'];
  const priorityOptions = ['Low', 'Medium', 'High', 'Critical'];

  const getStatusColor = (status) => {
    switch (status) {
      case 'To Do': return 'bg-secondary-100 text-secondary-700';
      case 'In Progress': return 'bg-primary-100 text-primary-700';
      case 'In Review': return 'bg-warning-100 text-warning-700';
      case 'Done': return 'bg-success-100 text-success-700';
      default: return 'bg-secondary-100 text-secondary-700';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Low': return 'bg-secondary-100 text-secondary-700';
      case 'Medium': return 'bg-warning-100 text-warning-700';
      case 'High': return 'bg-error-100 text-error-700';
      case 'Critical': return 'bg-error text-white';
      default: return 'bg-secondary-100 text-secondary-700';
    }
  };

  if (!isOpen || !task) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-200 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl max-h-[90vh] bg-surface rounded-lg shadow-xl border border-border overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Icon name="Square" size={20} color="#64748B" />
              <span className="text-sm font-mono text-text-secondary">{task.id}</span>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
              {task.status}
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
              {task.priority}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="p-2 text-secondary-600 hover:text-text-primary hover:bg-secondary-100 rounded-lg transition-colors duration-200"
            >
              <Icon name={isEditing ? "X" : "Edit"} size={20} />
            </button>
            <button
              onClick={handleClose}
              className="p-2 text-secondary-600 hover:text-text-primary hover:bg-secondary-100 rounded-lg transition-colors duration-200"
            >
              <Icon name="X" size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex h-[calc(90vh-120px)]">
          {/* Main Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              {/* Title */}
              <div className="mb-6">
                {isEditing ? (
                  <input
                    type="text"
                    value={task.title}
                    onChange={(e) => setTask(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full text-2xl font-semibold text-text-primary bg-transparent border-b border-border focus:border-primary outline-none pb-2"
                  />
                ) : (
                  <h1 className="text-2xl font-semibold text-text-primary">{task.title}</h1>
                )}
              </div>

              {/* Tabs */}
              <div className="border-b border-border mb-6">
                <nav className="flex space-x-8">
                  {['details', 'comments', 'attachments'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                        activeTab === tab
                          ? 'border-primary text-primary' :'border-transparent text-text-secondary hover:text-text-primary'
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              {activeTab === 'details' && (
                <div className="space-y-6">
                  {/* Description */}
                  <div>
                    <h3 className="text-sm font-medium text-text-primary mb-3">Description</h3>
                    {isEditing ? (
                      <textarea
                        value={task.description}
                        onChange={(e) => setTask(prev => ({ ...prev, description: e.target.value }))}
                        rows={4}
                        className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                      />
                    ) : (
                      <p className="text-text-secondary leading-relaxed">{task.description}</p>
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
                    </div>
                  </div>

                  {/* Time Tracking */}
                  <div>
                    <h3 className="text-sm font-medium text-text-primary mb-3">Time Tracking</h3>
                    <div className="grid grid-cols-3 gap-4">
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
                  </div>
                </div>
              )}

              {activeTab === 'comments' && (
                <div className="space-y-4">
                  {/* Add Comment */}
                  <div className="border border-border rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-primary-700">JD</span>
                      </div>
                      <div className="flex-1">
                        <textarea
                          placeholder="Add a comment..."
                          rows={3}
                          className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                        />
                        <div className="flex justify-end mt-3">
                          <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors duration-200">
                            Add Comment
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Comments List */}
                  {task.comments.map((comment) => (
                    <div key={comment.id} className="flex items-start space-x-3 p-4 border border-border rounded-lg">
                      <div className="w-8 h-8 bg-secondary-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-secondary-700">{comment.avatar}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-medium text-text-primary">{comment.author}</span>
                          <span className="text-xs text-text-secondary">{comment.timestamp}</span>
                        </div>
                        <p className="text-text-secondary">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'attachments' && (
                <div className="space-y-4">
                  {/* Upload Area */}
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                    <Icon name="Upload" size={48} color="#CBD5E1" className="mx-auto mb-4" />
                    <p className="text-text-secondary mb-2">Drag and drop files here, or click to browse</p>
                    <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors duration-200">
                      Choose Files
                    </button>
                  </div>

                  {/* Attachments List */}
                  {task.attachments.map((attachment) => (
                    <div key={attachment.id} className="flex items-center space-x-3 p-4 border border-border rounded-lg">
                      <div className="w-10 h-10 bg-secondary-100 rounded-lg flex items-center justify-center">
                        <Icon name={attachment.type === 'image' ? 'Image' : 'FileText'} size={20} color="#64748B" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-text-primary">{attachment.name}</p>
                        <p className="text-sm text-text-secondary">{attachment.size}</p>
                      </div>
                      <button className="p-2 text-secondary-600 hover:text-text-primary hover:bg-secondary-100 rounded-lg transition-colors duration-200">
                        <Icon name="Download" size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-80 border-l border-border bg-secondary-50 p-6 overflow-y-auto">
            <div className="space-y-6">
              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Status</label>
                <select
                  value={task.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="w-full p-2 border border-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  {statusOptions.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Priority</label>
                <select
                  value={task.priority}
                  onChange={(e) => handlePriorityChange(e.target.value)}
                  className="w-full p-2 border border-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  {priorityOptions.map(priority => (
                    <option key={priority} value={priority}>{priority}</option>
                  ))}
                </select>
              </div>

              {/* Assignee */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Assignee</label>
                <div className="flex items-center space-x-3 p-3 border border-border rounded-lg">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-primary-700">{task.assignee.avatar}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-primary">{task.assignee.name}</p>
                    <p className="text-xs text-text-secondary">{task.assignee.email}</p>
                  </div>
                </div>
              </div>

              {/* Reporter */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Reporter</label>
                <div className="flex items-center space-x-3 p-3 border border-border rounded-lg">
                  <div className="w-8 h-8 bg-secondary-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-secondary-700">{task.reporter.avatar}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-primary">{task.reporter.name}</p>
                    <p className="text-xs text-text-secondary">{task.reporter.email}</p>
                  </div>
                </div>
              </div>

              {/* Project & Sprint */}
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Project</label>
                  <p className="text-sm text-text-secondary">{task.project}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Sprint</label>
                  <p className="text-sm text-text-secondary">{task.sprint}</p>
                </div>
              </div>

              {/* Story Points */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Story Points</label>
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-lg font-bold text-white">{task.storyPoints}</span>
                </div>
              </div>

              {/* Dates */}
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">Due Date</label>
                  <p className="text-sm text-text-secondary">{task.dueDate}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">Created</label>
                  <p className="text-sm text-text-secondary">{task.createdAt}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">Updated</label>
                  <p className="text-sm text-text-secondary">{task.updatedAt}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Click outside to close */}
      <div 
        className="absolute inset-0 -z-10" 
        onClick={handleClose}
      />
    </div>
  );
};

export default TaskDetailModal;