import Pagination from '@components/common/Pagination';
import Table from '@components/common/table/Table';
import TableSearch from '@components/common/table/searchs/TableSearch';
import FormModal from '@components/common/FormModal';
import { useTranslation } from 'react-i18next';
import usePagination from 'hooks/usePagination';
import { useEffect, useMemo, useState } from 'react';
import useFetchClasses from 'hooks/useFetchClasses';
import { useParams } from 'react-router-dom';
import { useAuth } from 'hooks/useAuth';
import { decodeToken } from '@utils/decodeToken ';

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

  const { token } = useAuth();
  const decodedToken = decodeToken(token);
  const role = decodedToken?.role;
  const tokenUserID = decodedToken?.user_id;

  const { userID: urlUserID } = useParams();
  const [reloadTrigger, setReloadTrigger] = useState(0); // Triggers a re-render when data is updated

  // Xác định userID dựa trên role
  const targetUserID = useMemo(() => {
    if (role === 'teacher') {
      return parseInt(tokenUserID); // Teacher luôn dùng userID từ token
    } else if (urlUserID) {
      // Admin truy cập qua URL /admin/teachers/{userID}/classes
      return parseInt(urlUserID);
    }
    return undefined; // Admin xem tất cả
  }, [role, tokenUserID, urlUserID]);

  useEffect(() => {
    setReloadTrigger(0); // Reset trigger mỗi khi component được mount lại
  }, [urlUserID]);

  const { classes, loading, error } = useFetchClasses(
    reloadTrigger,
    targetUserID
  );

  const handleSuccess = () => {
    setReloadTrigger((prev) => prev + 1); // Gọi lại danh sách sau khi xóa
  };

  const { currentData, currentPage, totalPages, setCurrentPage } =
    usePagination(classes, 10);

  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p>Lỗi: {error}</p>;

  const renderRow = (item: any) => {
    return (
      <>
        <tr
          key={item.id}
          className='border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-secondary-lavenderFade'
        >
          <td className='flex items-center gap-4 p-4'>
            <div className='flex flex-col'>
              <h3 className='font-semibold'>{item.name}</h3>
              <p className='text-xs text-gray-500'>
                {item.startDate} - {item.endDate}
              </p>
            </div>
          </td>
          <td className='hidden md:table-cell'>{item.capacity}</td>

          <td className='hidden md:table-cell'>
            {item.totalStudents ? item.totalStudents : 0}
          </td>
          <td className='hidden md:table-cell'>
            {item.courseName || 'No course assigned'}
          </td>
          <td className='hidden md:table-cell'>
            {item.teacherName || 'No teacher assigned'}
          </td>
          <td>
            <div className='flex items-center gap-2'>
              <FormModal table='students' type='list' id={item.id} />

              {role === 'admin' && !targetUserID && (
                <>
                  <FormModal
                    table='class'
                    type='update'
                    data={item}
                    onSuccess={handleSuccess}
                  />
                  <FormModal
                    table='class'
                    type='delete'
                    id={item.id}
                    onSuccess={handleSuccess}
                  />
                </>
              )}
            </div>
          </td>
        </tr>
      </>
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
            {role === 'admin' && !targetUserID && (
              <FormModal
                table='class'
                type='create'
                onSuccess={handleSuccess}
              />
            )}
          </div>
        </div>
      </div>
      {/* PAGINATION */}
      {currentData.length === 0 ? (
        <div className='text-center py-6 text-gray-500'>no class found</div>
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

export default ClassListPage;
