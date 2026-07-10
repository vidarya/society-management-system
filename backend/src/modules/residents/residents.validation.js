const { body } = require('express-validator');

const createFlatValidation = [
  body('flatNumber')
    .trim()
    .notEmpty().withMessage('Flat number is required'),

  body('block')
    .trim()
    .notEmpty().withMessage('Block is required'),

  body('floor')
    .notEmpty().withMessage('Floor is required')
    .isInt({ min: 0 }).withMessage('Floor must be a valid number'),
];

const updateProfileValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
];

const assignFlatValidation = [
  body('flatId')
    .trim()
    .notEmpty().withMessage('flatId is required'),
];

module.exports = {
  createFlatValidation,
  updateProfileValidation,
  assignFlatValidation,
};