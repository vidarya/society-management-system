const prisma = require('../../config/db');

async function createComplaint({ title, description, priority }, userId) {
  const complaint = await prisma.complaint.create({
    data: {
      title,
      description,
      priority: priority || 'MEDIUM',
      raisedById: userId,
    },
  });

  return complaint;
}

async function getAllComplaints() {
  return prisma.complaint.findMany({
    include: {
      raisedBy: { select: { id: true, name: true, email: true, flatId: true } },
      assignedTo: { select: { id: true, name: true, email: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
}

async function getMyComplaints(userId) {
  return prisma.complaint.findMany({
    where: { raisedById: userId },
    include: {
      assignedTo: { select: { id: true, name: true, email: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
}

async function assignComplaint(complaintId, assignedToId) {
  const complaint = await prisma.complaint.findUnique({ where: { id: complaintId } });
  if (!complaint) {
    const error = new Error('Complaint not found');
    error.statusCode = 404;
    throw error;
  }

  const staffMember = await prisma.user.findUnique({ where: { id: assignedToId } });
  if (!staffMember) {
    const error = new Error('Assigned user not found');
    error.statusCode = 404;
    throw error;
  }

  const updated = await prisma.complaint.update({
    where: { id: complaintId },
    data: {
      assignedToId,
      status: complaint.status === 'OPEN' ? 'IN_PROGRESS' : complaint.status,
    },
    include: {
      assignedTo: { select: { id: true, name: true, email: true } },
    },
  });

  return updated;
}

async function updateStatus(complaintId, status) {
  const complaint = await prisma.complaint.findUnique({ where: { id: complaintId } });
  if (!complaint) {
    const error = new Error('Complaint not found');
    error.statusCode = 404;
    throw error;
  }

  const updated = await prisma.complaint.update({
    where: { id: complaintId },
    data: {
      status,
      resolvedAt: status === 'RESOLVED' ? new Date() : null,
    },
  });

  return updated;
}

module.exports = {
  createComplaint,
  getAllComplaints,
  getMyComplaints,
  assignComplaint,
  updateStatus,
};