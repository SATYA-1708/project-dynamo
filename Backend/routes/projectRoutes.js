const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const Notification = require('../models/Notification');
const User = require('../models/User');
const Sprint = require('../models/Sprint');





// Create a new project
router.post('/', async (req, res) => {
  try {
    const { projectName, description } = req.body;

    // Basic validation
    if (!projectName || !description) {
      return res.status(400).json({ message: 'Please enter all fields' });
    }

    // Check if project name already exists
    const existingProject = await Project.findOne({ projectName });
    if (existingProject) {
      return res.status(400).json({ message: 'Project name already exists' });
    }





    const newProject = new Project({
      projectName,
      description
    });

    const project = await newProject.save();
    res.status(201).json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all projects
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a single project by ID
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a task to a project
router.post('/:id/tasks', async (req, res) => {
  try {
    const { id } = req.params;
    const { taskName, taskDescription, assignedTo, dueDate, priority } = req.body;

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }





    const newTask = {
      taskName,
      taskDescription,
      dueDate: dueDate || null,
      assignedTo: assignedTo,
      priority: priority || 'Medium',
      status: assignedTo ? 'In Progress' : 'Backlog',
    };

    project.tasks.push(newTask);

    // Create notification if task is assigned
    if (assignedTo) {
      const assignedUser = await User.findOne({ email: assignedTo });
      if (assignedUser) {
        const notification = new Notification({
          userId: assignedUser._id,
          type: 'task_assigned',
          message: `You have been assigned a new task: ${taskName} in project ${project.projectName}.`,
          link: `/project/${id}/task/${newTask._id}`,
        });
        await notification.save();
      }
    }

    await project.save();
    res.status(201).json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update task status
router.put('/:projectId/tasks/:taskId', async (req, res) => {
  try {
    const { status } = req.body;
    const { projectId, taskId } = req.params;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const task = project.tasks.id(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.status = status || task.status;

    // If the task status changes, remove it from any associated sprints
    if (task.isModified('status')) {
      try {
        const sprints = await Sprint.find({ tasks: taskId });
        for (const sprint of sprints) {
          sprint.tasks.pull(taskId);
          await sprint.save();
        }
      } catch (error) {
      }
    }

    await project.save();
    res.json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Accept a task
router.put('/:projectId/tasks/:taskId/accept', async (req, res) => {
  try {
    const { projectId, taskId } = req.params;
    const { userEmail } = req.body; // The email of the user accepting the task

    if (!userEmail) {
      return res.status(400).json({ message: 'User email is required to accept a task' });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const task = project.tasks.id(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Assign the task to the user and update status
    task.assignedTo = userEmail;
    task.status = 'In Progress'; // Set status to In Progress when accepted

    // Create notification for task acceptance
    const acceptingUser = await User.findOne({ email: userEmail });
    if (acceptingUser) {
      const notification = new Notification({
        userId: acceptingUser._id,
        type: 'task_accepted',
        message: `You have accepted the task: ${task.taskName} in project ${project.projectName}.`,
        link: `/project/${projectId}/task/${taskId}`,
      });
      await notification.save();
    }

    await project.save();
    res.json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all backlog tasks
router.get('/tasks/backlog', async (req, res) => {
  try {
    const projects = await Project.find({});
    let backlogTasks = [];

    projects.forEach(project => {
      project.tasks.forEach(task => {
        if (task.status === 'Backlog') {
          backlogTasks.push({
            ...task.toObject(),
            projectId: project._id, // Add project ID to the task object
            projectName: project.projectName // Add project name to the task object
          });
        }
      });
    });

    res.json(backlogTasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all tasks from all projects
router.get('/tasks/all', async (req, res) => {
  try {
    const projects = await Project.find({});
    let allTasks = [];

    projects.forEach(project => {
      project.tasks.forEach(task => {
        allTasks.push({
          ...task.toObject(),
          projectId: project._id,
          projectName: project.projectName
        });
      });
    });

    res.json(allTasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;