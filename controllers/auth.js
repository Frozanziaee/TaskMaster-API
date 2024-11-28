const User = require('../models/User')
const {StatusCodes} = require('http-status-codes')
const {BadRequestError, UnauthenticatedError, NotFoundError} = require('../errors')
const ResetPassword = require ("../models/ResetPassword")
const crypto = require ("crypto")
const sendMail = require ("../utils/email-sender")

const cookieOptions = {
  expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // seven days (and expires accepts time in date objects form)
  httpOnly: true,
  secure: true,
}
  
// Register route controller
    const signup = async (req, res) => {
    const user = await User.create({
        ...req.body,
        profile: `${req.protocol}://${req.hostname}:${req.port}/profiles/avatar.jfif`,
    })
     const token = user.createJWT()
     res.status(StatusCodes.CREATED)
     .cookie('token', token, cookieOptions)
     .json({user: {name: user.firstName}, token})
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
    res.status(StatusCodes.OK)
    .cookie('token', token, cookieOptions)
    .json({user: {name: user.firstName}, token })
   
}

// Signout route controller
const signout = async (req, res) => {
    res.status(StatusCodes.OK)
    .clearCookie("token", { ...cookieOptions, expires: undefined })
    .json({ message: "Sign out successfully" });
}

// Forgot Password controller
const forgotPassword = async (req, res) => {
    const { email } = req.body;
    if (!email) {
      throw new BadRequestError("Provide your email")
    }
  
    const userWithEmail = await User.findOne({ email })
    if (!userWithEmail) {
      throw NotFoundError("No user found with provided email")
    }
  
    const resetToken = await ResetPassword.create({
      token: crypto.randomBytes(32).toString("hex"),
      expiresIn: Date.now() + 24 * 60 * 60 * 1000,
    });
  
    userWithEmail.resetToken = resetToken._id
    await userWithEmail.save()
  
    const url = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken.token}&user=${userWithEmail._id}`
  
    await sendMail(userWithEmail, url)
    res.status(StatusCodes.OK).json({
      message: "A password reset was sent to your email",
    })
  
}

const resetPassword = async (req, res) => {
    const { token, user } = req.query
    const { password, confirmPassword } = req.body

    if (password !== confirmPassword) {
      throw new BadRequestError("Not mutch")
    }
  
    const resetToken = await ResetPassword.findOne({ token: token })
  
    const presentTime = Date.now();
    if (!resetToken && presentTime < token.expiresIn) {
      throw new UnauthenticatedError("Reset password token is invalid")
    }
  
    const requestedUser = await User.updateOne({ _id: user }, { password })
    res.status(StatusCodes.ACCEPTED).json({ message: "Password has been successfully changed" })
  }

 

module.exports = {
    signup, signin, signout, forgotPassword, resetPassword, googleLogin
}