const Task = require('../models/Task')
const Project = require('../models/Project')
const { StatusCodes} = require('http-status-codes')
const { BadRequestError, NotFoundError} = require('../errors')

const getAllTasks = async (req, res) => {
    const {projectId} = req.query

    let searchQuery = {}
    if(projectId) {
    searchQuery = { project:projectId }
   }

    const tasks = await Task.find(searchQuery).populate('assignee')
    res.status(StatusCodes.OK).json({tasks})
}

// const getTask = async (req, res) => {
//     const req.params

//     const task = await Task.findOne({
//         _id:taskId,
//         // createdBy:userId,
//     })

//     if(!task){
//         throw new NotFoundError(`No task with id ${taskId}`);
        
//     }
//     res.status(StatusCodes.OK).json({task})
// }

const createTask = async (req, res) => {
    const {projectId} = req.query
    const  task = await Task.create({...req.body, project:projectId})
    res.status(StatusCodes.CREATED).json({messafe: 'Task added', task})
}

const updateTask = async (req, res) => {
    const {title, description} = req.body
    if(title === '' || description === '') {
        throw new BadRequestError('title or description field is empty')
    }

    const task = await Task.findByIdAndUpdate(
        req.task._id, 
        {new: true, runValidators: true}
    )

    if(!task){
        throw new NotFoundError(`No task found`) 
    }
    await task.save()
    res.status(StatusCodes.OK).json({message: 'task updated successfully', task})
}

const deleteTask = async (req, res) => {
    const {taskId} = req.params

    const task = await Task.findByIdAndDelete(taskId)

    if(!task){
        throw new NotFoundError(`No task with id ${taskId}`) 
    }
    res.status(StatusCodes.OK).json({ message: "Task deleted successfully", task })
}

// getTask,

module.exports = {
    getAllTasks,  createTask, updateTask, deleteTask
}