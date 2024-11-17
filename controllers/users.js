
const deleteOldProfile = require ("../utils/delete-old-profile.js")
const User = require('../models/User')
const { StatusCodes} = require('http-status-codes')
const { NotFoundError, UnauthenticatedError} = require('../errors')

// Get all users data
const getAllUsers = async (req, res) => {
  const users = await User.find().select("firstName lastName profile")
  if (users.length) {
    return res.status(StatusCodes.OK).json({ users })
  }
  throw NotFoundError("No user exists!")
};

// Update user
  const updateUser = async (req, res) => {
  const { firstName, lastName, dateOfBirth, country, currentPassword, newPassword } =
    req.body;
    console.log("✨", req.file)
    console.log(req.body)
  if (!currentPassword) {
    throw new UnauthenticatedError(
      "Provide your current password to update user data!"
    );
  }

  const user = await User.findById(req.user._id)

  if (!user) {
    throw new NotFoundError("No logged in user found!")
  }

  if (await user.isPasswordCorrect(currentPassword)) {
    user.firstName = firstName ? firstName : user.firstName
    user.lastName = lastName ? lastName : user.lastName
    user.dateOfBirth = dateOfBirth ? dateOfBirth : user.dateOfBirth
    user.country = country ? country : user.country
    user.password = newPassword ? newPassword : user.password

    deleteOldProfile(user.profile)

    if (req.file) {
      const profileImagePath =
        `${req.protocol}://${req.hostname}:${process.env.PORT}` +
        req.file?.destination
          .replace("public", "")
          .concat("/" + req.file?.filename)
      user.profile = profileImagePath
    }

    await user.save()

    res.status(StatusCodes.ACCEPTED).json({ message: "User updated successfully" })
  }
  throw new UnauthenticatedError("Password was incorrect!")
};

// Get user's data by userId (router parameter)
const getUser = async (req, res) => {
  const { userId } = req.params
  const user = await User.findById(userId)
  if (user) {
    return res.status(StatusCodes.OK).json({ user })
  }
  throw NotFoundError("No user found!")
};

module.exports = {
    getAllUsers,  updateUser, getUser
}