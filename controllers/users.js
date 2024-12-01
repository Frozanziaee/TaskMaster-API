const deleteOldProfile = require("../utils/delete-old-profile");
const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { NotFoundError, UnauthenticatedError } = require("../errors");

// Get all users data
const getAllUsers = async (req, res) => {
  const users = await User.find().select("firstName lastName profile");
  if (users.length) {
    return res.status(StatusCodes.OK).json({ users });
  }
  throw NotFoundError("No user exists!");
};

// Update user
const updateUser = async (req, res) => {
  const {
    firstName,
    lastName,
    dateOfBirth,
    country,
    currentPassword,
    newPassword,
  } = req.body;
  console.log(req.body);
  if (!currentPassword) {
    throw new UnauthenticatedError(
      "Provide your current password to update user data!"
    );
  }

  console.log(req.user);
  const user = await User.findById(req.user.userId);

  if (!user) {
    throw new NotFoundError("No logged in user found!");
  }

  if (await user.comparePassword(currentPassword)) {
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.dateOfBirth = dateOfBirth || user.dateOfBirth;
    user.country = country || user.country;
    user.password = newPassword || user.password;

    //

    if (req.file) {
      const profileImagePath = `
        ${req.protocol}://${req.hostname}:${process.env.PORT}` +
        req.file?.destination
          .replace("public", "")
          .concat("/" + req.file?.filename);
          deleteOldProfile(user.profile);
          user.profile = profileImagePath;
    }

    await user.save();

    res
      .status(StatusCodes.ACCEPTED)
      .json({ message: "User updated successfully", user });
  }
  throw new UnauthenticatedError("Password was incorrect!");
};

// Get user's data by userId (router parameter)
const getUser = async (req, res) => {
  const { userId } = req.params;
  const user = await User.findById(userId);
  if (user) {
    res.status(StatusCodes.OK).json({ user });
  }
  throw NotFoundError("No user found!");
};

module.exports = {
  getAllUsers,
  updateUser,
  getUser,
};