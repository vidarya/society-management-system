import axiosClient from './axiosClient';

export async function createVisitor(data) {
  const response = await axiosClient.post('/visitors', data);
  return response.data;
}

export async function getMyVisitors() {
  const response = await axiosClient.get('/visitors/my');
  return response.data;
}

export async function getAllVisitors() {
  const response = await axiosClient.get('/visitors');
  return response.data;
}

export async function checkInVisitor(id) {
  const response = await axiosClient.put(`/visitors/${id}/checkin`);
  return response.data;
}

export async function checkOutVisitor(id) {
  const response = await axiosClient.put(`/visitors/${id}/checkout`);
  return response.data;
}