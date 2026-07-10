const express = require('express');
const router = express.Router();

const complaintsController = require('./complaints.controller');
const {
  createComplaintValidation,
  assignComplaintValidation,
  updateStatusValidation,
} = require('./complaints.validation');
const { authenticate, authorize } = require('../../middlewares/auth.middleware');

router.post('/complaints', authenticate, createComplaintValidation, complaintsController.createComplaint);
router.get('/complaints', authenticate, authorize('ADMIN'), complaintsController.getAllComplaints);
router.get('/complaints/my', authenticate, complaintsController.getMyComplaints);
router.put('/complaints/:id/assign', authenticate, authorize('ADMIN'), assignComplaintValidation, complaintsController.assignComplaint);
router.put('/complaints/:id/status', authenticate, authorize('ADMIN'), updateStatusValidation, complaintsController.updateStatus);

module.exports = router;