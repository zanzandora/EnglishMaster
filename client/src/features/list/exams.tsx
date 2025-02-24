import { Link } from 'react-router-dom';
import Pagination from '@components/common/Pagination';
import Table from '@components/common/table/Table';
import TableSearch from '@components/common/table/TableSearch';
import { examsData } from '@mockData/data';
import { useTranslation } from 'react-i18next';

type Exam = {
  id: number;
  subject: string;
  class: string;
  teacher: string;
  date: string;
};

const columns = (t: any) => [
  {
    header: t('table.exams.header.name'),
    accessor: 'name',
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
  const renderRow = (item: unknown) => {
    const exam = item as Exam;
    return (
      <tr
        key={exam.id}
        className='border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-secondary-lavenderFade'
      >
        <td className='flex items-center gap-4 p-4'>{exam.subject}</td>
        <td>{exam.class}</td>
        <td className='hidden md:table-cell'>{exam.teacher}</td>
        <td className='hidden md:table-cell'>{exam.date}</td>
        <td>
          <div className='flex items-center gap-2'>
            <Link to={`/list/teachers/${exam.id}`}>
              <button className='w-7 h-7 flex items-center justify-center rounded-full bg-tables-actions-bgEditIcon'>
                <img
                  src='/update.png'
                  alt=''
                  width={16}
                  height={16}
                  className='w-8/12'
                />
              </button>
            </Link>
            <Link to={`/list/teachers/${exam.id}`}>
              <button className='w-7 h-7 flex items-center justify-center rounded-full bg-tables-actions-bgDeleteIcon'>
                <img
                  src='/delete.png'
                  alt=''
                  width={16}
                  height={16}
                  className='w-8/12'
                />
              </button>
            </Link>
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
            <button className='w-8 h-8 flex items-center justify-center rounded-full bg-primary-redLight_fade'>
              <img src='/sort.png' alt='' width={14} height={14} />
            </button>
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns(t)} renderRow={renderRow} data={examsData} />
      {/* PAGINATION */}
      <Pagination />
    </div>
  );
};

export default ExamListPage;
