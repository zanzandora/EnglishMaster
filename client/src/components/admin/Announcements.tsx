import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { Announcement } from '@interfaces';
import { formatDate } from '@utils/dateUtils';

const Announcements = () => {
  const { t } = useTranslation();

  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLessons = async () => {
      setLoading(true);
      try {
        const response = await fetch('/notification');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setAnnouncements(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, []);

  return (
    <div className='bg-white p-4 rounded-md'>
      <div className='flex items-center justify-between'>
        <h1 className='text-xl font-semibold capitalize'>
          {t('announcements.title')}
        </h1>
        <span className='text-xs text-gray-400'>View All</span>
      </div>
      <div
        className={`flex flex-col gap-4 mt-4 ${
          announcements.length > 3 ? 'overflow-y-auto max-h-96' : ''
        }`}
      >
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className='text-red-500'>{error}</p>
        ) : (
          announcements.map((announcement, index) => (
            <div
              key={index}
              className='bg-secondary-lavenderFade rounded-md p-4'
            >
              <div className='flex items-center justify-between'>
                <h2 className='font-medium'>{announcement.title}</h2>
                <span className='text-xs text-gray-400 bg-white rounded-md px-1 py-1'>
                  {formatDate(announcement.createdAt, 'yyyy-MM-dd')}
                </span>
              </div>
              <p className='text-sm text-gray-400 mt-1'>
                {announcement.message}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Announcements;
