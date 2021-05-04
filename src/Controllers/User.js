const User = require('../Models/User');
const bcrypt = require('bcrypt');

const Create = (req, res, next) => {
  const { firstName, lastName, email, username, password } = req.body;

  try {
    bcrypt.hash(password, 10, async (error, hash) => {
      if (error) {
        return res.status(400).json({
          error: `user can not be created. Please try again later sometime.`,
          message: 'Something went wrong.',
        });
      }
      const user = new User({
        firstName,
        lastName,
        email,
        password: hash,
        username,
      });
      const createdUser = await user.save();
      createdUser.password = undefined;
      return res.status(200).json({
        message: 'user created successfully.',
        user: createdUser,
      });
    });
  } catch (error) {
    return res.status(400).json({
      error: `user can not be created. Please try again later sometime.`,
      message: 'Something went wrong',
    });
  }
};

const List = async (req, res, next) => {
  try {
    const users = await User.find().select(
      `firstName lastName email username createdAt`
    );
    if (!users) {
      return res.status(200).json({ message: `There is no user available.` });
    }
    return res.status(200).json({ users });
  } catch (error) {
    return res.status(400).json({
      error: `Please try again after sometime.`,
      message: 'Something went wrong',
    });
  }
};

// loading user by id in the request for further queries.
const UserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(400).json({
        message: `User Not Found.`,
        error: `Couldn't find user with this this user-id. Please try again.`,
      });
    }
    req.profile = user;
    next();
  } catch (error) {
    return res.status(400).json({
      message: `Could not retrieve user.`,
      error: `we don't find any user with this user-id.`,
    });
  }
};

const Read = (req, res, next) => {
  if (!req.profile) {
    res.status(400).json({
      message: 'User does not exist.',
      error: `we don't find any user with this user-id`,
    });
  }
  req.profile.password = undefined;
  res.status(200).json({ user: req.profile });
};

const Update = async (req, res, next) => {
  try {
    const user = req.profile;
    if (req.body.firstName) {
      user.firstName = req.body.firstName;
    }
    if (req.body.lastName) {
      user.lastName = req.body.lastName;
    }
    if (req.body.username) {
      const newUser = await User.findOne({ username: req.body.username });
      if (newUser && newUser._id.toString() !== user._id.toString()) {
        return res.status(400).json({
          error: `Username already exists. Please enter another username.`,
          message: 'User already exists with this username.',
        });
      }
      user.username = req.body.username;
    }
    const updatedUser = await user.save();
    updatedUser.password = undefined;
    // res.clearCookie('token');
    return res
      .status(200)
      .json({ message: `User updated successfully.`, user: updatedUser });
  } catch (error) {
    res.status(400).json({
      error: `User can't be updated. Something went wrong. Please try again later after sometime.`,
      message: 'Something went wrong.',
    });
  }
};

const Remove = async (req, res, next) => {
  try {
    const user = req.profile;
    const deletedUser = await user.remove();
    deletedUser.password = undefined;
    res
      .status(200)
      .json({ message: `User deleted successfully.`, user: deletedUser });
  } catch (error) {
    res.status(400).json({
      error: `User can't be deleted. Please try again after sometime.`,
      message: `Something went wrong.`,
    });
  }
};

const updatePassword = (req, res, next) => {
  try {
    const user = req.profile;
    bcrypt.hash(req.body.password, 10, async (error, hash) => {
      if (error) {
        return res.status(400).json({
          error: `Please try again.`,
          message: 'Something went wrong.',
        });
      }
      user.password = hash;
      const updatedUser = await user.save();
      updatedUser.password = undefined;
      res.clearCookie('token');
      return res
        .status(200)
        .json({ message: `Password changed successfully.`, user: updatedUser });
    });
  } catch (error) {
    return res.status(400).json({
      error: `Please try again.`,
      message: 'Something went wrong',
    });
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    if (!req.body.email) {
      return res.status(400).json({
        message: 'Email not Found.',
        error: 'Email is necessary to reset your password.',
      });
    }
    const email = req.body.email;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({
        message: 'User not found.',
        error:
          'User with this email is not found. Please enter the correct email.',
      });
    }
    user.password = undefined;
    return res.status(200).json({ message: 'User found', user: user });
  } catch (error) {
    return res.status(400).json({
      message: 'Something went wrong.',
      error:
        'Error occurred due to some server issues. Please try again after sometime.',
    });
  }
};

const resetPassword = (req, res, next) => {
  try {
    const user = req.profile;
    bcrypt.hash(req.body.password, 10, async (error, hash) => {
      if (error) {
        return res.status(400).json({
          error: `Please try again.`,
          message: `Something went wrong.`,
        });
      }
      user.password = hash;
      const updatedUser = await user.save();
      updatedUser.password = undefined;
      return res
        .status(200)
        .json({ message: `Password changed successfully.` });
    });
  } catch (error) {
    return res.status(400).json({
      error: `Please try again.`,
      message: `Something went wrong.`,
    });
  }
};

module.exports = {
  Create,
  List,
  UserById,
  Read,
  Update,
  Remove,
  updatePassword,
  forgotPassword,
  resetPassword,
};
