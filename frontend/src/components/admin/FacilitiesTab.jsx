import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllFacilities, createFacility, getAllBookings } from '../../api/facilitiesApi';

function FacilitiesTab() {
  const queryClient = useQueryClient();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [capacity, setCapacity] = useState('');

  const facilitiesQuery = useQuery({ queryKey: ['facilities'], queryFn: getAllFacilities });
  const bookingsQuery = useQuery({ queryKey: ['allBookings'], queryFn: getAllBookings });

  const createMutation = useMutation({
    mutationFn: createFacility,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['facilities'] });
      setName('');
      setDescription('');
      setCapacity('');
    },
  });

  function handleSubmit(e) {
    e.preventDefault();
    createMutation.mutate({ name, description, capacity: capacity ? Number(capacity) : undefined });
  }

  return (
    <div>
      <h3 className="font-semibold text-gray-800 mb-3">Create Facility</h3>
      <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-4 grid md:grid-cols-4 gap-3 mb-6">
        <input type="text" placeholder="Facility Name" value={name} onChange={(e) => setName(e.target.value)} required className="border border-gray-300 rounded px-3 py-2 text-sm" />
        <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} className="border border-gray-300 rounded px-3 py-2 text-sm" />
        <input type="number" placeholder="Capacity (optional)" value={capacity} onChange={(e) => setCapacity(e.target.value)} className="border border-gray-300 rounded px-3 py-2 text-sm" />
        <button type="submit" disabled={createMutation.isPending} className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
          {createMutation.isPending ? 'Creating...' : 'Create Facility'}
        </button>
      </form>

      <h3 className="font-semibold text-gray-800 mb-3">All Facilities</h3>
      <div className="grid gap-2 mb-6">
        {facilitiesQuery.data?.data.map((facility) => (
          <div key={facility.id} className="bg-white border border-gray-200 rounded p-3 text-sm">
            <span className="font-medium">{facility.name}</span>
            {facility.description && <span className="text-gray-500"> — {facility.description}</span>}
            {facility.capacity && <span className="text-gray-400 ml-2">(Capacity: {facility.capacity})</span>}
          </div>
        ))}
      </div>

      <h3 className="font-semibold text-gray-800 mb-3">All Bookings</h3>
      <div className="grid gap-2">
        {bookingsQuery.data?.data.map((booking) => (
          <div key={booking.id} className="bg-white border border-gray-200 rounded p-3 text-sm flex justify-between items-center">
            <div>
              <span className="font-medium">{booking.facility.name}</span> — {booking.bookedBy.name} — {new Date(booking.date).toDateString()} — {booking.startTime} to {booking.endTime}
            </div>
            <span className={`text-xs px-2 py-0.5 rounded ${booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
              {booking.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FacilitiesTab;