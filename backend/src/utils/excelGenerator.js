const ExcelJS = require('exceljs');

async function generateResidentsExcel(residents, res) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Residents');

  sheet.columns = [
    { header: 'Name', key: 'name', width: 25 },
    { header: 'Email', key: 'email', width: 30 },
    { header: 'Flat Number', key: 'flatNumber', width: 15 },
    { header: 'Block', key: 'block', width: 10 },
    { header: 'Joined On', key: 'createdAt', width: 20 },
  ];

  sheet.getRow(1).font = { bold: true };

  residents.forEach((resident) => {
    sheet.addRow({
      name: resident.name,
      email: resident.email,
      flatNumber: resident.flat ? resident.flat.flatNumber : 'Not assigned',
      block: resident.flat ? resident.flat.block : '-',
      createdAt: new Date(resident.createdAt).toDateString(),
    });
  });

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename=residents.xlsx');

  await workbook.xlsx.write(res);
  res.end();
}

async function generateBillsExcel(bills, res) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Bills');

  sheet.columns = [
    { header: 'Flat Number', key: 'flatNumber', width: 15 },
    { header: 'Month', key: 'month', width: 12 },
    { header: 'Amount', key: 'amount', width: 12 },
    { header: 'Status', key: 'status', width: 12 },
    { header: 'Due Date', key: 'dueDate', width: 15 },
    { header: 'Paid On', key: 'paidAt', width: 15 },
  ];

  sheet.getRow(1).font = { bold: true };

  bills.forEach((bill) => {
    sheet.addRow({
      flatNumber: bill.flat.flatNumber,
      month: bill.month,
      amount: bill.amount,
      status: bill.status,
      dueDate: new Date(bill.dueDate).toDateString(),
      paidAt: bill.paidAt ? new Date(bill.paidAt).toDateString() : '-',
    });
  });

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename=bills-report.xlsx');

  await workbook.xlsx.write(res);
  res.end();
}

module.exports = { generateResidentsExcel, generateBillsExcel };