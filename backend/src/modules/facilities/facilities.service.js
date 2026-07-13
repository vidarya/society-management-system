const prisma = require('../../config/db');

async function createFacility({ name, description, capacity }) {
  const existing = await prisma.facility.findUnique({ where: { name } });
  if (existing) {
    const error = new Error('A facility with this name already exists');
    error.statusCode = 409;
    throw error;
  }

  return prisma.facility.create({
    data: { name, description, capacity },
  });
}

async function getAllFacilities() {
  return prisma.facility.findMany({ orderBy: { name: 'asc' } });
}

function timesOverlap(existingStart, existingEnd, newStart, newEnd) {
  return existingStart < newEnd && existingEnd > newStart;
}

async function createBooking(facilityId, { date, startTime, endTime }, userId) {
  const facility = await prisma.facility.findUnique({ where: { id: facilityId } });
  if (!facility) {
    const error = new Error('Facility not found');
    error.statusCode = 404;
    throw error;
  }

  if (startTime >= endTime) {
    const error = new Error('Start time must be before end time');
    error.statusCode = 400;
    throw error;
  }

  const dateOnly = new Date(date);
  dateOnly.setHours(0, 0, 0, 0);

  const existingBookings = await prisma.facilityBooking.findMany({
    where: {
      facilityId,
      date: dateOnly,
      status: 'CONFIRMED',
    },
  });

  const hasConflict = existingBookings.some((booking) =>
    timesOverlap(booking.startTime, booking.endTime, startTime, endTime)
  );

  if (hasConflict) {
    const error = new Error('This time slot is already booked for this facility');
    error.statusCode = 409;
    throw error;
  }

  return prisma.facilityBooking.create({
    data: {
      facilityId,
      bookedById: userId,
      date: dateOnly,
      startTime,
      endTime,
    },
  });
}

async function getMyBookings(userId) {
  return prisma.facilityBooking.findMany({
    where: { bookedById: userId },
    include: { facility: true },
    orderBy: { date: 'desc' },
  });
}

async function getAllBookings() {
  return prisma.facilityBooking.findMany({
    include: {
      facility: true,
      bookedBy: { select: { id: true, name: true, email: true } },
    },
    orderBy: { date: 'desc' },
  });
}

async function cancelBooking(bookingId, userId, userRole) {
  const booking = await prisma.facilityBooking.findUnique({ where: { id: bookingId } });

  if (!booking) {
    const error = new Error('Booking not found');
    error.statusCode = 404;
    throw error;
  }

  if (userRole !== 'ADMIN' && booking.bookedById !== userId) {
    const error = new Error('You are not authorized to cancel this booking');
    error.statusCode = 403;
    throw error;
  }

  return prisma.facilityBooking.update({
    where: { id: bookingId },
    data: { status: 'CANCELLED' },
  });
}

module.exports = {
  createFacility,
  getAllFacilities,
  createBooking,
  getMyBookings,
  getAllBookings,
  cancelBooking,
};