import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllFlats, createFlat, getAllResidents, assignResidentToFlat, getResidentsExcelUrl } from '../../api/residentsApi';
import { downloadExcelReport } from '../../api/billingApi';

function FlatsResidentsTab() {
  const queryClient = useQueryClient();
  const [flatNumber, setFlatNumber] = useState('');
  const [block, setBlock] = useState('');
  const [floor, setFloor] = useState('');

  const flatsQuery = useQuery({ queryKey: ['flats'], queryFn: getAllFlats });
  const residentsQuery = useQuery({ queryKey: ['residents'], queryFn: getAllResidents });

  const createFlatMutation = useMutation({
    mutationFn: createFlat,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flats'] });
      setFlatNumber('');
      setBlock('');
      setFloor('');
    },
  });

  const assignMutation = useMutation({
    mutationFn: ({ residentId, flatId }) => assignResidentToFlat(residentId, flatId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['residents'] });
      queryClient.invalidateQueries({ queryKey: ['flats'] });
    },
  });

  function handleCreateFlat(e) {
    e.preventDefault();
    createFlatMutation.mutate({ flatNumber, block, floor: Number(floor) });
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div>
        <h3 className="font-semibold text-gray-800 mb-3">Create New Flat</h3>
        <form onSubmit={handleCreateFlat} className="bg-white rounded-lg border border-gray-200 p-4 space-y-3 mb-6">
          <input type="text" placeholder="Flat Number (e.g. A-102)" value={flatNumber} onChange={(e) => setFlatNumber(e.target.value)} required className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
          <input type="text" placeholder="Block (e.g. A)" value={block} onChange={(e) => setBlock(e.target.value)} required className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
          <input type="number" placeholder="Floor" value={floor} onChange={(e) => setFloor(e.target.value)} required className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
          <button type="submit" disabled={createFlatMutation.isPending} className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
            {createFlatMutation.isPending ? 'Creating...' : 'Create Flat'}
          </button>
        </form>

        <h3 className="font-semibold text-gray-800 mb-3">All Flats</h3>
        <div className="space-y-2">
          {flatsQuery.data?.data.map((flat) => (
            <div key={flat.id} className="bg-white border border-gray-200 rounded p-3 text-sm">
              <span className="font-medium">{flat.flatNumber}</span> — Block {flat.block}, Floor {flat.floor}
              <span className="text-gray-400 ml-2">({flat.residents.length} resident(s))</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold text-gray-800">All Residents</h3>
          <button
            onClick={() => downloadExcelReport(getResidentsExcelUrl(), 'residents.xlsx')}
            className="text-xs bg-green-600 text-white px-3 py-1.5 rounded hover:bg-green-700"
          >
            Export to Excel
          </button>
        </div>
        <div className="space-y-2">
          {residentsQuery.data?.data.map((resident) => (
            <div key={resident.id} className="bg-white border border-gray-200 rounded p-3 text-sm">
              <p className="font-medium">{resident.name}</p>
              <p className="text-gray-500">{resident.email}</p>
              <p className="text-gray-500 mb-2">
                Flat: {resident.flat ? resident.flat.flatNumber : 'Not assigned'}
              </p>

              <select
                onChange={(e) => {
                  if (e.target.value) {
                    assignMutation.mutate({ residentId: resident.id, flatId: e.target.value });
                  }
                }}
                value=""
                className="border border-gray-300 rounded px-2 py-1 text-xs"
              >
                <option value="">Assign to flat...</option>
                {flatsQuery.data?.data.map((flat) => (
                  <option key={flat.id} value={flat.id}>
                    {flat.flatNumber}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FlatsResidentsTab;