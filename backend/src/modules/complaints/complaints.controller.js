const { validationResult } = require('express-validator');
const complaintsService = require('./complaints.service');

function checkValidation(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return false;
  }
  return true;
}

async function createComplaint(req, res, next) {
  try {
    if (!checkValidation(req, res)) return;

    const { title, description, priority } = req.body;
    const complaint = await complaintsService.createComplaint(
      { title, description, priority },
      req.user.userId
    );

    res.status(201).json({ message: 'Complaint raised successfully', data: complaint });
  } catch (error) {
    next(error);
  }
}

async function getAllComplaints(req, res, next) {
  try {
    const complaints = await complaintsService.getAllComplaints();
    res.status(200).json({ data: complaints });
  } catch (error) {
    next(error);
  }
}

async function getMyComplaints(req, res, next) {
  try {
    const complaints = await complaintsService.getMyComplaints(req.user.userId);
    res.status(200).json({ data: complaints });
  } catch (error) {
    next(error);
  }
}

async function assignComplaint(req, res, next) {
  try {
    if (!checkValidation(req, res)) return;

    const { id } = req.params;
    const { assignedToId } = req.body;

    const updated = await complaintsService.assignComplaint(id, assignedToId);
    res.status(200).json({ message: 'Complaint assigned successfully', data: updated });
  } catch (error) {
    next(error);
  }
}

async function updateStatus(req, res, next) {
  try {
    if (!checkValidation(req, res)) return;

    const { id } = req.params;
    const { status } = req.body;

    const updated = await complaintsService.updateStatus(id, status);
    res.status(200).json({ message: 'Complaint status updated', data: updated });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createComplaint,
  getAllComplaints,
  getMyComplaints,
  assignComplaint,
  updateStatus,
};