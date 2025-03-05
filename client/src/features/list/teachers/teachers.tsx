import FormModal from '@components/common/FormModal';
import Pagination from '@components/common/Pagination';
import Table from '@components/common/table/Table';
import TableSearch from '@components/common/table/TableSearch';
import { role, mockTeachers, mockUsers } from '@mockData/mockData';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import usePagination from 'hooks/usePagination';
import useRelationMapper from 'hooks/useRelationMapper';

const columns = (t: any) => [
  {
    header: t('table.teachers.header.info'),
    accessor: 'info',
  },
  {
    header: t('table.teachers.header.teacherId'),
    accessor: 'teacherId',
    className: 'hidden md:table-cell',
  },
  {
    header: t('table.teachers.header.phone'),
    accessor: 'phone',
    className: 'hidden lg:table-cell',
  },
  {
    header: t('table.teachers.header.address'),
    accessor: 'address',
    className: 'hidden lg:table-cell',
  },
  {
    header: t('table.teachers.header.actions'),
    accessor: 'action',
  },
];

const TeacherListPage = () => {
  const { t } = useTranslation();
  const teachers = useRelationMapper(mockTeachers, {
    userId: mockUsers, // Ánh xạ thêm studentId nếu cần
  });
  const { currentData, currentPage, totalPages, setCurrentPage } =
    usePagination(teachers, 10);

  const renderRow = (item: any) => {
    return (
      <>
        <tr
          key={item.teacher_code}
          className='border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-secondary-lavenderFade'
        >
          <td className='flex item-center gap-4 p-4'>
            <img
              src={item.photo}
              alt=''
              width={40}
              height={40}
              className='md:hidden xl:block w-10 h-10 rounded-full object-cover'
            />
            <div className='flex flex-col'>
              <h3 className='font-semibold'>{item.name}</h3>
              <p className='text-xs text-gray-500'>{item.email}</p>
            </div>
          </td>
          <td className='hidden md:table-cell'>{item.userId}</td>
          <td className='hidden md:table-cell'>{item.phoneNumber}</td>
          <td className='hidden md:table-cell'>{item.address}</td>
          <td>
            <div className='flex teachers-center gap-2'>
              <Link to={`/admin/list/teachers/${item.teacher_code}`}>
                <button className='w-7 h-7 flex items-center justify-center rounded-full bg-tables-actions-bgViewIcon'>
                  <img
                    src='/view.png'
                    alt=''
                    width={16}
                    height={16}
                    className='w-8/12'
                  />
                </button>
              </Link>
              {role === 'admin' && (
                <>
                  <FormModal
                    table='teacher'
                    type='update'
                    id={item.teacher_code}
                  />
                  <FormModal
                    table='teacher'
                    type='delete'
                    id={item.teacher_code}
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
      <div className='flex item-center justify-between'>
        <h1 className='hidden md:block text-lg font-semibold'>
          {t('table.teachers.title')}
        </h1>
        <div className='flex flex-col md:flex-row teachers-center gap-4 w-full md:w-auto'>
          <TableSearch />
          <div className='flex teachers-center gap-4 self-end'>
            <button className='w-8 h-8 flex items-center justify-center rounded-full bg-primary-redLight_fade'>
              <img src='/filter.png' alt='' width={14} height={14} />
            </button>
            <button className='w-8 h-8 flex items-center justify-center rounded-full bg-primary-redLight_fade'>
              <img src='/sort.png' alt='' width={14} height={14} />
            </button>
            {role === 'admin' && <FormModal table='teacher' type='create' />}
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

export default TeacherListPage;
