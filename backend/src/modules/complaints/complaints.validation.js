const { body } = require('express-validator');

const createComplaintValidation = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 3 }).withMessage('Title must be at least 3 characters'),

  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),

  body('priority')
    .optional()
    .isIn(['LOW', 'MEDIUM', 'HIGH']).withMessage('Invalid priority'),
];

const assignComplaintValidation = [
  body('assignedToId')
    .trim()
    .notEmpty().withMessage('assignedToId is required'),
];

const updateStatusValidation = [
  body('status')
    .trim()
    .notEmpty().withMessage('Status is required')
    .isIn(['OPEN', 'IN_PROGRESS', 'RESOLVED']).withMessage('Invalid status'),
];

module.exports = {
  createComplaintValidation,
  assignComplaintValidation,
  updateStatusValidation,
};