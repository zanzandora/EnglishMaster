import Pagination from '@components/common/Pagination';
import Table from '@components/common/table/Table';
import TableSearch from '@components/common/table/TableSearch';
import { role, teachersData } from '../../../../mockData/data';
import { Link } from 'react-router-dom';

type Teacher = {
  id: number;
  teacherId: string;
  name: string;
  email?: string;
  photo: string;
  phone: string;
  subjects: string[];
  classes: string[];
  address: string;
};

const columns = [
  {
    header: 'Info',
    accessor: 'info',
  },
  {
    header: 'Teacher ID',
    accessor: 'teacherId',
    className: 'hidden md:table-cell',
  },
  {
    header: 'Subjects',
    accessor: 'subjects',
    className: 'hidden md:table-cell',
  },
  {
    header: 'Classes',
    accessor: 'classes',
    className: 'hidden md:table-cell',
  },
  {
    header: 'Phone',
    accessor: 'phone',
    className: 'hidden lg:table-cell',
  },
  {
    header: 'Address',
    accessor: 'address',
    className: 'hidden lg:table-cell',
  },
  {
    header: 'Actions',
    accessor: 'action',
  },
];

const TeacherListPage = () => {
  const renderRow = (item: unknown) => {
    const teacher = item as Teacher;
    return (
      <>
        <tr
          key={teacher.id}
          className='border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-secondary-lavender_fade'
        >
          <td className='flex teachers-center gap-4 p-4'>
            <img
              src={teacher.photo}
              alt=''
              width={40}
              height={40}
              className='md:hidden xl:block w-10 h-10 rounded-full object-cover'
            />
            <div className='flex flex-col'>
              <h3 className='font-semibold'>{teacher.name}</h3>
              <p className='text-xs text-gray-500'>{teacher?.email}</p>
            </div>
          </td>
          <td className='hidden md:table-cell'>{teacher.teacherId}</td>
          <td className='hidden md:table-cell'>{teacher.subjects.join(',')}</td>
          <td className='hidden md:table-cell'>{teacher.classes.join(',')}</td>
          <td className='hidden md:table-cell'>{teacher.phone}</td>
          <td className='hidden md:table-cell'>{teacher.address}</td>
          <td>
            <div className='flex teachers-center gap-2'>
              <Link to={`/list/teachers/${teacher.id}`}>
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
                <Link to={`/list/teachers/${teacher.id}`}>
                  <button className='w-7 h-7 flex items-center justify-center rounded-full bg-tables-actions-bgDeleteIcon '>
                    <img
                      src='/delete.png'
                      alt=''
                      width={16}
                      height={16}
                      className='w-8/12'
                    />
                  </button>
                </Link>
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
      <div className='flex teachers-center justify-between'>
        <h1 className='hidden md:block text-lg font-semibold'>All Teachers</h1>
        <div className='flex flex-col md:flex-row teachers-center gap-4 w-full md:w-auto'>
          <TableSearch />
          <div className='flex teachers-center gap-4 self-end'>
            <button className='w-8 h-8 flex items-center justify-center rounded-full bg-primary-redLight_fade'>
              <img src='/filter.png' alt='' width={14} height={14} />
            </button>
            <button className='w-8 h-8 flex items-center justify-center rounded-full bg-primary-redLight_fade'>
              <img src='/sort.png' alt='' width={14} height={14} />
            </button>
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={teachersData} />
      {/* PAGINATION */}
      <Pagination />
    </div>
  );
};

export default TeacherListPage;
