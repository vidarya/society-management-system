const express = require('express');
const router = express.Router();

const authController = require('./auth.controller');
const { registerValidation, loginValidation } = require('./auth.validation');
const { authenticate } = require('../../middlewares/auth.middleware');

router.post('/register', registerValidation, authController.register);
router.post('/login', loginValidation, authController.login);
router.get('/me', authenticate, authController.getMe);

module.exports = router;