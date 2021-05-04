const User = require('../Models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const env = require('dotenv');

env.config();

const signIn = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({
        message: `User doesn't exist.`,
        error: `User doesn't exists with this e-mail. Please enter the correct e-mail.`,
      });
    }
    bcrypt.compare(req.body.password, user.password, (error, result) => {
      if (error) {
        return res.status(400).json({
          message: `Server error`,
          error: `something went wrong. Please try again.`,
        });
      }
      if (!result) {
        return res.status(400).json({
          message: `Wrong Password.`,
          error: `The password you entered isn't correct. Please Enter the correct password.`,
        });
      }

      const token = jwt.sign({ _id: user._id }, process.env.secret, {
        expiresIn: '1h',
      });
      // res.cookie('token', token, { expire: new Date() + 9999 });
      return res.status(200).json({
        message: `User sign-in successfully`,
        token,
        user: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          username: user.username,
          createdAt: user.createdAt,
        },
      });
    });
  } catch (error) {
    return res.status(400).json({
      message: `Something went wrong.`,
      error: `Couldn't Sign-in. Please try again after sometime.`,
    });
  }
};

const signOut = (req, res, next) => {
  try {
    res.clearCookie('token');
    return res.status(200).json({ message: `User signed-out successfully.` });
  } catch (error) {
    return res.status(400).json({
      message: `Something went wrong.`,
      error: `Couldn't sign-out. Please try again.`,
    });
  }
};

const requiresSignIn = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const user = jwt.verify(token, process.env.secret);
    req.user = user;
    next();
  } catch (error) {
    return res.status(404).json({
      message: `Session Expired`,
      error: `Your session expired. Sign-in again required.`,
    });
  }
};

const hasAuthorization = (req, res, next) => {
  try {
    let authorized =
      req.profile &&
      req.user &&
      req.profile._id.toString() == req.user._id.toString();
    if (!authorized) {
      return res.status(403).json({
        message: 'Authorization error',
        error: `User is not Authorized to do this action.`,
      });
    }
    next();
  } catch (error) {
    return res.status(400).json({
      message: 'Authorization error',
      error: `Something went wrong. May be user is not authorized.`,
    });
  }
};

module.exports = { signIn, signOut, requiresSignIn, hasAuthorization };
