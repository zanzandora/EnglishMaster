import { Link } from 'react-router-dom';
import Pagination from '@components/common/Pagination';
import Table from '@components/common/table/Table';
import TableSearch from '@components/common/table/TableSearch';
import {
  role,
  mockScores,
  mockExams,
  mockStudents,
  mockClasses,
} from '@mockData/mockData';
import { useTranslation } from 'react-i18next';
import FormModal from '@components/common/FormModal';
import useRelationMapper from 'hooks/useRelationMapper';
import usePagination from 'hooks/usePagination';

const columns = (t: any) => [
  {
    header: t('table.results.header.name'),
    accessor: 'name',
  },
  {
    header: t('table.results.header.student'),
    accessor: 'student',
  },
  {
    header: t('table.results.header.score'),
    accessor: 'score',
    className: 'hidden md:table-cell',
  },
  // {
  //   header: t('table.results.header.teacher'),
  //   accessor: 'teacher',
  //   className: 'hidden md:table-cell',
  // },
  {
    header: t('table.results.header.class'),
    accessor: 'class',
    className: 'hidden md:table-cell',
  },
  {
    header: t('table.results.header.date'),
    accessor: 'date',
    className: 'hidden md:table-cell',
  },
  {
    header: t('table.results.header.status'),
    accessor: 'status',
    className: 'hidden md:table-cell',
  },
  {
    header: t('table.results.header.actions'),
    accessor: 'action',
  },
];

const ResultListPage = () => {
  const { t } = useTranslation();

  const results = useRelationMapper(mockScores, {
    examId: mockExams,
    studentId: mockStudents,
  });
  const classes = useRelationMapper(mockExams, {
    classId: mockClasses,
  });

  const { currentData, currentPage, totalPages, setCurrentPage } =
    usePagination(results, 10);

  const renderRow = (item: any) => {
    return (
      <tr
        key={item.id}
        className='border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-secondary-lavenderFade'
      >
        <td className='flex items-center gap-4 p-4 w-[200px]'>
          {item.examID ? item.examId.title : ' No exam was found'}
        </td>
        <td>
          {item.studentId ? item.studentId.fullName : 'No Student was found'}
        </td>
        <td className='hidden md:table-cell'>{item.score}/10</td>
        <td className='hidden md:table-cell'>
          {item.classId ? item.classId.className : 'No class assigned'}
        </td>
        <td className='hidden md:table-cell'>
          {item.examID ? item.examId.exam_date : 'No date was found'}
        </td>
        <td className='hidden md:table-cell'>{item.status}</td>
        <td>
          <div className='flex items-center gap-2'>
            {role === 'admin' && (
              <>
                <FormModal table='result' type='update' data={item} />
                <FormModal table='result' type='delete' id={item.id} />
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
          {t('table.results.title')}
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
            {role === 'admin' && <FormModal table='result' type='create' />}
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

export default ResultListPage;
