const express = require('express');
const router = express.Router();

const AuthCtrl = require('../Controllers/Auth');

router.post('/signin', AuthCtrl.signIn);
router.get('/signout', AuthCtrl.signOut);

module.exports = router;
