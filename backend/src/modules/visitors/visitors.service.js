const crypto = require('crypto');
const QRCode = require('qrcode');
const prisma = require('../../config/db');

async function createVisitor({ name, phone, purpose, vehicleNumber }, userId) {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user || !user.flatId) {
    const error = new Error('You must be assigned to a flat to add a visitor');
    error.statusCode = 400;
    throw error;
  }

  const qrCode = crypto.randomBytes(16).toString('hex');

  const visitor = await prisma.visitor.create({
    data: {
      name,
      phone,
      purpose,
      vehicleNumber,
      flatId: user.flatId,
      approvedById: userId,
      qrCode,
      status: 'APPROVED',
    },
  });

  return visitor;
}

async function getMyVisitors(userId) {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user || !user.flatId) {
    return [];
  }

  return prisma.visitor.findMany({
    where: { flatId: user.flatId },
    orderBy: { createdAt: 'desc' },
  });
}

async function getAllVisitors() {
  return prisma.visitor.findMany({
    include: {
      flat: true,
      approvedBy: { select: { id: true, name: true, email: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
}

async function generateQrImage(qrCode) {
  const dataUrl = await QRCode.toDataURL(qrCode);
  return dataUrl;
}

async function verifyQrCode(qrCode) {
  const visitor = await prisma.visitor.findUnique({
    where: { qrCode },
    include: { flat: true },
  });

  if (!visitor) {
    const error = new Error('Invalid QR code');
    error.statusCode = 404;
    throw error;
  }

  return visitor;
}

async function checkInVisitor(visitorId) {
  const visitor = await prisma.visitor.findUnique({
    where: { id: visitorId },
    include: { logs: true },
  });

  if (!visitor) {
    const error = new Error('Visitor not found');
    error.statusCode = 404;
    throw error;
  }

  const openLog = visitor.logs.find((log) => log.exitTime === null);
  if (openLog) {
    const error = new Error('Visitor is already checked in');
    error.statusCode = 409;
    throw error;
  }

  await prisma.visitorLog.create({
    data: { visitorId },
  });

  return prisma.visitor.update({
    where: { id: visitorId },
    data: { status: 'CHECKED_IN' },
    include: { logs: true },
  });
}

async function checkOutVisitor(visitorId) {
  const visitor = await prisma.visitor.findUnique({
    where: { id: visitorId },
    include: { logs: true },
  });

  if (!visitor) {
    const error = new Error('Visitor not found');
    error.statusCode = 404;
    throw error;
  }

  const openLog = visitor.logs.find((log) => log.exitTime === null);
  if (!openLog) {
    const error = new Error('Visitor is not currently checked in');
    error.statusCode = 409;
    throw error;
  }

  await prisma.visitorLog.update({
    where: { id: openLog.id },
    data: { exitTime: new Date() },
  });

  return prisma.visitor.update({
    where: { id: visitorId },
    data: { status: 'CHECKED_OUT' },
    include: { logs: true },
  });
}

module.exports = {
  createVisitor,
  getMyVisitors,
  getAllVisitors,
  generateQrImage,
  verifyQrCode,
  checkInVisitor,
  checkOutVisitor,
};