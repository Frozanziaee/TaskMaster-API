const Project = require('../models/Project')
const { StatusCodes} = require('http-status-codes')
const { BadRequestError, NotFoundError} = require('../errors')


const getAllProjects = async (req, res) => {
    const projects = await Project.find().populate('manager')
    if(projects.lenght){
        res.status(StatusCodes.OK).json({projects})
    }
    throw new NotFoundError('No Projects found')
    
}

const getProject = async (req, res) => {
    const { id } = req.params

    const projectId = await Project.findById(id)
        .populate('tasks')
        .populate('manager')

    if(!projectId){
        throw new NotFoundError(`No project with id ${id}`);
        
    }
    res.status(StatusCodes.OK).json({project: projectId})
}

const createProject = async (req, res) => {
    const  project = await Project.create(req.body)
    res.status(StatusCodes.CREATED).json(project)
}

const updateProject = async (req, res) => {
    const {
        body: {title, description},
        user: {userId},
        params:{id: projectId}
    } = req
    if(title === '' || description === '') {
        throw new BadRequestError('title or description field is empty')
    }

    const project = await Project.findByOneAndUpdate(
        // {_id:projectId, createdBy:userId,},
        req.body, 
        {new: true, runValidators: true}
    )

    if(!project){
        throw new NotFoundError(`No project with id ${projectId}`) 
    }
    res.status(StatusCodes.OK).json({project})
}

const deleteProject = async (req, res) => {
    const {
        user: {userId},
        params: {id: projectId}
    } = req

    const project = await Project.findByOneAndDelete({_id:projectId, createdBy:userId})

    if(!project){
        throw new NotFoundError(`No project with id ${projectId}`) 
    }
    res.status(StatusCodes.OK).send()
}

module.exports = {
    getAllProjects,
    getProject, 
    createProject, 
    updateProject, 
    deleteProject
}