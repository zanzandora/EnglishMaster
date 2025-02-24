import Pagination from '@components/common/Pagination';
import Table from '@components/common/table/Table';
import TableSearch from '@components/common/table/TableSearch';
import { role, classesData } from '@mockData/data';
import FormModal from '@components/common/FormModal';
import { useTranslation } from 'react-i18next';

type Class = {
  id: number;
  name: string;
  capacity: number;
  grade: number;
  supervisor: string;
};

const columns = (t: any) => [
  {
    header: t('table.classes.header.name'),
    accessor: 'name',
  },
  {
    header: t('table.classes.header.capacity'),
    accessor: 'capacity',
    className: 'hidden md:table-cell',
  },
  {
    header: t('table.classes.header.grade'),
    accessor: 'grade',
    className: 'hidden md:table-cell',
  },
  {
    header: t('table.classes.header.supervisor'),
    accessor: 'supervisor',
    className: 'hidden md:table-cell',
  },
  {
    header: t('table.classes.header.actions'),
    accessor: 'action',
  },
];

const ClassListPage = () => {
  const { t } = useTranslation();
  const renderRow = (item: unknown) => {
    const classes = item as Class;
    return (
      <tr
        key={classes.id}
        className='border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-secondary-lavenderFade'
      >
        <td className='flex items-center gap-4 p-4'>{classes.name}</td>
        <td className='hidden md:table-cell'>{classes.capacity}</td>
        <td className='hidden md:table-cell'>{classes.grade}</td>
        <td className='hidden md:table-cell'>{classes.supervisor}</td>
        <td>
          <div className='flex items-center gap-2'>
            {role === 'admin' && (
              <>
                <FormModal table='class' type='update' data={classes} />
                <FormModal table='class' type='delete' id={classes.id} />
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
          {t('table.classes.title')}
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
            {role === 'admin' && <FormModal table='class' type='create' />}
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns(t)} renderRow={renderRow} data={classesData} />
      {/* PAGINATION */}
      <Pagination />
    </div>
  );
};

export default ClassListPage;
