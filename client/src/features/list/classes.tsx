import Pagination from '@components/common/Pagination';
import Table from '@components/common/table/Table';
import TableSearch from '@components/common/table/TableSearch';
import {
  role,
  mockClasses,
  mockTeachers,
  mockCourses,
} from '@mockData/mockData';
import FormModal from '@components/common/FormModal';
import { useTranslation } from 'react-i18next';
import usePagination from 'hooks/usePagination';
import { useState, useEffect } from 'react';
import { formatDate, formatDateLocale } from '@utils/dateUtils';

const columns = (t: any) => [
  {
    header: t('table.classes.header.name'),
    accessor: 'name',
  },
  {
    header: t('table.classes.header.capacity'),
    accessor: 'capacity',
    className: 'hidden md:table-cell',
  },
  {
    header: t('table.classes.header.students'),
    accessor: 'students',
    className: 'hidden md:table-cell',
  },
  {
    header: t('table.classes.header.course'),
    accessor: 'course',
    className: 'hidden md:table-cell',
  },
  {
    header: t('table.classes.header.teacher'),
    accessor: 'teacher',
    className: 'hidden md:table-cell',
  },

  {
    header: t('table.classes.header.actions'),
    accessor: 'action',
  },
];

const ClassListPage = () => {
  const { t } = useTranslation();

  const [classes, setClasses] = useState(mockTeachers);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await fetch('/class/list');
        if (!response.ok) throw new Error('Lỗi khi tải dữ liệu');

        const data = await response.json();

        setClasses(
          data.map((c: any) => ({
            ...c,
            startTime: formatDate(c.startTime, 'yyyy-MM-dd'),
            endTime: formatDate(c.endTime, 'yyyy-MM-dd'),
          }))
        ); // Cập nhật state với dữ liệu đã xử lý
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  const { currentData, currentPage, totalPages, setCurrentPage } =
    usePagination(classes, 10);

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
            <h3 className='font-semibold'>{item.className}</h3>
            <p className='text-xs text-gray-500'>
              {item.startTime} - {item.endTime}
            </p>
          </div>
        </td>
        <td className='hidden md:table-cell'>{item.capicity}</td>

        <td className='hidden md:table-cell'>{item.totalStudents}</td>
        <td className='hidden md:table-cell'>
          {item.courseName || 'No course assigned'}
        </td>
        <td className='hidden md:table-cell'>
          {item.teacherName || 'No teacher assigned'}
        </td>
        <td>
          <div className='flex items-center gap-2'>
            {role === 'admin' && (
              <>
                <FormModal table='class' type='update' data={item} />
                <FormModal table='class' type='delete' id={item.id} />
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
          {t('table.classes.title')}
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
            {role === 'admin' && <FormModal table='class' type='create' />}
          </div>
        </div>
      </div>
      {/* LIST */}
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

export default ClassListPage;
