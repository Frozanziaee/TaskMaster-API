const express = require('express')
const router = express.Router()

const {
    getAllProjects,
    getProject,
    createProject,
    getProjectsSummary ,
    updateProject, 
    deleteProject
} = require('../controllers/projects')

router.route('/').post(createProject).get(getAllProjects)
router.route('/summary').get(getProjectsSummary)
router.route('/:id').get(getProject).delete(deleteProject).patch(updateProject)

module.exports = router
