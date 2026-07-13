const express = require('express');
const router = express.Router();

const visitorsController = require('./visitors.controller');
const { createVisitorValidation } = require('./visitors.validation');
const { authenticate, authorize } = require('../../middlewares/auth.middleware');

router.post('/visitors', authenticate, createVisitorValidation, visitorsController.createVisitor);
router.get('/visitors/my', authenticate, visitorsController.getMyVisitors);
router.get('/visitors', authenticate, authorize('ADMIN', 'SECURITY'), visitorsController.getAllVisitors);
router.get('/visitors/verify/:qrCode', authenticate, authorize('ADMIN', 'SECURITY'), visitorsController.verifyQrCode);
router.put('/visitors/:id/checkin', authenticate, authorize('ADMIN', 'SECURITY'), visitorsController.checkIn);
router.put('/visitors/:id/checkout', authenticate, authorize('ADMIN', 'SECURITY'), visitorsController.checkOut);

module.exports = router;