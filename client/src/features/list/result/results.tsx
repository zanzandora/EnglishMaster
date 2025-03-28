import Pagination from '@components/common/Pagination';
import Table from '@components/common/table/Table';
import TableSearch from '@components/common/table/TableSearch';
import { useTranslation } from 'react-i18next';
import FormModal from '@components/common/FormModal';
import usePagination from 'hooks/usePagination';
import { useEffect, useState } from 'react';
import { useAuth } from 'hooks/useAuth';
import { decodeToken } from '@utils/decodeToken ';
import { formatDate } from '@utils/dateUtils';
import DownloadCertificate from '@components/common/DownloadCertificate';

const columns = (t: any, role?: string) => [
  {
    header: t('table.results.header.student'),
    accessor: 'student',
  },
  {
    header: 'Student ID',
    accessor: 'studentID',
  },
  {
    header: t('table.results.header.class'),
    accessor: 'class',
    className: 'hidden md:table-cell',
  },
  {
    header: 'Midterm score (MT)',
    accessor: 'mt',
    className: 'hidden md:table-cell',
  },
  {
    header: 'Final score (FT)',
    accessor: 'ft',
    className: 'hidden md:table-cell',
  },
  {
    header: 'Total score',
    accessor: 'score',
    className: 'hidden md:table-cell',
  },
  // {
  //   header: t('table.results.header.teacher'),
  //   accessor: 'teacher',
  //   className: 'hidden md:table-cell',
  // },

  {
    header: t('table.results.header.status'),
    accessor: 'status',
    className: 'hidden md:table-cell',
  },
  {
    header: 'Dowload Certificate',
    accessor: 'certificate',
  },
  ...(role === 'teacher'
    ? [
        {
          header: t('table.results.header.actions'),
          accessor: 'action',
        },
      ]
    : []),
];

const ResultListPage = () => {
  const { t } = useTranslation();

  const { token } = useAuth();
  const decodedToken = decodeToken(token);
  const role = decodedToken?.role;
  const teacherID = decodedToken?.user_id;

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadTrigger, setReloadTrigger] = useState(0);

  const [selectedClass, setSelectedClass] = useState<string>('All');

  useEffect(() => {
    const fetchLessons = async () => {
      setLoading(true);
      try {
        let url = '/result/list';
        if (role === 'teacher' && teacherID) {
          url += `?teacherID=${teacherID}`;
        }
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setResults(
          data.map((c: any) => ({
            ...c,
            student: {
              ...c.student,
              dateOfBirth: formatDate(c.student.dateOfBirth, 'yyyy-MM-dd'),
            },
          }))
        );
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, [reloadTrigger, role, teacherID]);

  const filteredResults = results.filter(
    (item: any) => selectedClass === 'All' || item.className === selectedClass
  );

  const uniqueClasses = Array.from(
    new Set(results.map((item: any) => item.className))
  ).filter(Boolean);

  const { currentData, currentPage, totalPages, setCurrentPage } =
    usePagination(filteredResults, 10);

  const handleSuccess = () => {
    setReloadTrigger((prev) => prev + 1); // Gọi lại danh sách sau khi xóa
  };

  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p>Lỗi: {error}</p>;

  const renderRow = (item: any) => {
    return (
      <tr
        key={item.id}
        className='border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-secondary-lavenderFade'
      >
        <td className='flex items-center gap-4 p-4 w-[200px]'>
          {item.student.studentName || 'No Student was found'}
        </td>
        <td className='hidden md:table-cell'>{item.student.studentID}</td>
        <td className='hidden md:table-cell'>
          {item.className || 'No class assigned'}
        </td>

        <td className='hidden md:table-cell p-4'>{item.MT}/100</td>
        <td className='hidden md:table-cell p-4'>{item.FT}/100</td>
        <td className='hidden md:table-cell p-3'>
          {item.MT > 0 && item.FT > 0 ? `${item.score}/100` : '-'}
        </td>
        <td className='hidden md:table-cell'>
          {item.MT > 0 && item.FT > 0 ? item.status : ' '}
        </td>
        <td className=' pl-14'>
          {item.status === 'passed' && (
            <DownloadCertificate
              studentName={item.student.studentName}
              courseName={item.courseName}
              dateToGive={item.updatedAt}
            />
          )}
        </td>
        <td>
          <div className='flex items-center gap-2'>
            {role === 'teacher' && (
              <>
                <FormModal
                  table='result'
                  type='update'
                  data={item}
                  onSuccess={handleSuccess}
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
          {t('table.results.title')}
        </h1>
        <div className='flex flex-col md:flex-row items-center gap-4 w-full md:w-auto'>
          <TableSearch />
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className='p-2 border rounded-md bg-white'
          >
            <option value='All'>All Classes</option>
            {uniqueClasses.map((className, index) => (
              <option key={index} value={className}>
                {className}
              </option>
            ))}
          </select>
          <div className='flex items-center gap-4 self-end'>
            <button className='w-8 h-8 flex items-center justify-center rounded-full bg-primary-redLight_fade'>
              <img src='/filter.png' alt='' width={14} height={14} />
            </button>
            <button className='w-8 h-8 flex items-center justify-center rounded-full bg-primary-redLight_fade'>
              <img src='/sort.png' alt='' width={14} height={14} />
            </button>
            {/* {role === 'admin' && (
              <FormModal
                table='result'
                type='create'
                onSuccess={handleSuccess}
              />
            )} */}
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table
        columns={columns(t, role)}
        renderRow={renderRow}
        data={currentData}
      />
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
