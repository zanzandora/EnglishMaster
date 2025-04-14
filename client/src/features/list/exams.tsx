import FormModal from '@components/common/FormModal';
import Pagination from '@components/common/Pagination';
import Table from '@components/common/table/Table';
import TableSearch from '@components/common/table/searchs/TableSearch';
import { decodeToken } from '@utils/decodeToken ';
import { highlightText } from '@utils/highlight';
import ErrorPage from 'features/error/error';
import { useAuth } from 'hooks/useAuth';
import usePagination from 'hooks/usePagination';
import React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useSort } from 'hooks/useSort';
import { sortByField } from '@utils/sortUtils';
import { Exam } from '@interfaces';
import DownloadFileDocs from '@components/common/export/DownloadFileDocs';

const columns = (t: any, role?: string) => [
  {
    header: t('table.exams.header.title'),
    accessor: 'title',
  },
  {
    header: t('table.exams.header.source'),
    accessor: 'source',
  },
  {
    header: t('table.exams.header.course'),
    accessor: 'course',
  },
  {
    header: t('table.exams.header.class'),
    accessor: 'class',
  },
  {
    header: t('table.exams.header.teacher'),
    accessor: 'teacher',
    className: 'hidden md:table-cell',
  },

  ...(role === 'admin'
    ? [
        {
          header: t('table.results.header.actions'),
          accessor: 'action',
        },
      ]
    : []),
];

const ExamListPage = () => {
  const { t } = useTranslation();

  const { token } = useAuth();
  const decodedToken = decodeToken(token);
  const role = decodedToken?.role;
  const tokenUserID = decodedToken?.user_id;

  const { userID: urlUserID } = useParams();

  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadTrigger, setReloadTrigger] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const { sortConfig, handleSort, getSortIcon } = useSort('id');

  const targetUserID = useMemo(() => {
    if (role === 'teacher') {
      return parseInt(tokenUserID); // Teacher luôn dùng userID từ token
    } else if (urlUserID) {
      // Admin truy cập qua URL /admin/teachers/{userID}/classes
      return parseInt(urlUserID);
    }
    return undefined; // Admin xem tất cả
  }, [role, tokenUserID, urlUserID]);

  // Hàm lọc dữ liệu client-side
  const filteredExams = useMemo(() => {
    let result = [...(exams || [])];

    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter((exam) => {
        return (
          exam.title.toLowerCase().includes(lowerQuery) ||
          exam.course?.toLowerCase().includes(lowerQuery) ||
          exam.class?.toLowerCase().includes(lowerQuery) ||
          exam.teacher?.toLowerCase().includes(lowerQuery)
        );
      });
    }

    //* sort logic
    return sortByField(result, sortConfig.field, sortConfig.order);
  }, [exams, searchQuery, sortConfig]);

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
    usePagination(filteredExams, 10);

  useEffect(() => {
    setReloadTrigger(0); // Reset trigger mỗi khi component được mount lại
  }, [urlUserID]);

  useEffect(() => {
    const fetchLessons = async () => {
      setLoading(true);
      try {
        const url = targetUserID ? `/exam/${targetUserID}` : '/exam/list';
        const response = await fetch(url);
        if (!response.ok) {
          const errorData = await response.text();
          throw new Error(errorData || 'Network response was not ok');
        }
        const data = await response.json();
        setExams(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, [reloadTrigger, targetUserID]);

  const handleSuccess = () => {
    setReloadTrigger((prev) => prev + 1); // Gọi lại danh sách sau khi xóa
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, setCurrentPage]);

  if (loading) return <p>Đang tải dữ liệu...</p>;
  // if (error) return <ErrorPage message={error} />;

  const renderRow = (item: any, index: number) => {
    return (
      <tr
        key={index}
        className='border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-secondary-lavenderFade'
      >
        <td className='flex items-center gap-4 p-4  w-[200px]'>
          {renderHighlightedItem(item.title)}
        </td>
        <td className='hidden md:table-cell'>
          <p className='truncate w-[200px]'>{item.source}</p>
        </td>
        <td className='hidden md:table-cell'>
          {renderHighlightedItem(item.course) || 'No course assigned'}
        </td>
        <td className='hidden md:table-cell'>
          {renderHighlightedItem(item.class) || 'No class assigned'}
        </td>
        <td className='hidden md:table-cell'>
          {renderHighlightedItem(item.teacher) || 'No teacher assigned'}
        </td>
        <td>
          <div className='flex items-center gap-2'>
            <DownloadFileDocs
              type='exam'
              fileUrl={item.source}
              fileName={item.title}
            />
            {role === 'admin' && !targetUserID && (
              <>
                <FormModal
                  table='exam'
                  type='delete'
                  id={item.id}
                  onSuccess={handleSuccess}
                />
              </>
            )}
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
          {t('table.exams.title')}
        </h1>
        <div className='flex flex-col md:flex-row items-center gap-4 w-full md:w-auto'>
          <TableSearch
            searchType='exam'
            onSearch={setSearchQuery}
            placeholder={t('search.placeholder')}
          />
          <div className='flex items-center gap-4 self-end'>
            {/* <button className='w-8 h-8 flex items-center justify-center rounded-full bg-primary-redLight_fade'>
              <img src='/filter.png' alt='' width={14} height={14} />
            </button> */}
            <button
              onClick={() => handleSort('id')}
              className='w-8 h-8 flex items-center justify-center rounded-full bg-primary-redLight_fade'
            >
              <img src={getSortIcon()} alt='' width={14} height={14} />
            </button>
            {role === 'admin' && !targetUserID && (
              <FormModal table='exam' type='create' onSuccess={handleSuccess} />
            )}
          </div>
        </div>
      </div>
      {/* LIST */}
      {currentData.length === 0 ? (
        <div className='text-center py-6 text-gray-500'>no exam found</div>
      ) : (
        <Table
          columns={columns(t, role)}
          renderRow={renderRow}
          data={currentData}
        />
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

export default ExamListPage;
