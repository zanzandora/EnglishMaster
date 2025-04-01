import { useTranslation } from 'react-i18next';
import Pagination from '@components/common/Pagination';
import Table from '@components/common/table/Table';
import TableSearch from '@components/common/table/searchs/TableSearch';
import { useAuth } from 'hooks/useAuth';
import { decodeToken } from '@utils/decodeToken ';
import usePagination from 'hooks/usePagination';
import { useEffect, useMemo, useState } from 'react';
import { formatDate } from '@utils/dateUtils';
import { highlightText } from '@utils/highlight';
import { Announcement } from '@interfaces';
import React from 'react';

const columns = (t: any) => [
  {
    header: t('table.announcements.header.title'),
    accessor: 'title',
  },
  {
    header: 'Message',
    accessor: 'message',
  },
  {
    header: t('table.announcements.header.date'),
    accessor: 'date',
    className: 'hidden md:table-cell',
  },
  {
    header: 'Type',
    accessor: 'type',
    className: 'hidden md:table-cell',
  },
];

const AnnouncementListPage = () => {
  const { t } = useTranslation();

  const { token } = useAuth();
  const decodedToken = decodeToken(token);
  // const role = decodedToken?.role;

  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Hàm lọc dữ liệu client-side
  const filteredAnnouncements = useMemo(() => {
    if (!searchQuery) return announcements;

    const lowerQuery = searchQuery.toLowerCase();
    return announcements.filter((announcement) => {
      return (
        announcement.title.toLowerCase().includes(lowerQuery) ||
        announcement.message.toLowerCase().includes(lowerQuery) ||
        announcement.relatedEntityType.toLowerCase().includes(lowerQuery) ||
        String(announcement.createdAt).includes(lowerQuery)
      );
    });
  }, [announcements, searchQuery]);

  // Render item với highlight
  const renderHighlightedItem = (text: string) => {
    return (
      <span>
        {highlightText(text, searchQuery).map((part, index) => (
          <React.Fragment key={index}>{part}</React.Fragment>
        ))}
      </span>
    );
  };

  const { currentData, currentPage, totalPages, setCurrentPage } =
    usePagination(filteredAnnouncements, 10);

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
  const renderRow = (item: any) => {
    return (
      <tr
        key={item.id}
        className='border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-secondary-lavenderFade'
      >
        <td className='flex items-center gap-4 p-4'>
          {renderHighlightedItem(item.title)}
        </td>
        <td>{renderHighlightedItem(item.message)}</td>
        <td className='hidden md:table-cell'>
          {renderHighlightedItem(
            String(formatDate(item.createdAt, 'yyyy-MM-dd HH:MM:SS'))
          )}
        </td>
        <td>{renderHighlightedItem(item.relatedEntityType)}</td>
      </tr>
    );
  };

  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p>Lỗi: {error}</p>;

  return (
    <div className='bg-white p-4 rounded-md flex-1 m-4 mt-0'>
      {/* TOP */}
      <div className='flex items-center justify-between'>
        <h1 className='hidden md:block text-lg font-semibold'>
          {t('table.announcements.title')}
        </h1>
        <div className='flex flex-col md:flex-row items-center gap-4 w-full md:w-auto'>
          <TableSearch
            searchType='anouncement'
            onSearch={setSearchQuery}
            placeholder={t('search.placeholder')}
          />
          <div className='flex items-center gap-4 self-end'>
            <button className='w-8 h-8 flex items-center justify-center rounded-full bg-primary-redLight_fade'>
              <img src='/filter.png' alt='' width={14} height={14} />
            </button>
            <button className='w-8 h-8 flex items-center justify-center rounded-full bg-primary-redLight_fade'>
              <img src='/sort.png' alt='' width={14} height={14} />
            </button>
            {/* {role === 'admin' && <FormModal table='class' type='create' />} */}
            <button className='w-8 h-8 flex items-center justify-center rounded-full bg-primary-redLight_fade'>
              <img src='/create.png' alt='' width={14} height={14} />
            </button>
          </div>
        </div>
      </div>
      {currentData.length === 0 ? (
        <div className='text-center py-6 text-gray-500'>
          no anouncement found
        </div>
      ) : (
        <Table columns={columns(t)} renderRow={renderRow} data={currentData} />
      )}
      {totalPages > 1 && (
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
};

export default AnnouncementListPage;
