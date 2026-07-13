const express = require('express');
const router = express.Router();

const facilitiesController = require('./facilities.controller');
const { createFacilityValidation, createBookingValidation } = require('./facilities.validation');
const { authenticate, authorize } = require('../../middlewares/auth.middleware');

router.post('/facilities', authenticate, authorize('ADMIN'), createFacilityValidation, facilitiesController.createFacility);
router.get('/facilities', authenticate, facilitiesController.getAllFacilities);
router.post('/facilities/:facilityId/bookings', authenticate, createBookingValidation, facilitiesController.createBooking);
router.get('/facilities/bookings/my', authenticate, facilitiesController.getMyBookings);
router.get('/facilities/bookings', authenticate, authorize('ADMIN'), facilitiesController.getAllBookings);
router.put('/facilities/bookings/:id/cancel', authenticate, facilitiesController.cancelBooking);

module.exports = router;