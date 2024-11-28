const mongoose = require('mongoose')

const NotificationSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Title is required"]
    },
    message: {
        type: String,
        required: [true, "Message is required"]
    },
    unread: {
        type: Boolean,
        default: false
    },
    recipient: {
        type: mongoose.Types.ObjectId,
        required: [true, "Recipient is required"]
    },
})

module.exports = mongoose.model('Notification', NotificationSchema)