import axiosClient from './axiosClient';

export async function getMyBills() {
  const response = await axiosClient.get('/bills/my');
  return response.data;
}

export async function payBill(billId) {
  const response = await axiosClient.put(`/bills/${billId}/pay`);
  return response.data;
}

export async function downloadBillPdf(billId, fileName) {
  const response = await axiosClient.get(`/bills/${billId}/pdf`, {
    responseType: 'blob',
  });

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}
export async function getAllBills() {
  const response = await axiosClient.get('/bills');
  return response.data;
}