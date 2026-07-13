const { body } = require('express-validator');

const createFacilityValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Facility name is required'),

  body('description')
    .optional()
    .trim(),

  body('capacity')
    .optional()
    .isInt({ min: 1 }).withMessage('Capacity must be a positive number'),
];

const createBookingValidation = [
  body('date')
    .notEmpty().withMessage('Date is required')
    .isISO8601().withMessage('Date must be valid'),

  body('startTime')
    .trim()
    .notEmpty().withMessage('Start time is required')
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('Start time must be in HH:MM format'),

  body('endTime')
    .trim()
    .notEmpty().withMessage('End time is required')
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('End time must be in HH:MM format'),
];

module.exports = { createFacilityValidation, createBookingValidation };