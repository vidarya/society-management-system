import axiosClient from './axiosClient';

export async function getAllFacilities() {
  const response = await axiosClient.get('/facilities');
  return response.data;
}

export async function createFacility(data) {
  const response = await axiosClient.post('/facilities', data);
  return response.data;
}

export async function createBooking(facilityId, data) {
  const response = await axiosClient.post(`/facilities/${facilityId}/bookings`, data);
  return response.data;
}

export async function getMyBookings() {
  const response = await axiosClient.get('/facilities/bookings/my');
  return response.data;
}

export async function getAllBookings() {
  const response = await axiosClient.get('/facilities/bookings');
  return response.data;
}

export async function cancelBooking(id) {
  const response = await axiosClient.put(`/facilities/bookings/${id}/cancel`);
  return response.data;
}