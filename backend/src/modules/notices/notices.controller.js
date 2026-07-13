const { validationResult } = require('express-validator');
const noticesService = require('./notices.service');
const prisma = require('../../config/db');

function checkValidation(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return false;
  }
  return true;
}

async function createNotice(req, res, next) {
  try {
    if (!checkValidation(req, res)) return;

    const user = await prisma.user.findUnique({ where: { id: req.user.userId } });

    const { title, content, pinned } = req.body;
    const notice = await noticesService.createNotice(
      { title, content, pinned },
      { userId: req.user.userId, name: user.name }
    );

    res.status(201).json({ message: 'Notice posted successfully', data: notice });
  } catch (error) {
    next(error);
  }
}

async function getAllNotices(req, res, next) {
  try {
    const allNotices = await noticesService.getAllNotices();
    res.status(200).json({ data: allNotices });
  } catch (error) {
    next(error);
  }
}

async function deleteNotice(req, res, next) {
  try {
    const { id } = req.params;
    await noticesService.deleteNotice(id);
    res.status(200).json({ message: 'Notice deleted successfully' });
  } catch (error) {
    next(error);
  }
}

module.exports = { createNotice, getAllNotices, deleteNotice };