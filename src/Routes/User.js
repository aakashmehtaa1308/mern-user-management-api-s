const express = require('express');

const router = express.Router();

const UserCtrl = require('../Controllers/User');
const AuthCtrl = require('../Controllers/Auth');

const {
  ValidateCreate,
  ValidatePassword,
  ValidateEmail,
  isRequestValidated,
} = require('../Validation/User');

router.get('/users', AuthCtrl.requiresSignIn, UserCtrl.List);
router.post(
  '/users/signup',
  ValidateCreate,
  isRequestValidated,
  UserCtrl.Create
);
router.get(
  '/users/:userId',
  AuthCtrl.requiresSignIn,
  UserCtrl.UserById,
  UserCtrl.Read
);
router.put(
  '/users/update-user/:userId',
  AuthCtrl.requiresSignIn,
  UserCtrl.UserById,
  AuthCtrl.hasAuthorization,
  UserCtrl.Update
);

router.put(
  '/users/update-password/:userId',
  AuthCtrl.requiresSignIn,
  UserCtrl.UserById,
  AuthCtrl.hasAuthorization,
  ValidatePassword,
  isRequestValidated,
  UserCtrl.updatePassword
);

router.put(
  '/users/forgot-password',
  ValidateEmail,
  isRequestValidated,
  UserCtrl.forgotPassword
);
router.put(
  '/users/reset-password/:userId',
  UserCtrl.UserById,
  ValidatePassword,
  isRequestValidated,
  UserCtrl.resetPassword
);
router.delete(
  '/users/:userId',
  AuthCtrl.requiresSignIn,
  UserCtrl.UserById,
  AuthCtrl.hasAuthorization,
  UserCtrl.Remove
);

module.exports = router;
