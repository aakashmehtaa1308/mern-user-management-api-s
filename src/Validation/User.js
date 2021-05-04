const { check, body, validationResult } = require('express-validator');
const User = require('../Models/User');

const ValidateCreate = [
  check('firstName').notEmpty().withMessage(`First Name is required`),
  check('lastName').notEmpty().withMessage(`Last Name is required`),
  check('email')
    .isEmail()
    .withMessage(`The input email is not valid.Please enter a valid email`),
  check('email').custom(async (value) => {
    const user = await User.findOne({ email: value });
    if (user) {
      return Promise.reject(
        `This email is already is in use. Please enter any other email`
      );
    }
    return true;
  }),
  check('password')
    .isLength({ min: 5 })
    .withMessage(`Password length must be greater than 5 characters`),
  body('password').custom((value, { req }) => {
    if (value !== req.body.confirmPassword) {
      return Promise.reject(
        `Password mismatch occured. Please check carefully and enter again.`
      );
    }
    return true;
  }),
  check('username').notEmpty().withMessage(`Username is required`),
  check('username').custom(async (value) => {
    const user = await User.findOne({ username: value });
    if (user) {
      return Promise.reject(
        `This username is already is in use by someone. Please select any other username`
      );
    }
    return true;
  }),
];

const ValidateEmail = [
  check('email')
    .isEmail()
    .withMessage(`The input email is not valid.Please enter a valid email`),
];

const ValidatePassword = [
  check('password')
    .isLength({ min: 5 })
    .withMessage(`Password length must be greater than 5 characters`),
  body('password').custom((value, { req }) => {
    if (value !== req.body.confirmPassword) {
      return Promise.reject(
        `Password mismatch occured. Please check carefully and enter again.`
      );
    }
    return true;
  }),
];

const isRequestValidated = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.array().length > 0) {
    return res.status(400).json({
      message: `validation error`,
      error: errors.array()[0].msg,
    });
  }
  next();
};

module.exports = {
  ValidateCreate,
  isRequestValidated,
  ValidatePassword,
  ValidateEmail,
};
