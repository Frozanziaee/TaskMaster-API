const mongoose = require('mongoose')

const TasksSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide task title'],
        maxLenght: 50
    },
    description: {
        type: String,
        required: [true, 'Please provide description'],
        maxlenght: 300
    },
    assignee: {
        type: String,
        required: [true, 'Please provide assignee name'],
        maxlenght: 60
    },
    status: {
        type: String,
        enum: ['In Progress', 'Completed', 'Not Started', 'Paused', 'Archived'],
        default: 'Not Started'
    },
    deadline: {
        type: Date,
        required: true,
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'Please provide user']
    },
}, {timestamps: true})

module.exports = mongoose.model('Task', TasksSchema)