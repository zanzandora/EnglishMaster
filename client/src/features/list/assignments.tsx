import { Link } from 'react-router-dom';
import Pagination from '@components/common/Pagination';
import Table from '@components/common/table/Table';
import TableSearch from '@components/common/table/searchs/TableSearch';
import { assignmentsData } from '@mockData/data';

type Assignment = {
  id: number;
  subject: string;
  class: string;
  teacher: string;
  dueDate: string;
};

const columns = [
  {
    header: 'Course Name',
    accessor: 'name',
  },
  {
    header: 'Class',
    accessor: 'class',
  },
  {
    header: 'Teacher',
    accessor: 'teacher',
    className: 'hidden md:table-cell',
  },
  {
    header: 'Due Date',
    accessor: 'dueDate',
    className: 'hidden md:table-cell',
  },
  {
    header: 'Actions',
    accessor: 'action',
  },
];

const AssignmentListPage = () => {
  const renderRow = (item: unknown) => {
    const assignment = item as Assignment;
    return (
      <tr
        key={assignment.id}
        className='border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-secondary-lavenderFade'
      >
        <td className='flex items-center gap-4 p-4'>{assignment.subject}</td>
        <td>{assignment.class}</td>
        <td className='hidden md:table-cell'>{assignment.teacher}</td>
        <td className='hidden md:table-cell'>{assignment.dueDate}</td>
        <td>
          <div className='flex items-center gap-2'>
            <Link to={`/list/teachers/${assignment.id}`}>
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
        <h1 className='hidden md:block text-lg font-semibold'>All Classes</h1>
        <div className='flex flex-col md:flex-row items-center gap-4 w-full md:w-auto'>
          <TableSearch />
          <div className='flex items-center gap-4 self-end'>
            <button className='w-8 h-8 flex items-center justify-center rounded-full bg-primary-redLight_fade'>
              <img src='/filter.png' alt='' width={14} height={14} />
            </button>
            <button className='w-8 h-8 flex items-center justify-center rounded-full bg-primary-redLight_fade'>
              <img src='/sort.png' alt='' width={14} height={14} />
            </button>
            {/* {role === 'admin' && <FormModal table='class' type='create' />} */}
            <button className='w-8 h-8 flex items-center justify-center rounded-full bg-primary-redLight_fade'>
              <img src='/create.png' alt='' width={14} height={14} />
            </button>
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={assignmentsData} />
      {/* PAGINATION */}
      <Pagination />
    </div>
  );
};

export default AssignmentListPage;
