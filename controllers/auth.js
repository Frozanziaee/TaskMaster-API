const User = require('../models/User')
const {StatusCodes} = require('http-status-codes')
const {BadRequestError, UnauthenticatedError} = require('../errors')
const { use } = require('express/lib/router')


const signup = async (req, res) => {
    const user = await User.create({...req.body})
     const token = user.createJWT()
     res.status(StatusCodes.CREATED).json({user: {name: user.firstName}, token})
}

const signin = async (req, res) => {
    const {email, password} = req.body

    if(!email || !password){
        throw new BadRequestError('Please provide email and password')

    }
    const user = await User.findOne({email})
    if(!user){
        throw new UnauthenticatedError('Invalid Credentials')
    }

    const isPasswordCorrect = await user.comparePassword(password)
    if (!isPasswordCorrect) {
        throw new UnauthenticatedError('Invalid Pasword')
    }
    //compare password
    const token = user.createJWT()
    res.status(StatusCodes.OK).json({user: {name: user.firstName}, token })
   
}

module.exports = {
    signup, signin
}