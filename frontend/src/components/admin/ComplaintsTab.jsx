import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllComplaints, updateComplaintStatus } from '../../api/complaintsApi';

function ComplaintsTab() {
  const queryClient = useQueryClient();

  const complaintsQuery = useQuery({ queryKey: ['allComplaints'], queryFn: getAllComplaints });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => updateComplaintStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allComplaints'] });
    },
  });

  const statusColors = {
    OPEN: 'bg-yellow-100 text-yellow-700',
    IN_PROGRESS: 'bg-blue-100 text-blue-700',
    RESOLVED: 'bg-green-100 text-green-700',
  };

  return (
    <div>
      <h3 className="font-semibold text-gray-800 mb-3">All Complaints</h3>
      <div className="grid gap-3">
        {complaintsQuery.data?.data.map((complaint) => (
          <div key={complaint.id} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-medium text-gray-800">{complaint.title}</h4>
                <p className="text-sm text-gray-500">
                  By: {complaint.raisedBy.name} ({complaint.raisedBy.email})
                </p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded ${statusColors[complaint.status]}`}>
                {complaint.status.replace('_', ' ')}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-3">{complaint.description}</p>

            <select
              value={complaint.status}
              onChange={(e) => updateStatusMutation.mutate({ id: complaint.id, status: e.target.value })}
              className="border border-gray-300 rounded px-2 py-1 text-xs"
            >
              <option value="OPEN">OPEN</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="RESOLVED">RESOLVED</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ComplaintsTab;