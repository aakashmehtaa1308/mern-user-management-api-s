const User = require('../Models/User');
const bcrypt = require('bcrypt');

const Create = (req, res, next) => {
  console.log(req.body);
  const { firstName, lastName, email, username, password } = req.body;

  try {
    bcrypt.hash(password, 10, async (error, hash) => {
      if (error) {
        return res.status(400).json({
          error: `user can not be created. Please try again later sometime.`,
          message: error,
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
        message: 'user created successfully',
        user: createdUser,
      });
    });
  } catch (error) {
    return res.status(400).json({
      error: `user can not be created. Please try again later sometime`,
      message: error,
    });
  }
};

const List = async (req, res, next) => {
  try {
    const users = await User.find().select(
      `firstName lastName email username createdAt`
    );
    if (!users) {
      return res.status(200).json({ message: `There is no user available` });
    }
    return res.status(200).json({ users });
  } catch (error) {
    return res.status(400).json({
      error: `Something went wrong. Please try again after sometime`,
      message: error,
    });
  }
};

// loading user by id in the request for further queries.
const UserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(400).json({ error: `User Not Found`, message: error });
    }
    req.profile = user;
    next();
  } catch (error) {
    return res
      .status(400)
      .json({ error: `Could not retrieve user`, message: error });
  }
};

const Read = (req, res, next) => {
  if (!req.profile) {
    res.status(400).json({ error: 'User does not exist' });
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
          message: error,
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
      message: error,
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
      .json({ message: `User deleted successfully`, user: deletedUser });
  } catch (error) {
    res.status(400).json({
      error: `User can't be deleted. Something went wrong. Please try again after sometime`,
      message: error,
    });
  }
};

const updatePassword = (req, res, next) => {
  try {
    const user = req.profile;
    bcrypt.hash(req.body.password, 10, async (error, hash) => {
      if (error) {
        return res.status(400).json({
          error: `Something went wrong. Please try again.`,
          message: error,
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
      error: `Something went wrong. Please try again.`,
      message: error,
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
};
