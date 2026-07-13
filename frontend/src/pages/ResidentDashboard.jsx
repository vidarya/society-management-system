import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import DashboardLayout from '../layouts/DashboardLayout';
import { getMyBills, payBill, downloadBillPdf } from '../api/billingApi';
import { getMyComplaints, createComplaint } from '../api/complaintsApi';
import VisitorsSection from '../components/resident/VisitorsSection';
import BookingsSection from '../components/resident/BookingsSection';
import NoticesSection from '../components/resident/NoticesSection';

function ResidentDashboard() {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const billsQuery = useQuery({
    queryKey: ['myBills'],
    queryFn: getMyBills,
  });

  const complaintsQuery = useQuery({
    queryKey: ['myComplaints'],
    queryFn: getMyComplaints,
  });

  const payMutation = useMutation({
    mutationFn: payBill,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myBills'] });
    },
  });

  const createComplaintMutation = useMutation({
    mutationFn: createComplaint,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myComplaints'] });
      setTitle('');
      setDescription('');
    },
  });

  function handleComplaintSubmit(e) {
    e.preventDefault();
    createComplaintMutation.mutate({ title, description });
  }

  const statusColors = {
    OPEN: 'bg-yellow-100 text-yellow-700',
    IN_PROGRESS: 'bg-blue-100 text-blue-700',
    RESOLVED: 'bg-green-100 text-green-700',
  };

  return (
    <DashboardLayout>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">My Bills</h2>

      {billsQuery.isLoading && <p className="text-gray-500">Loading bills...</p>}
      {billsQuery.isError && <p className="text-red-500">Failed to load bills.</p>}
      {billsQuery.data && billsQuery.data.data.length === 0 && (
        <p className="text-gray-500">No bills found.</p>
      )}

      <div className="grid gap-4 mb-10">
        {billsQuery.data?.data.map((bill) => (
          <div key={bill.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex justify-between items-center">
            <div>
              <p className="font-medium text-gray-800">Month: {bill.month}</p>
              <p className="text-sm text-gray-500">Amount: Rs. {bill.amount.toFixed(2)}</p>
              <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded ${bill.status === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                {bill.status}
              </span>
            </div>

            <div className="flex gap-2">
              {bill.status !== 'PAID' && (
                <button onClick={() => payMutation.mutate(bill.id)} disabled={payMutation.isPending} className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 disabled:opacity-50">
                  {payMutation.isPending ? 'Processing...' : 'Pay Now'}
                </button>
              )}
              <button onClick={() => downloadBillPdf(bill.id, `bill-${bill.month}.pdf`)} className="text-sm bg-gray-200 text-gray-700 px-3 py-1.5 rounded hover:bg-gray-300">
                Download PDF
              </button>
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-semibold text-gray-800 mb-4">My Complaints</h2>

      <form onSubmit={handleComplaintSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6 space-y-3">
        <input
          type="text"
          placeholder="Complaint title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <textarea
          placeholder="Describe the issue..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={3}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={createComplaintMutation.isPending}
          className="bg-blue-600 text-white px-4 py-2 rounded font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {createComplaintMutation.isPending ? 'Submitting...' : 'Raise Complaint'}
        </button>
      </form>

      {complaintsQuery.isLoading && <p className="text-gray-500">Loading complaints...</p>}
      {complaintsQuery.data && complaintsQuery.data.data.length === 0 && (
        <p className="text-gray-500">No complaints raised yet.</p>
      )}

      <div className="grid gap-3 mb-10">
        {complaintsQuery.data?.data.map((complaint) => (
          <div key={complaint.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex justify-between items-start">
              <h3 className="font-medium text-gray-800">{complaint.title}</h3>
              <span className={`text-xs px-2 py-0.5 rounded ${statusColors[complaint.status]}`}>
                {complaint.status.replace('_', ' ')}
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-1">{complaint.description}</p>
          </div>
        ))}
      </div>

      <div className="mb-10">
        <VisitorsSection />
      </div>

      <div className="mb-10">
        <BookingsSection />
      </div>

      <div className="mb-10">
        <NoticesSection />
      </div>
    </DashboardLayout>
  );
}

export default ResidentDashboard;