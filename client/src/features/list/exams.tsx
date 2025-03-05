import FormModal from '@components/common/FormModal';
import Pagination from '@components/common/Pagination';
import Table from '@components/common/table/Table';
import TableSearch from '@components/common/table/TableSearch';
import {
  role,
  mockExams,
  mockClasses,
  mockCourses,
  mockTeachers,
} from '@mockData/mockData';
import usePagination from 'hooks/usePagination';
import useRelationMapper from 'hooks/useRelationMapper';
import { useTranslation } from 'react-i18next';

const columns = (t: any) => [
  {
    header: t('table.exams.header.name'),
    accessor: 'name',
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
    header: t('table.exams.header.date'),
    accessor: 'date',
    className: 'hidden md:table-cell',
  },
  {
    header: t('table.exams.header.actions'),
    accessor: 'action',
  },
];

const ExamListPage = () => {
  const { t } = useTranslation();

  const exams = useRelationMapper(mockExams, {
    classId: mockClasses,
    courseID: mockCourses,
    uploaderID: mockTeachers,
  });

  const { currentData, currentPage, totalPages, setCurrentPage } =
    usePagination(exams, 10);

  const renderRow = (item: any) => {
    return (
      <tr
        key={item.id}
        className='border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-secondary-lavenderFade'
      >
        <td className='flex items-center gap-4 p-4  w-[200px]'>{item.title}</td>
        <td className='hidden md:table-cell'>
          <p className='truncate w-[200px]'>{item.exam_file_url}</p>
        </td>
        <td className='hidden md:table-cell'>
          {item.courseID ? item.courseID.id : 'No course assigned'}
        </td>
        <td className='hidden md:table-cell'>
          {item.classID ? item.classID.className : 'No class assigned'}
        </td>
        <td className='hidden md:table-cell'>
          {item.uploaderID ? item.uploaderID.id : 'No teacher assigned'}
        </td>
        <td className='hidden md:table-cell'>{item.exam_date}</td>
        <td>
          <div className='flex items-center gap-2'>
            {role === 'admin' && (
              <>
                <FormModal table='exam' type='update' data={item} />
                <FormModal table='exam' type='delete' id={item.id} />
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
            {role === 'admin' && <FormModal table='exam' type='create' />}
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

export default ExamListPage;
