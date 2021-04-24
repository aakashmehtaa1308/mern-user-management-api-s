const express = require('express');

const router = express.Router();

const UserCtrl = require('../Controllers/User');
const AuthCtrl = require('../Controllers/Auth');

const {
  ValidateCreate,
  ValidateUpdatePassword,
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
  ValidateUpdatePassword,
  isRequestValidated,
  UserCtrl.updatePassword
);
router.delete(
  '/users/:userId',
  AuthCtrl.requiresSignIn,
  UserCtrl.UserById,
  AuthCtrl.hasAuthorization,
  UserCtrl.Remove
);

module.exports = router;
