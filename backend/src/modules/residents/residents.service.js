const prisma = require('../../config/db');

async function createFlat({ flatNumber, block, floor }) {
  const existingFlat = await prisma.flat.findUnique({ where: { flatNumber } });
  if (existingFlat) {
    const error = new Error('A flat with this number already exists');
    error.statusCode = 409;
    throw error;
  }

  const flat = await prisma.flat.create({
    data: { flatNumber, block, floor },
  });

  return flat;
}

async function getAllFlats() {
  return prisma.flat.findMany({
    include: { residents: true },
    orderBy: { flatNumber: 'asc' },
  });
}

async function getAllResidents() {
  return prisma.user.findMany({
    where: { role: 'RESIDENT' },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      flatId: true,
      flat: true,
      createdAt: true,
    },
  });
}

async function getMyProfile(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      flatId: true,
      flat: true,
      createdAt: true,
    },
  });

  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  return user;
}

async function updateMyProfile(userId, { name }) {
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { ...(name && { name }) },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      flatId: true,
    },
  });

  return updatedUser;
}

async function assignResidentToFlat(residentId, flatId) {
  const flat = await prisma.flat.findUnique({ where: { id: flatId } });
  if (!flat) {
    const error = new Error('Flat not found');
    error.statusCode = 404;
    throw error;
  }

  const resident = await prisma.user.findUnique({ where: { id: residentId } });
  if (!resident) {
    const error = new Error('Resident not found');
    error.statusCode = 404;
    throw error;
  }

  const updatedResident = await prisma.user.update({
    where: { id: residentId },
    data: { flatId },
    select: {
      id: true,
      name: true,
      email: true,
      flatId: true,
      flat: true,
    },
  });

  return updatedResident;
}

async function deleteResident(residentId) {
  const resident = await prisma.user.findUnique({ where: { id: residentId } });
  if (!resident) {
    const error = new Error('Resident not found');
    error.statusCode = 404;
    throw error;
  }

  await prisma.user.delete({ where: { id: residentId } });
}

module.exports = {
  createFlat,
  getAllFlats,
  getAllResidents,
  getMyProfile,
  updateMyProfile,
  assignResidentToFlat,
  deleteResident,
};