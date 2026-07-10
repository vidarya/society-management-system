const { body } = require('express-validator');

const createBillValidation = [
  body('flatId')
    .trim()
    .notEmpty().withMessage('flatId is required'),

  body('amount')
    .notEmpty().withMessage('Amount is required')
    .isFloat({ min: 0.01 }).withMessage('Amount must be a positive number'),

  body('month')
    .trim()
    .notEmpty().withMessage('Month is required')
    .matches(/^\d{4}-\d{2}$/).withMessage('Month must be in YYYY-MM format'),

  body('dueDate')
    .notEmpty().withMessage('Due date is required')
    .isISO8601().withMessage('Due date must be a valid date'),
];

module.exports = { createBillValidation };