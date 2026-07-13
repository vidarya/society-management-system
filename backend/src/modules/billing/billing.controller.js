const { validationResult } = require('express-validator');
const billingService = require('./billing.service');
const { generateBillPdf } = require('../../utils/pdfGenerator');
const { generateBillsExcel } = require('../../utils/excelGenerator');

function checkValidation(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return false;
  }
  return true;
}

async function createBill(req, res, next) {
  try {
    if (!checkValidation(req, res)) return;

    const { flatId, amount, month, dueDate } = req.body;
    const bill = await billingService.createBill({
      flatId,
      amount: Number(amount),
      month,
      dueDate,
    });

    res.status(201).json({ message: 'Bill created successfully', data: bill });
  } catch (error) {
    next(error);
  }
}

async function getAllBills(req, res, next) {
  try {
    const bills = await billingService.getAllBills();
    res.status(200).json({ data: bills });
  } catch (error) {
    next(error);
  }
}

async function getMyBills(req, res, next) {
  try {
    const bills = await billingService.getMyBills(req.user.userId);
    res.status(200).json({ data: bills });
  } catch (error) {
    next(error);
  }
}

async function markAsPaid(req, res, next) {
  try {
    const { id } = req.params;
    const bill = await billingService.markBillAsPaid(id, req.user.userId, req.user.role);
    res.status(200).json({ message: 'Bill marked as paid', data: bill });
  } catch (error) {
    next(error);
  }
}

async function downloadBillPdf(req, res, next) {
  try {
    const { id } = req.params;
    const bill = await billingService.getBillForPdf(id, req.user.userId, req.user.role);
    generateBillPdf(bill, res);
  } catch (error) {
    next(error);
  }
}

async function exportBillsExcel(req, res, next) {
  try {
    const bills = await billingService.getAllBills();
    await generateBillsExcel(bills, res);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createBill,
  getAllBills,
  getMyBills,
  markAsPaid,
  downloadBillPdf,
  exportBillsExcel,
};