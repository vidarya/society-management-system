const { validationResult } = require('express-validator');
const authService = require('./auth.service');

async function register(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, role } = req.body;
    const result = await authService.registerUser({ name, email, password, role });

    res.status(201).json({
      message: 'User registered successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    const result = await authService.loginUser({ email, password });

    res.status(200).json({
      message: 'Login successful',
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

async function getMe(req, res, next) {
  try {
    const user = await authService.getCurrentUser(req.user.userId);
    res.status(200).json({ data: user });
  } catch (error) {
    next(error);
  }
}

module.exports = { register, login, getMe };