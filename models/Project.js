const mongoose = require('mongoose')

const ProjectsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide project title'],
    },
    description: {
        type: String,
        required: [true, 'Please provide description '],
    },
    manager: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    deadline: {
        type: Date,
        required: [true, "Please provide project's deadline"],
    },
    
    status: {
        type: String,
        enum: ["not-started", "in-progress", "completed"],
        message: "{VALUE} not supported for project status",
        default: "not-started",
      },
      allTasks:{
        type: Number,
        default: 0
      },
      inProgressTasks:{
        type: Number,
        default: 0
      },
      completedTasks:{
        type: Number,
        default: 0
      },
}, {timestamps: true})

module.exports = mongoose.model('Project', ProjectsSchema)