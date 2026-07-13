const { validationResult } = require('express-validator');
const visitorsService = require('./visitors.service');

function checkValidation(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return false;
  }
  return true;
}

async function createVisitor(req, res, next) {
  try {
    if (!checkValidation(req, res)) return;

    const { name, phone, purpose, vehicleNumber } = req.body;
    const visitor = await visitorsService.createVisitor(
      { name, phone, purpose, vehicleNumber },
      req.user.userId
    );

    const qrImage = await visitorsService.generateQrImage(visitor.qrCode);

    res.status(201).json({
      message: 'Visitor added successfully',
      data: { ...visitor, qrImage },
    });
  } catch (error) {
    next(error);
  }
}

async function getMyVisitors(req, res, next) {
  try {
    const visitors = await visitorsService.getMyVisitors(req.user.userId);
    res.status(200).json({ data: visitors });
  } catch (error) {
    next(error);
  }
}

async function getAllVisitors(req, res, next) {
  try {
    const visitors = await visitorsService.getAllVisitors();
    res.status(200).json({ data: visitors });
  } catch (error) {
    next(error);
  }
}

async function verifyQrCode(req, res, next) {
  try {
    const { qrCode } = req.params;
    const visitor = await visitorsService.verifyQrCode(qrCode);
    res.status(200).json({ data: visitor });
  } catch (error) {
    next(error);
  }
}

async function checkIn(req, res, next) {
  try {
    const { id } = req.params;
    const visitor = await visitorsService.checkInVisitor(id);
    res.status(200).json({ message: 'Visitor checked in', data: visitor });
  } catch (error) {
    next(error);
  }
}

async function checkOut(req, res, next) {
  try {
    const { id } = req.params;
    const visitor = await visitorsService.checkOutVisitor(id);
    res.status(200).json({ message: 'Visitor checked out', data: visitor });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createVisitor,
  getMyVisitors,
  getAllVisitors,
  verifyQrCode,
  checkIn,
  checkOut,
};