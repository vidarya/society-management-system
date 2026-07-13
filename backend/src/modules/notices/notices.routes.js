const express = require('express');
const router = express.Router();

const noticesController = require('./notices.controller');
const { createNoticeValidation } = require('./notices.validation');
const { authenticate, authorize } = require('../../middlewares/auth.middleware');

router.post('/notices', authenticate, authorize('ADMIN'), createNoticeValidation, noticesController.createNotice);
router.get('/notices', authenticate, noticesController.getAllNotices);
router.delete('/notices/:id', authenticate, authorize('ADMIN'), noticesController.deleteNotice);

module.exports = router;