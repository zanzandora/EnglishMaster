import FormModal from '@components/common/FormModal';
import Pagination from '@components/common/Pagination';
import Table from '@components/common/table/Table';
import TableSearch from '@components/common/table/TableSearch';
import { role, mockCourses, mockTeachers, mockUsers } from '@mockData/mockData';
import usePagination from 'hooks/usePagination';
import useRelationMapper from 'hooks/useRelationMapper';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const columns = (t: any) => [
  {
    header: t('table.courses.header.name'),
    accessor: 'name',
  },

  {
    header: t('table.courses.header.duration'),
    accessor: 'duration',
    className: 'hidden md:table-cell',
  },
  {
    header: t('table.courses.header.teachers'),
    accessor: 'teachers',
    className: 'hidden md:table-cell',
  },
  {
    header: t('table.courses.header.fee'),
    accessor: 'fee',
    className: 'hidden md:table-cell',
  },
  {
    header: t('table.courses.header.actions'),
    accessor: 'action',
  },
];

const SubjectListPage = () => {
  const { t } = useTranslation();
  const [courses, setCourses] = useState([]);
  const [reloadTrigger, setReloadTrigger] = useState(0); // Triggers a re-render when data is updated
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('/course/list');
        if (!response.ok) throw new Error('Lỗi khi tải dữ liệu');

        const data = await response.json();

        setCourses(data); // Cập nhật state với dữ liệu đã xử lý
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [reloadTrigger]);

  const handleSuccess = () => {
    setReloadTrigger((prev) => prev + 1); // Gọi lại danh sách sau khi xóa
  };

  const { currentData, currentPage, totalPages, setCurrentPage } =
    usePagination(courses, 10);

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
            <h3 className='font-semibold '>{item.name}</h3>
            <p className='text-xs text-gray-500 ml-2 line-clamp-custom w-[200px]'>
              {item.description}
            </p>
          </div>
        </td>
        <td className='hidden md:table-cell '>{item.duration} month</td>
        <td className='hidden md:table-cell'>
          {Array.isArray(item.teachers) && item.teachers.length > 0 ? (
            <ul className='list-disc pl-4'>
              {item.teachers.map((teacher: any) => (
                <li key={teacher.teacherId}>
                  <Link
                    to={`/admin/list/teachers/${teacher.userID}`}
                    className='text-blue-600 hover:underline'
                  >
                    {teacher.teacherName}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <span className='text-gray-500'>No teacher assigned</span>
          )}
        </td>
        <td className='hidden md:table-cell'>{item.fee}.000Đ</td>
        <td>
          <div className='flex items-center gap-2'>
            {role === 'admin' && (
              <>
                <FormModal
                  table='course'
                  type='update'
                  data={item}
                  onSuccess={handleSuccess}
                />
                <FormModal
                  table='course'
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
          {t('table.courses.title')}
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
              <FormModal
                table='course'
                type='create'
                onSuccess={handleSuccess}
              />
            )}
          </div>
        </div>
      </div>
      {/* PAGINATION */}
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
      {/* LIST */}
      <Table columns={columns(t)} renderRow={renderRow} data={currentData} />
    </div>
  );
};

export default SubjectListPage;
