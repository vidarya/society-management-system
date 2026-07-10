const express = require('express');
const router = express.Router();

const residentsController = require('./residents.controller');
const {
  createFlatValidation,
  updateProfileValidation,
  assignFlatValidation,
} = require('./residents.validation');
const { authenticate, authorize } = require('../../middlewares/auth.middleware');

// Flats
router.post('/flats', authenticate, authorize('ADMIN'), createFlatValidation, residentsController.createFlat);
router.get('/flats', authenticate, residentsController.getAllFlats);

// Residents
router.get('/residents', authenticate, authorize('ADMIN'), residentsController.getAllResidents);
router.get('/residents/me', authenticate, residentsController.getMyProfile);
router.put('/residents/me', authenticate, updateProfileValidation, residentsController.updateMyProfile);
router.put('/residents/:id/assign-flat', authenticate, authorize('ADMIN'), assignFlatValidation, residentsController.assignFlat);
router.delete('/residents/:id', authenticate, authorize('ADMIN'), residentsController.deleteResident);

module.exports = router;