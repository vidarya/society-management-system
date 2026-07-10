const PDFDocument = require('pdfkit');

function generateBillPdf(bill, res) {
  const doc = new PDFDocument({ margin: 50 });

  // Stream the PDF directly to the HTTP response
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename=bill-${bill.flat.flatNumber}-${bill.month}.pdf`
  );

  doc.pipe(res);

  // Header
  doc
    .fontSize(20)
    .text('Society Maintenance Bill', { align: 'center' })
    .moveDown(2);

  // Bill details
  doc
    .fontSize(12)
    .text(`Flat Number: ${bill.flat.flatNumber}`)
    .text(`Block: ${bill.flat.block}`)
    .text(`Billing Month: ${bill.month}`)
    .moveDown();

  doc
    .text(`Amount Due: Rs. ${bill.amount.toFixed(2)}`)
    .text(`Due Date: ${new Date(bill.dueDate).toDateString()}`)
    .text(`Status: ${bill.status}`)
    .moveDown();

  if (bill.status === 'PAID' && bill.paidAt) {
    doc.text(`Paid On: ${new Date(bill.paidAt).toDateString()}`);
  }

  doc.moveDown(2);
  doc
    .fontSize(10)
    .fillColor('gray')
    .text('This is a system-generated bill. For queries, contact the society office.', {
      align: 'center',
    });

  doc.end();
}

module.exports = { generateBillPdf };