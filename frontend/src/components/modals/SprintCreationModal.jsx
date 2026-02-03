import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SprintCreationModal = ({ isOpen, onClose, onSprintCreated }) => {
  const [sprintName, setSprintName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sprintGoal, setSprintGoal] = useState('');
  const [projectId, setProjectId] = useState('');
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      // Fetch projects when the modal opens
      const fetchProjects = async () => {
        try {
          const response = await axios.get(`${import.meta.env.VITE_RENDER_BACKEND_URL}/api/projects`);
          setProjects(response.data);
        } catch (err) {
          console.error('Error fetching projects:', err);
          setError('Failed to load projects.');
        }
      };
      fetchProjects();
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!sprintName || !startDate || !endDate || !sprintGoal || !projectId) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_RENDER_BACKEND_URL}/api/sprints`, {
        name: sprintName,
        startDate,
        endDate,
        sprintGoal,
        projectId,
      });
      onSprintCreated(response.data);
      onClose();
      setSprintName('');
      setStartDate('');
      setEndDate('');
      setSprintGoal('');
      setProjectId('');
    } catch (err) {
      console.error('Error creating sprint:', err);
      setError(err.response?.data?.message || 'Failed to create sprint.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Create New Sprint</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="sprintName" className="block text-gray-700 text-sm font-bold mb-2">Sprint Name:</label>
            <input
              type="text"
              id="sprintName"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={sprintName}
              onChange={(e) => setSprintName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="startDate" className="block text-gray-700 text-sm font-bold mb-2">Start Date:</label>
            <input
              type="date"
              id="startDate"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="endDate" className="block text-gray-700 text-sm font-bold mb-2">End Date:</label>
            <input
              type="date"
              id="endDate"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="sprintGoal" className="block text-gray-700 text-sm font-bold mb-2">Sprint Goal:</label>
            <textarea
              id="sprintGoal"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={sprintGoal}
              onChange={(e) => setSprintGoal(e.target.value)}
              required
            ></textarea>
          </div>
          <div className="mb-4">
            <label htmlFor="projectId" className="block text-gray-700 text-sm font-bold mb-2">Project:</label>
            <select
              id="projectId"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              required
            >
              <option value="">Select a Project</option>
              {projects.map((project) => (
                <option key={project._id} value={project._id}>
                  {project.projectName}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Create Sprint
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SprintCreationModal;