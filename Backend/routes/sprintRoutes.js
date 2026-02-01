const express = require('express');
const router = express.Router();
const Sprint = require('../models/Sprint');
const Project = require('../models/Project');
const User = require('../models/User');

// Create a new sprint
router.post('/', async (req, res) => {
  try {
    const { name, startDate, endDate, sprintGoal, projectId } = req.body;

    // Basic validation
    if (!name || name.trim() === '' || !startDate || !endDate || !sprintGoal || !projectId) {
      return res.status(400).json({ message: 'Please enter all fields' });
    }

    // Check if sprint name already exists
    const existingSprint = await Sprint.findOne({ name });
    if (existingSprint) {
      return res.status(400).json({ message: 'Sprint name already exists' });
    }

    // Check if projectId is a valid project
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const newSprint = new Sprint({
      name,
      startDate,
      endDate,
      sprintGoal,
      projectId,
      initialBacklogTaskCount: project.tasks.length,
      currentBacklogTaskCount: project.tasks.length
    });

    const sprint = await newSprint.save();
    res.status(201).json(sprint);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all sprints (optionally by project)
router.get('/', async (req, res) => {
  try {
    const { projectId } = req.query;
    let query = {};
    if (projectId) {
      query.projectId = projectId;
    }
    const sprints = await Sprint.find(query).select('name startDate endDate sprintGoal tasks isStarted initialBacklogTaskCount currentBacklogTaskCount').populate('projectId', 'projectName');
    res.json(sprints);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a single sprint by ID
router.get('/:id', async (req, res) => {
  try {
    const sprint = await Sprint.findById(req.params.id)
      .populate('projectId', 'projectName');
    if (!sprint) {
      return res.status(404).json({ message: 'Sprint not found' });
    }

    const project = await Project.findById(sprint.projectId);
    if (!project) {
      return res.status(404).json({ message: 'Associated project not found' });
    }

    // Filter project tasks to include only those present in the sprint's tasks array
    // And ensure all necessary fields are included
    const sprintTasks = project.tasks.filter(projectTask =>
      sprint.tasks.includes(projectTask._id)
    ).map(task => ({ ...task.toObject(), assignedTo: task.assignedTo }));

    // Populate assignedTo for the filtered tasks
    await User.populate(sprintTasks, {
      path: 'assignedTo',
      select: 'username email avatar'
    });

    // Create a new sprint object with populated tasks
    const sprintWithPopulatedTasks = {
      ...sprint.toObject(),
      tasks: sprintTasks
    };

    res.json(sprintWithPopulatedTasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get tasks for a specific sprint
router.get('/:id/tasks', async (req, res) => {
  try {
    const sprint = await Sprint.findById(req.params.id);
    if (!sprint) {
      return res.status(404).json({ message: 'Sprint not found' });
    }

    const project = await Project.findById(sprint.projectId);
    if (!project) {
      return res.status(404).json({ message: 'Associated project not found' });
    }

    // Filter project tasks to include only those present in the sprint's tasks array
    // And ensure all necessary fields are included
    const sprintTasks = project.tasks.filter(projectTask =>
      sprint.tasks.includes(projectTask._id)
    ).map(task => ({ ...task.toObject(), assignedTo: task.assignedTo }));

    // Populate assignedTo for the filtered tasks
    await User.populate(sprintTasks, {
      path: 'assignedTo',
      select: 'username email avatar'
    });

    res.json(sprintTasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a task to a sprint
router.post('/:sprintId/tasks', async (req, res) => {
  try {
    const { sprintId } = req.params;
    const { taskId, projectId } = req.body;

    const sprint = await Sprint.findById(sprintId);
    if (!sprint) {
      return res.status(404).json({ message: 'Sprint not found' });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const task = project.tasks.id(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found in project' });
    }

    // Add task to sprint if not already present
    if (!sprint.tasks.includes(taskId)) {
      sprint.tasks.push(taskId);
      sprint.currentBacklogTaskCount = sprint.tasks.length;
      await sprint.save();
    }

    // Update task status to 'Sprint' in the project
    task.status = 'Sprint';
    project.markModified('tasks');
    await project.save();

    res.json({ message: 'Task added to sprint successfully', sprint, task });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a sprint by ID
router.put('/:id', async (req, res) => {
  try {
    const { name, startDate, endDate, sprintGoal } = req.body;

    const updatedSprint = await Sprint.findByIdAndUpdate(
      req.params.id,
      { name, startDate, endDate, sprintGoal },
      { new: true, runValidators: true }
    );

    if (!updatedSprint) {
      return res.status(404).json({ message: 'Sprint not found' });
    }

    res.json(updatedSprint);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});



// Start a sprint
router.put('/:id/start', async (req, res) => {
  try {
    const { id } = req.params;
    const sprint = await Sprint.findById(id);

    if (!sprint) {
      return res.status(404).json({ message: 'Sprint not found' });
    }

    if (sprint.isStarted) {
      return res.status(400).json({ message: 'Sprint is already started' });
    }

    sprint.isStarted = true;
    sprint.initialBacklogTaskCount = sprint.tasks.length;
    await sprint.save();

    res.json({ message: 'Sprint started successfully', sprint });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update task status within a sprint
router.put('/:sprintId/tasks/:taskId', async (req, res) => {
  try {
    const { status } = req.body; // Get status from request body
    const { sprintId, taskId } = req.params;

    const sprint = await Sprint.findById(sprintId);
    if (!sprint) {
      return res.status(404).json({ message: 'Sprint not found' });
    }

    const project = await Project.findById(sprint.projectId);
    if (!project) {
      return res.status(404).json({ message: 'Associated project not found' });
    }

    const projectTask = project.tasks.id(taskId);
    if (!projectTask) {
      return res.status(404).json({ message: 'Task not found in project' });
    }

    // Update the status of the task in the project
    projectTask.status = status;
    project.markModified('tasks');
    await project.save();

    // If the status is not 'Review', remove the task from the sprint's task list
    if (status !== 'Review') {
      sprint.tasks.pull(taskId);
      sprint.markModified('tasks');
      await sprint.save();
    }

    res.json(projectTask); // Respond with the updated project task
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove a task from a sprint
router.put('/:sprintId/tasks/:taskId/remove', async (req, res) => {
  try {
    const { sprintId, taskId } = req.params;
    const sprint = await Sprint.findById(sprintId);

    if (!sprint) {
      return res.status(404).json({ message: 'Sprint not found' });
    }

    sprint.tasks = sprint.tasks.filter(taskObjectId => taskObjectId.toString() !== taskId);
    sprint.currentBacklogTaskCount = sprint.tasks.length;
    await sprint.save();

    res.status(200).json({ message: 'Task removed from sprint successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add a new task to a sprint
router.post('/:sprintId/tasks', async (req, res) => {
  try {
    const { sprintId } = req.params;
    const { taskId } = req.body; // Expecting taskId from frontend

    const sprint = await Sprint.findById(sprintId);
    if (!sprint) {
      return res.status(404).json({ message: 'Sprint not found' });
    }

    const project = await Project.findById(sprint.projectId);
    if (!project) {
      return res.status(404).json({ message: 'Associated project not found' });
    }

    const projectTask = project.tasks.id(taskId);
    if (!projectTask) {
      return res.status(404).json({ message: 'Project task not found' });
    }

    // Check if the task already exists in the sprint to prevent duplicates
    if (sprint.tasks.includes(taskId)) {
      return res.status(400).json({ message: 'Task already exists in this sprint' });
    }

    sprint.tasks.push(taskId); // Add only the taskId to the sprint's tasks array
    await sprint.save();

    // Respond with the project task details for confirmation
    res.status(201).json(projectTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update sprint started status
router.put('/:sprintId/start', async (req, res) => {
  try {
    const { sprintId } = req.params;
    const { isStarted } = req.body;

    const sprint = await Sprint.findById(sprintId);

    if (isStarted && !sprint.isStarted) {
      // Sprint is starting, capture initial backlog tasks
      sprint.initialBacklogTaskCount = sprint.tasks.filter(task => task.status === 'Backlog').length;
    }
    if (!sprint) {
      return res.status(404).json({ message: 'Sprint not found' });
    }

    const updatedSprint = await Sprint.findByIdAndUpdate(
      sprintId,
      { $set: { isStarted: isStarted } },
      { new: true, runValidators: true }
    );

    if (!updatedSprint) {
      return res.status(404).json({ message: 'Sprint not found after update' });
    }

    res.status(200).json({ message: 'Sprint started status updated successfully', sprint: updatedSprint });


  } catch (error) {
    console.error('Error updating sprint started status:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;