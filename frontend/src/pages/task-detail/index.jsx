import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import CommandPalette from '../../components/ui/CommandPalette';
import PageHeader from '../../components/ui/PageHeader';
import Icon from '../../components/AppIcon';
import TaskDetailHeader from './components/TaskDetailHeader';
import TaskDetailContent from './components/TaskDetailContent';
import TaskDetailSidebar from './components/TaskDetailSidebar';
import TaskDetailComments from './components/TaskDetailComments';
import TaskDetailAttachments from './components/TaskDetailAttachments';
import TaskDetailDependencies from './components/TaskDetailDependencies';


const TaskDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('description');
  const [isEditing, setIsEditing] = useState(false);
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  // Extract task ID from URL query parameters
  const queryParams = new URLSearchParams(location.search);
  const taskId = queryParams.get('id') || 'TASK-123';

  useEffect(() => {
    const fetchTaskDetails = async () => {
      setLoading(true);
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
          createdDate: data.createdDate,
          // Keep other necessary fields if they are used elsewhere, or remove them if not.
          // For now, assuming these are the only ones needed for display based on the prompt.
          comments: data.comments || [], // Assuming comments might still be needed for the comments section
          attachments: data.attachments || [], // Assuming attachments might still be needed
          dependencies: data.dependencies || [], // Assuming dependencies might still be needed
          title: data.title, // Title is used in PageHeader and TaskDetailHeader
          description: data.description, // Description is used in TaskDetailContent
        });
      } catch (error) {
        console.error('Error fetching task details:', error);
        setTask(null); // Set task to null on error to display 'Task Not Found'
      } finally {
        setLoading(false);
      }
    };

    if (taskId && taskId !== 'TASK-123') { // Only fetch if a real taskId is present
      fetchTaskDetails();
    } else {
      setLoading(false);
      setTask(null); // No valid task ID, so no task to display
    }
  }, [taskId]);

  const handleClose = () => {
    navigate('/kanban-board');
  };

  const handleSave = () => {
    // In a real app, this would save changes to the API
    setIsEditing(false);
    // Show success toast or notification
  };

  const handleStatusChange = (newStatus) => {
    setTask(prev => ({ ...prev, status: newStatus }));
  };

  const handlePriorityChange = (newPriority) => {
    setTask(prev => ({ ...prev, priority: newPriority }));
  };

  const handleAssigneeChange = (newAssignee) => {
    setTask(prev => ({ ...prev, assignee: newAssignee }));
  };

  const handleTitleChange = (newTitle) => {
    setTask(prev => ({ ...prev, title: newTitle }));
  };

  const handleDescriptionChange = (newDescription) => {
    setTask(prev => ({ ...prev, description: newDescription }));
  };

  const handleAddComment = (comment) => {
    const newComment = {
      id: Date.now(),
      author: 'John Doe',
      avatar: 'JD',
      content: comment,
      timestamp: new Date().toLocaleString(),
      isNew: true
    };

    setTask(prev => ({
      ...prev,
      comments: [newComment, ...prev.comments]
    }));
  };

  const handleAddAttachment = (attachment) => {
    const newAttachment = {
      id: Date.now(),
      name: attachment.name,
      size: `${Math.round(attachment.size / 1024)} KB`,
      type: attachment.type.startsWith('image/') ? 'image' : 'document',
      url: URL.createObjectURL(attachment)
    };

    setTask(prev => ({
      ...prev,
      attachments: [newAttachment, ...prev.attachments]
    }));
  };






  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex">
          <Sidebar />
          <div className="flex-1 pt-16 pl-60">
            <div className="flex items-center justify-center h-screen">
              <div className="flex flex-col items-center">
                <Icon name="Loader" size={48} className="animate-spin text-primary mb-4" />
                <p className="text-text-secondary">Loading task details...</p>
              </div>
            </div>
          </div>
        </div>
        <CommandPalette />
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex">
          <Sidebar />
          <div className="flex-1 pt-16 pl-60">
            <div className="flex items-center justify-center h-screen">
              <div className="text-center">
                <Icon name="AlertTriangle" size={48} className="text-warning mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-text-primary mb-2">Task Not Found</h2>
                <p className="text-text-secondary mb-6">The task you're looking for doesn't exist or has been moved.</p>
                <button 
                  onClick={() => navigate('/kanban-board')}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
                >
                  Return to Kanban Board
                </button>
              </div>
            </div>
          </div>
        </div>
        <CommandPalette />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 pt-16 pl-60">
        <div className="p-6">
          {/* Page Header */}
          <PageHeader 
            title={`Task Details - ${task?.title || 'Loading...'}`}
            description="View and manage task information"
            actions={
              <>
                <button className="px-4 py-2 bg-secondary-100 text-secondary-700 rounded-lg hover:bg-secondary-200 transition-colors duration-200 flex items-center space-x-2">
                  <Icon name="Copy" size={16} />
                  <span>Duplicate</span>
                </button>
                <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 flex items-center space-x-2">
                  <Icon name="Edit" size={16} />
                  <span>Edit Task</span>
                </button>
              </>
            }
          />
          <div className="max-w-7xl mx-auto">
            <div className="bg-surface border border-border rounded-lg shadow-sm overflow-hidden">
              {/* Task Detail Header */}
              <TaskDetailHeader 
                task={task}
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                onClose={handleClose}
                onSave={handleSave}
                onTitleChange={handleTitleChange}
                onStatusChange={handleStatusChange}
              />

              {/* Task Detail Content */}
              <div className="flex flex-col lg:flex-row">
                {/* Main Content Area (70%) */}
                <div className="w-full lg:w-8/12 p-6 border-r border-border">
                  {/* Tabs */}
                  <div className="border-b border-border mb-6">
                    <nav className="flex space-x-8">
                      {['description', 'comments', 'attachments', 'dependencies'].map((tab) => (
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
                  {activeTab === 'description' && (
                    <TaskDetailContent 
                      task={task} 
                      isEditing={isEditing} 
                      onDescriptionChange={handleDescriptionChange} 
                    />
                  )}

                  {activeTab === 'comments' && (
                    <TaskDetailComments 
                      comments={task.comments} 
                      onAddComment={handleAddComment} 
                    />
                  )}

                  {activeTab === 'attachments' && (
                    <TaskDetailAttachments 
                      attachments={task.attachments} 
                      onAddAttachment={handleAddAttachment} 
                    />
                  )}

                  {activeTab === 'dependencies' && (
                    <TaskDetailDependencies 
                      dependencies={task.dependencies} 
                      navigate={navigate} 
                    />
                  )}
                </div>

                {/* Sidebar (30%) */}
                <div className="w-full lg:w-4/12 p-6 bg-secondary-50">
                  <TaskDetailSidebar 
                    task={task} 
                    onPriorityChange={handlePriorityChange}
                    onAssigneeChange={handleAssigneeChange}
                  />
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>
      <CommandPalette />
    </div>
  );
};

export default TaskDetail;