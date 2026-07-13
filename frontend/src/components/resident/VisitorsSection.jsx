import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createVisitor, getMyVisitors } from '../../api/visitorsApi';

function VisitorsSection() {
  const queryClient = useQueryClient();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [purpose, setPurpose] = useState('');
  const [qrImage, setQrImage] = useState(null);

  const visitorsQuery = useQuery({ queryKey: ['myVisitors'], queryFn: getMyVisitors });

  const createMutation = useMutation({
    mutationFn: createVisitor,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['myVisitors'] });
      setQrImage(response.data.qrImage);
      setName('');
      setPhone('');
      setPurpose('');
    },
  });

  function handleSubmit(e) {
    e.preventDefault();
    createMutation.mutate({ name, phone, purpose });
  }

  const statusColors = {
    APPROVED: 'bg-blue-100 text-blue-700',
    CHECKED_IN: 'bg-green-100 text-green-700',
    CHECKED_OUT: 'bg-gray-100 text-gray-600',
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Visitors</h2>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-4 mb-4 grid md:grid-cols-3 gap-3">
        <input type="text" placeholder="Visitor Name" value={name} onChange={(e) => setName(e.target.value)} required className="border border-gray-300 rounded px-3 py-2 text-sm" />
        <input type="text" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} required className="border border-gray-300 rounded px-3 py-2 text-sm" />
        <input type="text" placeholder="Purpose" value={purpose} onChange={(e) => setPurpose(e.target.value)} required className="border border-gray-300 rounded px-3 py-2 text-sm" />
        <button type="submit" disabled={createMutation.isPending} className="md:col-span-3 bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
          {createMutation.isPending ? 'Adding...' : 'Add Visitor'}
        </button>
      </form>

      {qrImage && (
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6 text-center">
          <p className="text-sm text-gray-600 mb-2">QR Pass generated — share this with your visitor:</p>
          <img src={qrImage} alt="Visitor QR Code" className="mx-auto w-40 h-40" />
        </div>
      )}

      <div className="grid gap-2">
        {visitorsQuery.data?.data.map((visitor) => (
          <div key={visitor.id} className="bg-white border border-gray-200 rounded p-3 text-sm flex justify-between items-center">
            <div>
              <span className="font-medium">{visitor.name}</span> — {visitor.purpose}
              <span className="text-gray-400 ml-2">({visitor.phone})</span>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded ${statusColors[visitor.status] || 'bg-gray-100 text-gray-600'}`}>
              {visitor.status.replace('_', ' ')}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default VisitorsSection;