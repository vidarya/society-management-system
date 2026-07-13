const { body } = require('express-validator');

const createNoticeValidation = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required'),

  body('content')
    .trim()
    .notEmpty().withMessage('Content is required'),

  body('pinned')
    .optional()
    .isBoolean().withMessage('Pinned must be true or false'),
];

module.exports = { createNoticeValidation };