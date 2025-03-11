const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const {Verify} = require('../middlewares/authenticationMiddleware');

router.post('/login', authController.login);
router.post('/register', authController.register);
router.get('/check-auth', Verify, authController.checkAuth);
router.get('/logout', authController.logout);

module.exports = router;
