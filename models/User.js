//const { types } = require('joi')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema({
    email:{
        type: String,
        required: [true, 'Please provide email'],
        match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 
            'Please provide a valid email'
        ],
        unique: true,
    },
    password:{
        type: String,
        required: [true, 'Please provide password'],
        minLength: 6,
    },
    firstName:{
        type: String,
        required: [true, 'Please provide first name'],
        minLength: 3,
        maxLength: 50,
    },
    lastName:{
        type: String,
        required: [true, 'Please provide last name'],
        minLength: 3,
        maxLength: 50,
    },
    dateOfBirth:{
        type: Date,
        required: [true, 'Please provide date of birth'],
        min: '1990-1-1',
        max: '2006-12-30',
    },
    country:{
        type: String,
        required: [true, 'Please provide country'],
        minLength: 3,
        maxLength: 50,
    },

})

UserSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
})

UserSchema.methods.createJWT = function () {
    return jwt.sign({userId: this._id, name: this.firstName}, process.env.JWT_SECRET , {
        expiresIn: process.env.JWT_LIFETIME,
    })
}

UserSchema.methods.comparePassword = async function (conditatePassword) {
    const isMatch = await bcrypt.compare(conditatePassword, this.password)
    return isMatch
}

module.exports = mongoose.model('User', UserSchema)