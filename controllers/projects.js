const Project = require('../models/Project')
const { StatusCodes} = require('http-status-codes')
const { BadRequestError, NotFoundError} = require('../errors')


const getAllProjects = async (req, res) => {
    const page = req.query.page || 1;
    const size = req.query.size || 10;
    
    const projects = await Project.find()
    .skip((page - 1) * size)
    .limit(size)
    .populate('manager')

    const count = await Project.countDocuments();
    const totalPages = Math.ceil(count / 10);

    res.status(StatusCodes.OK).json({projects, totalPages})
    
    
}

const getProject = async (req, res) => {
    const { id } = req.params

    const projectId = await Project.findById(id)
        .populate('tasks manager')

    if(!projectId){
        throw new NotFoundError(`No project with id ${id}`);
        
    }
    res.status(StatusCodes.OK).json({project: projectId})
}

const createProject = async (req, res) => {
    const  project = await Project.create(req.body)
    res.status(StatusCodes.CREATED).json(project)
}

const getProjectsSummary = async (req, res) => {
    const allProjects = await Project.find();
    let completedProjects = 0;
    let inProgressProjects = 0;
    let notStartedProjects = 0;
  
    allProjects.forEach((project) => {
      if (project.allTasks === project.completedTasks && project.allTasks != 0)
        completedProjects++;
      if (project.inProgressTasks > 0) inProgressProjects++;
      else notStartedProjects++;
    });
  
    res.status(StatusCodes.OK).json({
      completedProjects,
      notStartedProjects,
      inProgressProjects,
      allProjects: allProjects.length,
    });
  };

const updateProject = async (req, res) => {
    const { id } = req.params;
    const { manager, deadline, description } = req.body;

    if(title === '' || description === '') {
        throw new BadRequestError('title or description field is empty')
    }

    const projectWithId = await Project.findByIdAndUpdate(id, {
        manager,
        deadline,
        description,
      })

    if(!projectWithId){
        throw new NotFoundError(`No project with id ${id}`) 
    }
    res.status(StatusCodes.OK).json({message: "Project updated successfully"})
}

const deleteProject = async (req, res) => {
    const { id } = req.params;

    const projectWithId = await Project.findByIdAndDelete(id)

    if(!projectWithId){
        throw new NotFoundError(`No project with id ${id}`) 
    }
    res.status(StatusCodes.OK).json({ message: "Project deleted successfully" })
}

module.exports = {
    getAllProjects,
    getProject, 
    createProject, 
    getProjectsSummary,
    updateProject, 
    deleteProject
}