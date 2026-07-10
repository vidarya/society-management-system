import axiosClient from './axiosClient';

export async function getAllFlats() {
  const response = await axiosClient.get('/flats');
  return response.data;
}

export async function createFlat(data) {
  const response = await axiosClient.post('/flats', data);
  return response.data;
}

export async function getAllResidents() {
  const response = await axiosClient.get('/residents');
  return response.data;
}

export async function assignResidentToFlat(residentId, flatId) {
  const response = await axiosClient.put(`/residents/${residentId}/assign-flat`, { flatId });
  return response.data;
}