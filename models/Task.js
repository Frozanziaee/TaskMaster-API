const mongoose = require('mongoose')

const Project = require('./Project.js')

const TasksSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide task title'],
    },
    description: {
        type: String,
        required: [true, 'Please provide description'],
    },
    assignee: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: String,
        enum: ['In Progress', 'Completed', 'Not Started', 'Paused', 'Archived'],
        message: "{VALUE} is not supported",
        default: 'Not Started'
    },
    deadline: {
        type: Date,
        required: [true, "Please provide task's deadline"],
    },

    project: {
        type: mongoose.Types.ObjectId,
        ref: "Project",
        required: [true, "Project id is required"],
    },
   
}, {timestamps: true})

TasksSchema.post("save", async function () {
    const projectId = this.project;
    let fieldToInc = "";
  
    switch (this.status) {
      case "completed":
        fieldToInc = "completedTasks";
        break;
      case "in-progress":
        fieldToInc = "inProgressTasks";
        break;
      default:
        fieldToInc = "allTasks";
    }
    try {
      await Project.findByIdAndUpdate(projectId, {
        $inc: { [fieldToInc]: 1 },
      });
    } catch (error) {
      return next(error);
    }
  });

module.exports = mongoose.model('Task', TasksSchema)