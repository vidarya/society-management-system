const express = require('express');
const router = express.Router();

const billingController = require('./billing.controller');
const { createBillValidation } = require('./billing.validation');
const { authenticate, authorize } = require('../../middlewares/auth.middleware');

router.post('/bills', authenticate, authorize('ADMIN'), createBillValidation, billingController.createBill);
router.get('/bills', authenticate, authorize('ADMIN'), billingController.getAllBills);
router.get('/bills/my', authenticate, billingController.getMyBills);
router.put('/bills/:id/pay', authenticate, billingController.markAsPaid);
router.get('/bills/:id/pdf', authenticate, billingController.downloadBillPdf);

module.exports = router;