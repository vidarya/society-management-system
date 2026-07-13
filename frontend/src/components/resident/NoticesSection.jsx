import { useQuery } from '@tanstack/react-query';
import { getAllNotices } from '../../api/noticesApi';

function NoticesSection() {
  const noticesQuery = useQuery({ queryKey: ['notices'], queryFn: getAllNotices });

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Notice Board</h2>

      <div className="grid gap-3">
        {noticesQuery.data?.data.map((notice) => (
          <div
            key={notice._id}
            className={`bg-white border rounded-lg p-4 ${notice.pinned ? 'border-yellow-300 bg-yellow-50' : 'border-gray-200'}`}
          >
            <div className="flex justify-between items-start">
              <h3 className="font-medium text-gray-800">{notice.title}</h3>
              {notice.pinned && (
                <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded">Pinned</span>
              )}
            </div>
            <p className="text-sm text-gray-600 mt-1">{notice.content}</p>
            <p className="text-xs text-gray-400 mt-2">
              Posted by {notice.postedByName} on {new Date(notice.createdAt).toDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NoticesSection;