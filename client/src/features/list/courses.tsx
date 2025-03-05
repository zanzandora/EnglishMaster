import FormModal from '@components/common/FormModal';
import Pagination from '@components/common/Pagination';
import Table from '@components/common/table/Table';
import TableSearch from '@components/common/table/TableSearch';
import { role, mockCourses, mockTeachers, mockUsers } from '@mockData/mockData';
import usePagination from 'hooks/usePagination';
import useRelationMapper from 'hooks/useRelationMapper';
import { useTranslation } from 'react-i18next';

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
  const courses = useRelationMapper(mockCourses, {
    teacherID: mockTeachers,
  });
  const teachers = useRelationMapper(mockTeachers, {
    userID: mockUsers,
  });
  const { currentData, currentPage, totalPages, setCurrentPage } =
    usePagination(courses, 10);

  const renderRow = (item: any) => {
    return (
      <tr
        key={item.id}
        className='border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-secondary-lavenderFade'
      >
        <td className='flex items-center gap-4 p-4'>
          <div className='flex flex-col'>
            <h3 className='font-semibold '>{item.coursename}</h3>
            <p className='text-xs text-gray-500 ml-2 line-clamp-custom w-[200px]'>
              {item.description}
            </p>
          </div>
        </td>
        <td className='hidden md:table-cell '>{item.duration} month</td>
        <td className='hidden md:table-cell'>
          {item.userID ? item.userID.name : 'No teacher assigned'}
        </td>
        <td className='hidden md:table-cell'>{item.fee}</td>
        <td>
          <div className='flex items-center gap-2'>
            {role === 'admin' && (
              <>
                <FormModal table='course' type='update' data={item} />
                <FormModal table='course' type='delete' id={item.id} />
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
            {role === 'admin' && <FormModal table='course' type='create' />}
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

export default SubjectListPage;
