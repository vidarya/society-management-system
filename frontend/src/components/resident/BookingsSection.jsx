import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllFacilities, createBooking, getMyBookings, cancelBooking } from '../../api/facilitiesApi';

function BookingsSection() {
  const queryClient = useQueryClient();
  const [facilityId, setFacilityId] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [error, setError] = useState('');

  const facilitiesQuery = useQuery({ queryKey: ['facilities'], queryFn: getAllFacilities });
  const bookingsQuery = useQuery({ queryKey: ['myBookings'], queryFn: getMyBookings });

  const bookMutation = useMutation({
    mutationFn: ({ facilityId, data }) => createBooking(facilityId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myBookings'] });
      setError('');
      setDate('');
      setStartTime('');
      setEndTime('');
    },
    onError: (err) => {
      setError(err.response?.data?.error || 'Booking failed');
    },
  });

  const cancelMutation = useMutation({
    mutationFn: cancelBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myBookings'] });
    },
  });

  function handleSubmit(e) {
    e.preventDefault();
    setError('');
    bookMutation.mutate({ facilityId, data: { date, startTime, endTime } });
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Facility Booking</h2>

      {error && (
        <div className="bg-red-100 text-red-700 text-sm p-3 rounded mb-4">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-4 mb-6 grid md:grid-cols-5 gap-3">
        <select value={facilityId} onChange={(e) => setFacilityId(e.target.value)} required className="border border-gray-300 rounded px-3 py-2 text-sm">
          <option value="">Select Facility</option>
          {facilitiesQuery.data?.data.map((f) => (
            <option key={f.id} value={f.id}>{f.name}</option>
          ))}
        </select>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required className="border border-gray-300 rounded px-3 py-2 text-sm" />
        <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} required className="border border-gray-300 rounded px-3 py-2 text-sm" />
        <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} required className="border border-gray-300 rounded px-3 py-2 text-sm" />
        <button type="submit" disabled={bookMutation.isPending} className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
          {bookMutation.isPending ? 'Booking...' : 'Book Slot'}
        </button>
      </form>

      <div className="grid gap-2">
        {bookingsQuery.data?.data.map((booking) => (
          <div key={booking.id} className="bg-white border border-gray-200 rounded p-3 text-sm flex justify-between items-center">
            <div>
              <span className="font-medium">{booking.facility.name}</span> — {new Date(booking.date).toDateString()} — {booking.startTime} to {booking.endTime}
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs px-2 py-0.5 rounded ${booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                {booking.status}
              </span>
              {booking.status === 'CONFIRMED' && (
                <button
                  onClick={() => cancelMutation.mutate(booking.id)}
                  className="text-xs text-red-600 hover:underline"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BookingsSection;