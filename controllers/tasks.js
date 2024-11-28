const Task = require('../models/Task')
const Project = require('../models/Project')
const { StatusCodes} = require('http-status-codes')
const { BadRequestError, NotFoundError} = require('../errors')

const getAllTasks = async (req, res) => {
    const {projectId} = req.query
    const page = req.query.page || 1;
    const size = req.query.size || 10;
    const search = req.query.search;

    let searchQuery = {}
    if(search) {
        searchQuery.title = { $regex: search, $options: "i"  }
    }

    if (projectId) {
    searchQuery.project = projectId;
    } else {
    throw BadRequestError("Provide projectId query to get tasks");
    }

    const tasks = await Task.find(searchQuery)
    .populate('assignee')
    .skip((page - 1) * size)
    .limit(size)

    const count = await Task.countDocuments(searchQuery)
    const totalPages = Math.ceil(count / 10)

    res.status(StatusCodes.OK).json({tasks, totalPages})
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
    if (!projectId) {
        throw new BadRequestError("Provide projectId query param to create Task");
      }
    
      const project = await Project.findByIdAndUpdate(projectId, {
        $inc: { allTasks: 1 },
      })
      if (!project) {
        console.error("No project found with ID:", projectId);
        throw new NotFoundError("Project not found");
      }

    const task = await Task.create({
        title,
        description,
        deadline,
        assignee,
        project:projectId,
    })

    ++project.allTasks;
    await project.save();
    res.status(StatusCodes.CREATED).json({message: 'Task added successfully', task})
}

const updateTask = async (req, res) => {
    const { id } = req.params
    const {title, description, deadline, assignee, status} = req.body

    const task = await Task.findOneAndUpdate(
        { _id: id },
        {
            title,
            deadline,
            description,
            assignee,
            status,
          },
        {new: true}
    )

    if(!task){
        throw new NotFoundError(`No task found`) 
    }
    const project = await Project.findById(task.project)
    if (!project) {
    console.error("No project found with ID:", id)
    return next(new Error("Project not found"))
    }

    const allTasksOfProject = await Task.find({ project: task.project });

    project.completedTasks = allTasksOfProject.filter(
    (t) => t.status == "completed").length;
    project.inProgressTasks = allTasksOfProject.filter(
    (t) => t.status == "in-progress").length;
    project.allTasks = allTasksOfProject.length;

    await project.save()
    res.status(StatusCodes.ACCEPTED).json({message: 'task updated successfully'})
}

const deleteTask = async (req, res) => {
    const {id: taskId} = req.params

    const task = await Task.findByIdAndDelete(taskId)

    if(!task){
        throw new NotFoundError(`No task with id ${taskId}`) 
    }

    const query = { allTasks: -1 };

    if (task.status === "in-progress") {
      query.inProgressTasks = -1;
    } else if (task.status === "completed") {
      query.completedTasks = -1;
    }

    await Project.findByIdAndUpdate(task.project, {
        $inc: query,
    })

    res.status(StatusCodes.OK).json({ message: "Task deleted successfully", task })
}

// getTask,

module.exports = {
    getAllTasks,  createTask, updateTask, deleteTask
}