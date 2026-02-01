const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  taskName: {
    type: String,
    required: true,
    trim: true
  },
  taskDescription: {
    type: String,
    required: false, // Making it optional for now, can be changed to true if needed
    trim: true
  },
  assignedTo: {
    type: String,
    required: false
  },
  status: {
    type: String,
    required: false
  },
  dueDate: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
  }
});

const projectSchema = new mongoose.Schema({
  projectName: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },


  tasks: [taskSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;