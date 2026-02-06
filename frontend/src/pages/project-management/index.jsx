import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEdit, FaTrash, FaPlus, FaCheck, FaTimes, FaUserPlus, FaUserMinus } from 'react-icons/fa';
import { MdOutlineDone } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { useUser } from '../../context/UserContext';
import Header from 'components/ui/Header';

const ProjectManagement = () => {
  const { user } = useUser();
  const [projects, setProjects] = useState([]);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  const [newProjectOwnerId, setNewProjectOwnerId] = useState('');
  const [error, setError] = useState('');
  const [projectTaskNames, setProjectTaskNames] = useState({});

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_RENDER_BACKEND_URL}/api/projects`);
      setProjects(response.data);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Failed to fetch projects.');
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post(`${import.meta.env.VITE_RENDER_BACKEND_URL}/api/projects`, {
        projectName: newProjectName,
        description: newProjectDescription,
        ownerId: newProjectOwnerId,
      });
      setProjects([...projects, response.data]);
      setNewProjectName('');
      setNewProjectDescription('');
      setNewProjectOwnerId('');
    } catch (err) {
      console.error('Error creating project:', err);
      setError(err.response?.data?.message || 'Failed to create project.');
    }
  };

  const handleAcceptTask = async (projectId, taskId) => {
    setError('');
    try {

      const userEmail = user ? user.email : 'user@example.com'; // Use user email from context, fallback to placeholder
      await axios.put(`${import.meta.env.VITE_RENDER_BACKEND_URL}/api/projects/${projectId}/tasks/${taskId}/accept`, { userEmail });
      fetchProjects();
    } catch (err) {
      console.error('Error accepting task:', err);
      setError(err.response?.data?.message || 'Failed to accept task.');
    }
  };

  const handleNewTaskNameChange = (projectId, taskName) => {
    setProjectTaskNames((prev) => ({ ...prev, [projectId]: taskName }));
  };

  const handleCreateTask = async (e, projectId) => {
    e.preventDefault();
    setError('');
    const taskName = projectTaskNames[projectId];
    if (!taskName) {
      setError('Task name cannot be empty.');
      return;
    }
    try {
      await axios.post(`${import.meta.env.VITE_RENDER_BACKEND_URL}/api/projects/${projectId}/tasks`, { taskName });
      setProjectTaskNames((prev) => ({ ...prev, [projectId]: '' }));
      fetchProjects();
    } catch (err) {
      console.error('Error creating task:', err);
      setError(err.response?.data?.message || 'Failed to create task.');
    }
  };

  return (
    <div className="container mx-auto p-20">
      <header className="bg-white shadow-sm mb-6 p-4 rounded-lg">
        <h1 className="text-2xl font-bold text-gray-800">Project Management</h1>
        <p className="text-gray-600 mt-2">Manage all your projects and tasks in one place</p>
      </header>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      <Header />

      

      <h2 className="text-xl font-semibold mb-4">Existing Projects</h2>
      {projects.length === 0 ? (
        <p>No projects found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6 bg-white rounded-lg shadow-md">
          {projects.map((project) => (
            <div key={project._id} className="bg-white p-4 rounded shadow-md">
              <h3 className="text-lg font-bold">{project.projectName}</h3>
              <p className="text-gray-600">{project.description}</p>
              <p className="text-gray-500 text-sm">Owner: {project.owner?.username || 'N/A'}</p>
              <p className="text-gray-500 text-sm">
                Created: {project.createdAt ? new Date(project.createdAt).toLocaleDateString() : 'N/A'}
              </p>

              <h4 className="text-md font-semibold mt-2">Tasks:</h4>
              {project.tasks?.length === 0 ? (
                <p className="text-gray-500 text-sm">No tasks assigned.</p>
              ) : (
                <ul>
                  {project.tasks?.map((task) => (
                    <li key={task._id} className="text-gray-700 text-sm flex justify-between items-center mb-2">
                      <span>
                        - {task.taskName} ({task.status}) 
                      </span>
                      <button
                        onClick={() => handleAcceptTask(project._id, task._id)}
                        className={` w-[100px] h-10 text-white text-xs  rounded ${task.assignedTo ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-700'}`}
                        disabled={task.assignedTo}
                      >
                        {task.assignedTo ? 'Already Accepted' : 'Accept Task'}
                      </button>
                    </li>
                  ))}
                </ul>
              )}


            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectManagement;
