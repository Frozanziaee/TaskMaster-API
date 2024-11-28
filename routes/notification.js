const express = require('express')
const router = express.Router()

const {
    getAllNotifications,
    readNotification,
} = require('../controllers/notification')

router.route('/').get(getAllNotifications)
router.route("/:id").post(readNotification)

module.exports = router