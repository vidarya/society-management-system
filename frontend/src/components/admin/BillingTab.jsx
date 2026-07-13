import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllBills, downloadExcelReport } from '../../api/billingApi';
import { getAllFlats } from '../../api/residentsApi';
import axiosClient from '../../api/axiosClient';

async function createBill(data) {
  const response = await axiosClient.post('/bills', data);
  return response.data;
}

function BillingTab() {
  const queryClient = useQueryClient();
  const [flatId, setFlatId] = useState('');
  const [amount, setAmount] = useState('');
  const [month, setMonth] = useState('');
  const [dueDate, setDueDate] = useState('');

  const billsQuery = useQuery({ queryKey: ['allBills'], queryFn: getAllBills });
  const flatsQuery = useQuery({ queryKey: ['flats'], queryFn: getAllFlats });

  const createBillMutation = useMutation({
    mutationFn: createBill,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allBills'] });
      setFlatId('');
      setAmount('');
      setMonth('');
      setDueDate('');
    },
  });

  function handleSubmit(e) {
    e.preventDefault();
    createBillMutation.mutate({ flatId, amount: Number(amount), month, dueDate });
  }

  const billsExcelUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/bills/export/excel`;

  return (
    <div>
      <h3 className="font-semibold text-gray-800 mb-3">Create Maintenance Bill</h3>
      <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-4 grid md:grid-cols-4 gap-3 mb-6">
        <select value={flatId} onChange={(e) => setFlatId(e.target.value)} required className="border border-gray-300 rounded px-3 py-2 text-sm">
          <option value="">Select Flat</option>
          {flatsQuery.data?.data.map((flat) => (
            <option key={flat.id} value={flat.id}>{flat.flatNumber}</option>
          ))}
        </select>
        <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} required className="border border-gray-300 rounded px-3 py-2 text-sm" />
        <input type="text" placeholder="Month (YYYY-MM)" value={month} onChange={(e) => setMonth(e.target.value)} required className="border border-gray-300 rounded px-3 py-2 text-sm" />
        <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required className="border border-gray-300 rounded px-3 py-2 text-sm" />
        <button type="submit" disabled={createBillMutation.isPending} className="md:col-span-4 bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
          {createBillMutation.isPending ? 'Creating...' : 'Create Bill'}
        </button>
      </form>

      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-gray-800">All Maintenance Bills</h3>
        <button
          onClick={() => downloadExcelReport(billsExcelUrl, 'bills-report.xlsx')}
          className="text-xs bg-green-600 text-white px-3 py-1.5 rounded hover:bg-green-700"
        >
          Export to Excel
        </button>
      </div>
      <div className="grid gap-2">
        {billsQuery.data?.data.map((bill) => (
          <div key={bill.id} className="bg-white border border-gray-200 rounded p-3 text-sm flex justify-between items-center">
            <div>
              <span className="font-medium">{bill.flat.flatNumber}</span> — {bill.month} — Rs. {bill.amount.toFixed(2)}
            </div>
            <span className={`text-xs px-2 py-0.5 rounded ${bill.status === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
              {bill.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BillingTab;