import FormModal from '@components/common/FormModal';
import Pagination from '@components/common/Pagination';
import Table from '@components/common/table/Table';
import TableSearch from '@components/common/table/TableSearch';
import { role } from '@mockData/mockData';
import usePagination from 'hooks/usePagination';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const columns = (t: any) => [
  {
    header: 'Title',
    accessor: 'title',
  },
  {
    header: t('table.exams.header.file'),
    accessor: 'file',
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

  {
    header: t('table.exams.header.actions'),
    accessor: 'action',
  },
];

const ExamListPage = () => {
  const { t } = useTranslation();

  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadTrigger, setReloadTrigger] = useState(0);

  const { currentData, currentPage, totalPages, setCurrentPage } =
    usePagination(exams, 10);

  useEffect(() => {
    const fetchLessons = async () => {
      setLoading(true);
      try {
        const response = await fetch('/exam/list');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setExams(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, [reloadTrigger]);

  const handleSuccess = () => {
    setReloadTrigger((prev) => prev + 1); // Gọi lại danh sách sau khi xóa
  };

  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p>Lỗi: {error}</p>;

  const renderRow = (item: any, index: number) => {
    return (
      <tr
        key={index}
        className='border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-secondary-lavenderFade'
      >
        <td className='flex items-center gap-4 p-4  w-[200px]'>{item.title}</td>
        <td className='hidden md:table-cell'>
          <p className='truncate w-[200px]'>{item.source}</p>
        </td>
        <td className='hidden md:table-cell'>
          {item.course || 'No course assigned'}
        </td>
        <td className='hidden md:table-cell'>
          {item.class || 'No class assigned'}
        </td>
        <td className='hidden md:table-cell'>
          {item.teacher || 'No teacher assigned'}
        </td>
        <td>
          <div className='flex items-center gap-2'>
            {role === 'admin' && (
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
          <TableSearch />
          <div className='flex items-center gap-4 self-end'>
            <button className='w-8 h-8 flex items-center justify-center rounded-full bg-primary-redLight_fade'>
              <img src='/filter.png' alt='' width={14} height={14} />
            </button>
            <button className='w-8 h-8 flex items-center justify-center rounded-full bg-primary-redLight_fade'>
              <img src='/sort.png' alt='' width={14} height={14} />
            </button>
            {role === 'admin' && (
              <FormModal table='exam' type='create' onSuccess={handleSuccess} />
            )}
          </div>
        </div>
      </div>
      {/* LIST */}
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
      <Table columns={columns(t)} renderRow={renderRow} data={currentData} />
      {/* PAGINATION */}
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default ExamListPage;
