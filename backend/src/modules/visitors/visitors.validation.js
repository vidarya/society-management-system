const { body } = require('express-validator');

const createVisitorValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Visitor name is required'),

  body('phone')
    .trim()
    .notEmpty().withMessage('Phone number is required')
    .isLength({ min: 10, max: 15 }).withMessage('Phone number must be valid'),

  body('purpose')
    .trim()
    .notEmpty().withMessage('Purpose is required'),

  body('vehicleNumber')
    .optional()
    .trim(),
];

module.exports = { createVisitorValidation };