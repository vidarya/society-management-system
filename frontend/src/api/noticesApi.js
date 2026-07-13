import axiosClient from './axiosClient';

export async function getAllNotices() {
  const response = await axiosClient.get('/notices');
  return response.data;
}

export async function createNotice(data) {
  const response = await axiosClient.post('/notices', data);
  return response.data;
}

export async function deleteNotice(id) {
  const response = await axiosClient.delete(`/notices/${id}`);
  return response.data;
}