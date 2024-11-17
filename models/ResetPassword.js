const mongoose = require('mongoose')

const ResetPassword = new mongoose.Schema({
    token: String,
    expiresIn: Date,
})


module.exports = mongoose.model('ResetPassword', ResetPassword)
