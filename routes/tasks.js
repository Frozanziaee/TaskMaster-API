const express = require('express')
const router = express.Router()

// .get(getTask)
const { 
    getAllTasks,
    //getTask,
    createTask, 
    updateTask, 
    deleteTask 
} = require('../controllers/tasks')

router.route('/').post(createTask).get(getAllTasks)
router.route('/:id').delete(deleteTask).patch(updateTask)

module.exports = router