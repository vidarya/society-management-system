const { validationResult } = require('express-validator');
const facilitiesService = require('./facilities.service');

function checkValidation(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return false;
  }
  return true;
}

async function createFacility(req, res, next) {
  try {
    if (!checkValidation(req, res)) return;

    const { name, description, capacity } = req.body;
    const facility = await facilitiesService.createFacility({ name, description, capacity });

    res.status(201).json({ message: 'Facility created successfully', data: facility });
  } catch (error) {
    next(error);
  }
}

async function getAllFacilities(req, res, next) {
  try {
    const facilities = await facilitiesService.getAllFacilities();
    res.status(200).json({ data: facilities });
  } catch (error) {
    next(error);
  }
}

async function createBooking(req, res, next) {
  try {
    if (!checkValidation(req, res)) return;

    const { facilityId } = req.params;
    const { date, startTime, endTime } = req.body;

    const booking = await facilitiesService.createBooking(
      facilityId,
      { date, startTime, endTime },
      req.user.userId
    );

    res.status(201).json({ message: 'Booking confirmed', data: booking });
  } catch (error) {
    next(error);
  }
}

async function getMyBookings(req, res, next) {
  try {
    const bookings = await facilitiesService.getMyBookings(req.user.userId);
    res.status(200).json({ data: bookings });
  } catch (error) {
    next(error);
  }
}

async function getAllBookings(req, res, next) {
  try {
    const bookings = await facilitiesService.getAllBookings();
    res.status(200).json({ data: bookings });
  } catch (error) {
    next(error);
  }
}

async function cancelBooking(req, res, next) {
  try {
    const { id } = req.params;
    const booking = await facilitiesService.cancelBooking(id, req.user.userId, req.user.role);
    res.status(200).json({ message: 'Booking cancelled', data: booking });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createFacility,
  getAllFacilities,
  createBooking,
  getMyBookings,
  getAllBookings,
  cancelBooking,
};