const express = require('express')
const router = express.Router()
const storage = require('../utils/multer-storage')

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