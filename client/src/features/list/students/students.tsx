// import FormModal from '@/components/FormModal';
import { Link } from 'react-router-dom';
import Pagination from '@components/common/Pagination';
import Table from '@components/common/table/Table';
import TableSearch from '@components/common/table/TableSearch';
import {
  role,
  mockStudents,
  mockClassStudents,
  mockClasses,
} from '@mockData/mockData';
import FormModal from '@components/common/FormModal';
import { useTranslation } from 'react-i18next';
import usePagination from 'hooks/usePagination';

const columns = (t: any) => [
  {
    header: t('table.students.header.info'),
    accessor: 'info',
  },
  {
    header: t('table.students.header.studentId'),
    accessor: 'studentId',
    className: 'hidden md:table-cell',
  },
  // {
  //   header: t('table.students.header.experience'),
  //   accessor: 'experience',
  //   className: 'hidden md:table-cell',
  // },
  {
    header: t('table.students.header.phone'),
    accessor: 'phone',
    className: 'hidden lg:table-cell',
  },
  {
    header: t('table.students.header.address'),
    accessor: 'address',
    className: 'hidden lg:table-cell',
  },
  {
    header: t('table.students.header.actions'),
    accessor: 'action',
  },
];

const StudentListPage = () => {
  const { t } = useTranslation();
  const { currentData, currentPage, totalPages, setCurrentPage } =
    usePagination(mockStudents, 10);
  const classStudentMap = new Map(
    mockClassStudents.map((cs) => [cs.student_id, cs])
  );
  const classMap = new Map(mockClasses.map((c) => [c.id, c]));

  const renderRow = (item: any) => {
    const classStudent = classStudentMap.get(item.student_code);
    const classInfo = classStudent ? classMap.get(classStudent.class_id) : null;

    return (
      <tr
        key={item.student_code}
        className='border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-secondary-lavenderFade'
      >
        <td className='flex items-center gap-4 p-4'>
          <img
            src={item.photo}
            alt=''
            width={40}
            height={40}
            className='md:hidden xl:block w-10 h-10 rounded-full object-cover'
          />
          <div className='flex flex-col'>
            <h3 className='font-semibold'>{item.full_name}</h3>
            <p className='text-xs text-gray-500'>
              {classInfo ? classInfo.class_name : 'No class assigned'}
            </p>
          </div>
        </td>
        <td className='hidden md:table-cell'>{item.student_code}</td>
        <td className='hidden md:table-cell'>{item.phone}</td>
        <td className='hidden md:table-cell'>{item.address}</td>
        <td>
          <div className='flex items-center gap-2'>
            <Link to={`/admin/list/students/${item.student_code}`}>
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
                  table='student'
                  type='update'
                  id={item.student_code}
                />
                <FormModal
                  table='student'
                  type='delete'
                  id={item.student_code}
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
          {t('table.students.title')}
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
            {role === 'admin' && <FormModal table='student' type='create' />}
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

export default StudentListPage;
