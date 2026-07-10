import axiosClient from './axiosClient';

export async function getMyComplaints() {
  const response = await axiosClient.get('/complaints/my');
  return response.data;
}

export async function createComplaint(data) {
  const response = await axiosClient.post('/complaints', data);
  return response.data;
}
export async function getAllComplaints() {
  const response = await axiosClient.get('/complaints');
  return response.data;
}

export async function assignComplaint(complaintId, assignedToId) {
  const response = await axiosClient.put(`/complaints/${complaintId}/assign`, { assignedToId });
  return response.data;
}

export async function updateComplaintStatus(complaintId, status) {
  const response = await axiosClient.put(`/complaints/${complaintId}/status`, { status });
  return response.data;
}