import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SprintManagement = () => {
  const [sprints, setSprints] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [newSprintName, setNewSprintName] = useState('');
  const [newDurationDays, setNewDurationDays] = useState('');
  const [newSprintGoal, setNewSprintGoal] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskAssignedTo, setNewTaskAssignedTo] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [selectedSprintId, setSelectedSprintId] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSprints();
    fetchProjects();
    fetchUsers();
  }, []);

  const fetchSprints = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_RENDER_BACKEND_URL}/api/sprints`);
      setSprints(res.data);
    } catch (err) {
      console.error('Error fetching sprints:', err);
      setError('Failed to fetch sprints.');
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_RENDER_BACKEND_URL}/api/projects`);
      setProjects(res.data);
    } catch (err) {
      console.error('Error fetching projects:', err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_RENDER_BACKEND_URL}/api/users`);
      setUsers(res.data);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const handleCreateSprint = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post(`${import.meta.env.VITE_RENDER_BACKEND_URL}/api/sprints`, {
        sprintName: newSprintName,
        durationDays: newDurationDays,
        sprintGoal: newSprintGoal,
        projectId: selectedProjectId
      });
      setSprints(prev => [...prev, res.data]);
      setNewSprintName('');
      setNewDurationDays('');
      setNewSprintGoal('');
      setSelectedProjectId('');
    } catch (err) {
      console.error('Error creating sprint:', err);
      setError(err.response?.data?.message || 'Failed to create sprint.');
    }
  };

  const handleAddTaskToSprint = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post(`${import.meta.env.VITE_RENDER_BACKEND_URL}/api/sprints/${selectedSprintId}/tasks`, {
        taskName: newTaskName,
        assignedTo: newTaskAssignedTo,
        dueDate: newTaskDueDate || null
      });
      setSprints(prev =>
        prev.map(sprint =>
          sprint._id === selectedSprintId ? res.data : sprint
        )
      );
      setNewTaskName('');
      setNewTaskAssignedTo('');
      setNewTaskDueDate('');
      setSelectedSprintId('');
    } catch (err) {
      console.error('Error adding task to sprint:', err);
      setError(err.response?.data?.message || 'Failed to add task.');
    }
  };

  return (
    <div className="container mx-auto p-4 flex">
      {/* Sidebar */}
      <div className="w-1/4 pr-4">
        <h2 className="text-xl font-bold mb-4">Sprints</h2>
        {sprints.length === 0 ? (
          <div className="text-gray-500 text-center py-4">
            <p>No available sprints.</p>
            <button
              onClick={() => document.getElementById('createSprintForm').scrollIntoView({ behavior: 'smooth' })}
              className="mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              Create New Sprint
            </button>
          </div>
        ) : (
          <ul className="space-y-2">
            {sprints.map(sprint => (
              <li key={sprint._id} className="bg-white p-3 rounded shadow">
                <h3 className="font-semibold">{sprint.sprintName}</h3>
                <p className="text-sm text-gray-600">Goal: {sprint.sprintGoal}</p>
                <p className="text-sm text-gray-600">Start Date: {new Date(sprint.startDate).toLocaleDateString()}</p>
                <p className="text-sm text-gray-600">End Date: {new Date(sprint.endDate).toLocaleDateString()}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Main Content */}
      <div className="w-3/4">
        <h1 className="text-2xl font-bold mb-4">Sprint Management</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* Create Sprint Form */}
        <form onSubmit={handleCreateSprint} id="createSprintForm" className="bg-white p-6 rounded shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Create New Sprint</h2>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Sprint Name:</label>
            <input
              type="text"
              className="border rounded w-full py-2 px-3"
              value={newSprintName}
              onChange={e => setNewSprintName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Duration (Days):</label>
            <input
              type="number"
              className="border rounded w-full py-2 px-3"
              value={newDurationDays}
              onChange={e => setNewDurationDays(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Sprint Goal:</label>
            <textarea
              className="border rounded w-full py-2 px-3"
              value={newSprintGoal}
              onChange={e => setNewSprintGoal(e.target.value)}
              required
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Assign to Project:</label>
            <select
              className="border rounded w-full py-2 px-3"
              value={selectedProjectId}
              onChange={e => setSelectedProjectId(e.target.value)}
              required
            >
              <option value="">Select a Project</option>
              {projects.map(project => (
                <option key={project._id} value={project._id}>{project.projectName}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded">
            Create Sprint
          </button>
        </form>

        {/* Add Task Form */}
        <form onSubmit={handleAddTaskToSprint} className="bg-white p-6 rounded shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Add Task to Sprint</h2>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Select Sprint:</label>
            <select
              className="border rounded w-full py-2 px-3"
              value={selectedSprintId}
              onChange={e => setSelectedSprintId(e.target.value)}
              required
            >
              <option value="">Select a Sprint</option>
              {sprints.map(sprint => (
                <option key={sprint._id} value={sprint._id}>{sprint.sprintName}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Task Name:</label>
            <input
              type="text"
              className="border rounded w-full py-2 px-3"
              value={newTaskName}
              onChange={e => setNewTaskName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Assigned To:</label>
            <select
              className="border rounded w-full py-2 px-3"
              value={newTaskAssignedTo}
              onChange={e => setNewTaskAssignedTo(e.target.value)}
              required
            >
              <option value="">Select a User</option>
              {users.map(user => (
                <option key={user._id} value={user._id}>{user.username} ({user.email})</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Due Date:</label>
            <input
              type="date"
              className="border rounded w-full py-2 px-3"
              value={newTaskDueDate}
              onChange={e => setNewTaskDueDate(e.target.value)}
            />
          </div>
          <button type="submit" className="bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded">
            Add Task
          </button>
        </form>

        {/* Existing Sprints */}
        <h2 className="text-xl font-semibold mb-4">Existing Sprints</h2>
        {sprints.length === 0 ? (
          <p>No sprints found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sprints.map(sprint => (
              <div key={sprint._id} className="bg-white p-4 rounded shadow">
                <h3 className="text-lg font-bold">{sprint.sprintName}</h3>
                <p className="text-gray-600">Goal: {sprint.sprintGoal}</p>
                <p className="text-gray-500 text-sm">Duration: {sprint.durationDays} days</p>
                <p className="text-gray-500 text-sm">Project: {sprint.projectId?.projectName || 'N/A'}</p>
                <p className="text-gray-500 text-sm">Created: {new Date(sprint.createdAt).toLocaleDateString()}</p>
                <h4 className="text-md font-semibold mt-2">Tasks:</h4>
                {sprint.tasks?.length === 0 ? (
                  <p className="text-gray-500 text-sm">No tasks assigned.</p>
                ) : (
                  <ul className="list-disc ml-4">
                    {sprint.tasks.map(task => (
                      <li key={task._id} className="text-gray-700 text-sm">
                        {task.taskName} ({task.status}) - Assigned to: {task.assignedTo}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SprintManagement;
