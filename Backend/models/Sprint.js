const mongoose = require('mongoose');

const sprintSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  tasks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project.tasks' // Reference to tasks within the Project model
  }],
  isStarted: {
    type: Boolean,
    default: false,
  },
  sprintGoal: {
    type: String,
    trim: true,
  },
  initialBacklogTaskCount: {
    type: Number,
    default: 0,
  },
  currentBacklogTaskCount: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

sprintSchema.pre('save', function(next) {
  if (this.name === null || this.name === undefined) {
    this.name = '';
  }
  next();
});

const Sprint = mongoose.model('Sprint', sprintSchema);

module.exports = Sprint;