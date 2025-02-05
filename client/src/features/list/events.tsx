import { Link } from 'react-router-dom';
import Pagination from '@components/common/Pagination';
import Table from '@components/common/table/Table';
import TableSearch from '@components/common/table/TableSearch';
import { eventsData } from '@mockData/data';

type Event = {
  id: number;
  title: string;
  class: string;
  date: string;
  startTime: string;
  endTime: string;
};

const columns = [
  {
    header: 'Title',
    accessor: 'title',
  },
  {
    header: 'Class',
    accessor: 'class',
  },
  {
    header: 'Date',
    accessor: 'date',
    className: 'hidden md:table-cell',
  },
  {
    header: 'Start Time',
    accessor: 'startTime',
    className: 'hidden md:table-cell',
  },
  {
    header: 'End Time',
    accessor: 'endTime',
    className: 'hidden md:table-cell',
  },
  {
    header: 'Actions',
    accessor: 'action',
  },
];

const EventListPage = () => {
  const renderRow = (item: unknown) => {
    const event = item as Event;
    return (
      <tr
        key={event.id}
        className='border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight'
      >
        <td className='flex items-center gap-4 p-4'>{event.title}</td>
        <td>{event.class}</td>
        <td className='hidden md:table-cell'>{event.date}</td>
        <td className='hidden md:table-cell'>{event.startTime}</td>
        <td className='hidden md:table-cell'>{event.endTime}</td>
        <td>
          <div className='flex items-center gap-2'>
            <Link to={`/edit/event/${event.id}`}>
              <button className='w-7 h-7 flex items-center justify-center rounded-full bg-tables-actions-bgViewIcon'>
                <img
                  src='/update.png'
                  alt=''
                  width={16}
                  height={16}
                  className='w-8/12'
                />
              </button>
            </Link>
            <button className='w-7 h-7 flex items-center justify-center rounded-full bg-tables-actions-bgDeleteIcon'>
              <img
                src='/delete.png'
                alt=''
                width={16}
                height={16}
                className='w-8/12'
              />
            </button>
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
      <Table columns={columns} renderRow={renderRow} data={eventsData} />
      {/* PAGINATION */}
      <Pagination />
    </div>
  );
};

export default EventListPage;
