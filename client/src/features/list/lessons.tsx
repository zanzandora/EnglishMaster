import Pagination from '@components/common/Pagination';
import Table from '@components/common/table/Table';
import TableSearch from '@components/common/table/TableSearch';
import {
  role,
  mockLessons,
  mockClasses,
  mockTeachers,
  mockUsers,
  mockCourses,
} from '@mockData/mockData';
import FormModal from '@components/common/FormModal';
import { useTranslation } from 'react-i18next';
import usePagination from 'hooks/usePagination';
import useRelationMapper from 'hooks/useRelationMapper';

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

  const { currentData, currentPage, totalPages, setCurrentPage } =
    usePagination(mockLessons, 10);
  const renderRow = (item: any) => {
    return (
      <tr
        key={item.id}
        className='border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-secondary-lavenderFade'
      >
        <td className='flex items-center gap-4 p-4'>
          <div className='flex flex-col'>
            <h3 className='font-semibold'>{item.title}</h3>
            <p className='text-xs text-gray-500 w-[200px] line-clamp-custom'>
              {item.description}
            </p>
          </div>
        </td>

        <td className='hidden md:table-cell'>{item.file_url}</td>
        <td className='hidden md:table-cell'>{item.type}</td>

        <td>
          <div className='flex items-center gap-2'>
            {role === 'admin' && (
              <>
                <FormModal table='lesson' type='update' data={item} />
                <FormModal table='lesson' type='delete' id={item.id} />
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
          {t('table.lessons.title')}
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
            {role === 'admin' && <FormModal table='lesson' type='create' />}
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

export default LessonListPage;
