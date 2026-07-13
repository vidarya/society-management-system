import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllVisitors, checkInVisitor, checkOutVisitor } from '../../api/visitorsApi';

function VisitorsTab() {
  const queryClient = useQueryClient();

  const visitorsQuery = useQuery({ queryKey: ['allVisitors'], queryFn: getAllVisitors });

  const checkInMutation = useMutation({
    mutationFn: checkInVisitor,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['allVisitors'] }),
  });

  const checkOutMutation = useMutation({
    mutationFn: checkOutVisitor,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['allVisitors'] }),
  });

  const statusColors = {
    APPROVED: 'bg-blue-100 text-blue-700',
    CHECKED_IN: 'bg-green-100 text-green-700',
    CHECKED_OUT: 'bg-gray-100 text-gray-600',
  };

  return (
    <div>
      <h3 className="font-semibold text-gray-800 mb-3">All Visitors</h3>

      {(checkInMutation.isError || checkOutMutation.isError) && (
        <div className="bg-red-100 text-red-700 text-sm p-3 rounded mb-4">
          {checkInMutation.error?.response?.data?.error ||
            checkOutMutation.error?.response?.data?.error ||
            'Action failed'}
        </div>
      )}

      <div className="grid gap-3">
        {visitorsQuery.data?.data.map((visitor) => (
          <div key={visitor.id} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-medium text-gray-800">{visitor.name}</h4>
                <p className="text-sm text-gray-500">
                  {visitor.phone} — {visitor.purpose}
                </p>
                <p className="text-sm text-gray-500">
                  Visiting: Flat {visitor.flat.flatNumber}
                </p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded ${statusColors[visitor.status] || 'bg-gray-100'}`}>
                {visitor.status.replace('_', ' ')}
              </span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => checkInMutation.mutate(visitor.id)}
                disabled={checkInMutation.isPending}
                className="text-xs bg-green-600 text-white px-3 py-1.5 rounded hover:bg-green-700 disabled:opacity-50"
              >
                Check In
              </button>
              <button
                onClick={() => checkOutMutation.mutate(visitor.id)}
                disabled={checkOutMutation.isPending}
                className="text-xs bg-gray-500 text-white px-3 py-1.5 rounded hover:bg-gray-600 disabled:opacity-50"
              >
                Check Out
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default VisitorsTab;