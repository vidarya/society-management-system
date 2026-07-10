const { validationResult } = require('express-validator');
const residentsService = require('./residents.service');

function checkValidation(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return false;
  }
  return true;
}

async function createFlat(req, res, next) {
  try {
    if (!checkValidation(req, res)) return;

    const { flatNumber, block, floor } = req.body;
    const flat = await residentsService.createFlat({ flatNumber, block, floor: Number(floor) });

    res.status(201).json({ message: 'Flat created successfully', data: flat });
  } catch (error) {
    next(error);
  }
}

async function getAllFlats(req, res, next) {
  try {
    const flats = await residentsService.getAllFlats();
    res.status(200).json({ data: flats });
  } catch (error) {
    next(error);
  }
}

async function getAllResidents(req, res, next) {
  try {
    const residents = await residentsService.getAllResidents();
    res.status(200).json({ data: residents });
  } catch (error) {
    next(error);
  }
}

async function getMyProfile(req, res, next) {
  try {
    const profile = await residentsService.getMyProfile(req.user.userId);
    res.status(200).json({ data: profile });
  } catch (error) {
    next(error);
  }
}

async function updateMyProfile(req, res, next) {
  try {
    if (!checkValidation(req, res)) return;

    const updated = await residentsService.updateMyProfile(req.user.userId, req.body);
    res.status(200).json({ message: 'Profile updated', data: updated });
  } catch (error) {
    next(error);
  }
}

async function assignFlat(req, res, next) {
  try {
    if (!checkValidation(req, res)) return;

    const { id } = req.params;
    const { flatId } = req.body;

    const updated = await residentsService.assignResidentToFlat(id, flatId);
    res.status(200).json({ message: 'Resident assigned to flat', data: updated });
  } catch (error) {
    next(error);
  }
}

async function deleteResident(req, res, next) {
  try {
    const { id } = req.params;
    await residentsService.deleteResident(id);
    res.status(200).json({ message: 'Resident deleted successfully' });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createFlat,
  getAllFlats,
  getAllResidents,
  getMyProfile,
  updateMyProfile,
  assignFlat,
  deleteResident,
};