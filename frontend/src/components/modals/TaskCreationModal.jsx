import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TaskCreationModal = ({ isOpen, onClose, onTaskCreated }) => {
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [priority, setPriority] = useState('Medium'); // Default to Medium priority
  const [projectId, setProjectId] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchProjectsForSelection();
    }
  }, [isOpen]);

  const fetchProjectsForSelection = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_RENDER_BACKEND_URL}/api/projects`);
      setProjects(response.data);
      if (response.data.length > 0) {
        setProjectId(response.data[0]._id); // Select the first project by default
      }
    } catch (err) {
      console.error('Error fetching projects for selection:', err);
      setError('Failed to load projects.');
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setError('');
    if (!taskName.trim()) {
      setError('Task name cannot be empty.');
      return;
    }
    if (!taskDescription.trim()) {
      setError('Task description cannot be empty.');
      return;
    }
    if (!deadline) {
      setError('Deadline cannot be empty.');
      return;
    }
    if (!projectId) {
      setError('Please select a project.');
      return;
    }

    try {
      await axios.post(`${import.meta.env.VITE_RENDER_BACKEND_URL}/api/projects/${projectId}/tasks`, {
        taskName,
        taskDescription,
        dueDate: deadline,
        priority,
        assignedTo
      });
      setTaskName('');
      setTaskDescription('');
      setDeadline('');
      setPriority('Medium'); // Reset to default priority
      setProjectId(projects.length > 0 ? projects[0]._id : ''); // Reset to first project or empty
      setAssignedTo('');
      onTaskCreated(); // Callback to refresh project list in parent
      onClose(); // Close modal
    } catch (err) {
      console.error('Error creating task:', err);
      setError(err.response?.data?.message || 'Failed to create task.');
    }
  };


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Create New Task</h2>
        {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}
        <form onSubmit={handleCreateTask}>
          <div className="mb-4">
            <label htmlFor="taskName" className="block text-gray-700 text-sm font-semibold mb-2">Task Name:</label>
            <input
              type="text"
              id="taskName"
              className="shadow-sm appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              placeholder="Enter task name"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="taskDescription" className="block text-gray-700 text-sm font-semibold mb-2">Task Description:</label>
            <textarea
              id="taskDescription"
              className="shadow-sm appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              placeholder="Enter task description"
              rows="3"
              required
            ></textarea>
          </div>
          <div className="mb-6">
            <label htmlFor="deadline" className="block text-gray-700 text-sm font-semibold mb-2">Deadline:</label>
            <input
              type="date"
              id="deadline"
              className="shadow-sm appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="priority" className="block text-gray-700 text-sm font-semibold mb-2">Priority:</label>
            <select
              id="priority"
              className="shadow-sm border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              required
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>
          <div className="mb-6">
            <label htmlFor="assignedTo" className="block text-gray-700 text-sm font-semibold mb-2">Assign To (Email):</label>
            <input
              type="email"
              id="assignedTo"
              className="shadow-sm appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              placeholder="Enter assignee email (optional)"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="projectId" className="block text-gray-700 text-sm font-semibold mb-2">Assign to Project:</label>
            <select
              id="projectId"
              className="shadow-sm border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              required
            >
              {projects.length === 0 ? (
                <option value="">No projects available</option>
              ) : (
                projects.map((proj) => (
                  <option key={proj._id} value={proj._id}>{proj.projectName}</option>
                ))
              )}
            </select>
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskCreationModal;