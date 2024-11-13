const mongoose = require('mongoose')

const ProjectsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide project title'],
        maxLenght: 50
    },
    description: {
        type: String,
        required: [true, 'Please provide description '],
        maxlenght: 300
    },
    manager: {
        type: String,
        required: [true, 'Please provide Manager name'],
        maxlenght: 60
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

module.exports = mongoose.model('Project', ProjectsSchema)