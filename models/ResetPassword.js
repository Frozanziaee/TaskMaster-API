const mongoose = require('mongoose')

const ResetPasswordSchema = new mongoose.Schema({
    token: String,
    expiresIn: Date,
})


module.exports = mongoose.model('ResetPassword', ResetPasswordSchema)
