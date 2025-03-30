import Pagination from '@components/common/Pagination';
import Table from '@components/common/table/Table';
import TableSearch from '@components/common/table/searchs/TableSearch';
import FormModal from '@components/common/FormModal';
import { useTranslation } from 'react-i18next';
import usePagination from 'hooks/usePagination';
import { useEffect, useMemo, useState } from 'react';
import { useAuth } from 'hooks/useAuth';
import { decodeToken } from '@utils/decodeToken ';
import { highlightText } from '@utils/highlight';
import React from 'react';

const columns = (t: any) => [
  {
    header: t('table.lessons.header.name'),
    accessor: 'name',
  },
  {
    header: 'Source',
    accessor: 'source',
  },
  {
    header: 'Lesson Type',
    accessor: 'type',
  },

  {
    header: t('table.lessons.header.actions'),
    accessor: 'action',
  },
];

const LessonListPage = () => {
  const { t } = useTranslation();

  const { token } = useAuth();
  const decodedToken = decodeToken(token);
  const role = decodedToken?.role;

  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadTrigger, setReloadTrigger] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  // Hàm lọc dữ liệu client-side
  const filteredLessons = useMemo(() => {
    if (!searchQuery) return lessons;

    const lowerQuery = searchQuery.toLowerCase();
    return lessons.filter((lesson) => {
      return (
        lesson.title.toLowerCase().includes(lowerQuery) ||
        lesson.type.toLowerCase().includes(lowerQuery)
      );
    });
  }, [lessons, searchQuery]);

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
    usePagination(filteredLessons, 10);

  useEffect(() => {
    const fetchLessons = async () => {
      setLoading(true);
      try {
        const response = await fetch('/lesson/list');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setLessons(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, [reloadTrigger]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, setCurrentPage]);

  const handleSuccess = () => {
    setReloadTrigger((prev) => prev + 1); // Gọi lại danh sách sau khi xóa
  };

  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p>Lỗi: {error}</p>;

  const renderRow = (item: any) => {
    return (
      <tr
        key={item.id}
        className='border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-secondary-lavenderFade'
      >
        <td className='flex items-center gap-4 p-4'>
          <div className='flex flex-col'>
            <h3 className='font-semibold'>
              {renderHighlightedItem(item.title)}
            </h3>
            <p className='text-xs text-gray-500 w-[200px] line-clamp-custom'>
              {item.description}
            </p>
          </div>
        </td>

        <td className='hidden md:table-cell '>
          <p className='truncate w-[250px]'>{item.file_url}</p>
        </td>
        <td className='hidden md:table-cell'>
          {renderHighlightedItem(item.type)}
        </td>

        <td>
          <div className='flex items-center gap-2'>
            <FormModal
              table='lesson'
              type='delete'
              id={item.id}
              onSuccess={handleSuccess}
            />
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div className='bg-white p-4 rounded-md flex-1 m-4 mt-0'>
      {/* TOP */}
      <div className='flex items-center justify-between'>
        <h1 className='hidden md:block text-lg font-semibold'>
          {t('table.lessons.title')}
        </h1>
        <div className='flex flex-col md:flex-row items-center gap-4 w-full md:w-auto'>
          <TableSearch
            searchType='lesson'
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

            <FormModal table='lesson' type='create' onSuccess={handleSuccess} />
          </div>
        </div>
      </div>
      {/* PAGINATION */}
      {currentData.length === 0 ? (
        <div className='text-center py-6 text-gray-500'>no lesson found</div>
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

export default LessonListPage;
