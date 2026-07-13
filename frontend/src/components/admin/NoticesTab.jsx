import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllNotices, createNotice, deleteNotice } from '../../api/noticesApi';

function NoticesTab() {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [pinned, setPinned] = useState(false);

  const noticesQuery = useQuery({ queryKey: ['notices'], queryFn: getAllNotices });

  const createMutation = useMutation({
    mutationFn: createNotice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notices'] });
      setTitle('');
      setContent('');
      setPinned(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteNotice,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notices'] }),
  });

  function handleSubmit(e) {
    e.preventDefault();
    createMutation.mutate({ title, content, pinned });
  }

  return (
    <div>
      <h3 className="font-semibold text-gray-800 mb-3">Post Notice</h3>
      <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-4 mb-6 space-y-3">
        <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
        <textarea placeholder="Content" value={content} onChange={(e) => setContent(e.target.value)} required rows={3} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
        <label className="flex items-center gap-2 text-sm text-gray-600">
          <input type="checkbox" checked={pinned} onChange={(e) => setPinned(e.target.checked)} />
          Pin this notice
        </label>
        <button type="submit" disabled={createMutation.isPending} className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
          {createMutation.isPending ? 'Posting...' : 'Post Notice'}
        </button>
      </form>

      <h3 className="font-semibold text-gray-800 mb-3">All Notices</h3>
      <div className="grid gap-3">
        {noticesQuery.data?.data.map((notice) => (
          <div key={notice._id} className={`bg-white border rounded-lg p-4 ${notice.pinned ? 'border-yellow-300 bg-yellow-50' : 'border-gray-200'}`}>
            <div className="flex justify-between items-start">
              <h4 className="font-medium text-gray-800">{notice.title}</h4>
              <button
                onClick={() => deleteMutation.mutate(notice._id)}
                className="text-xs text-red-600 hover:underline"
              >
                Delete
              </button>
            </div>
            <p className="text-sm text-gray-600 mt-1">{notice.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NoticesTab;