const prisma = require('../../config/db');

async function createBill({ flatId, amount, month, dueDate }) {
  const flat = await prisma.flat.findUnique({ where: { id: flatId } });
  if (!flat) {
    const error = new Error('Flat not found');
    error.statusCode = 404;
    throw error;
  }

  const bill = await prisma.bill.create({
    data: {
      flatId,
      amount,
      month,
      dueDate: new Date(dueDate),
      status: 'UNPAID',
    },
  });

  return bill;
}

async function getAllBills() {
  return prisma.bill.findMany({
    include: { flat: true },
    orderBy: { createdAt: 'desc' },
  });
}

async function getMyBills(userId) {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user || !user.flatId) {
    const error = new Error('You are not assigned to any flat yet');
    error.statusCode = 404;
    throw error;
  }

  return prisma.bill.findMany({
    where: { flatId: user.flatId },
    orderBy: { createdAt: 'desc' },
  });
}

async function markBillAsPaid(billId, userId, userRole) {
  const bill = await prisma.bill.findUnique({
    where: { id: billId },
    include: { flat: true },
  });

  if (!bill) {
    const error = new Error('Bill not found');
    error.statusCode = 404;
    throw error;
  }

  if (userRole !== 'ADMIN') {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user.flatId !== bill.flatId) {
      const error = new Error('You are not authorized to update this bill');
      error.statusCode = 403;
      throw error;
    }
  }

  if (bill.status === 'PAID') {
    const error = new Error('Bill is already marked as paid');
    error.statusCode = 409;
    throw error;
  }

  const updatedBill = await prisma.bill.update({
    where: { id: billId },
    data: { status: 'PAID', paidAt: new Date() },
  });

  return updatedBill;
}

async function getBillForPdf(billId, userId, userRole) {
  const bill = await prisma.bill.findUnique({
    where: { id: billId },
    include: { flat: true },
  });

  if (!bill) {
    const error = new Error('Bill not found');
    error.statusCode = 404;
    throw error;
  }

  if (userRole !== 'ADMIN') {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user.flatId !== bill.flatId) {
      const error = new Error('You are not authorized to view this bill');
      error.statusCode = 403;
      throw error;
    }
  }

  return bill;
}

module.exports = {
  createBill,
  getAllBills,
  getMyBills,
  markBillAsPaid,
  getBillForPdf,
};