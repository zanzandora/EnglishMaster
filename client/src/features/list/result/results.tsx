import Pagination from '@components/common/Pagination';
import Table from '@components/common/table/Table';
import TableSearch from '@components/common/table/searchs/TableSearch';
import { useTranslation } from 'react-i18next';
import FormModal from '@components/common/FormModal';
import usePagination from 'hooks/usePagination';
import { useEffect, useMemo, useState } from 'react';
import { useAuth } from 'hooks/useAuth';
import { decodeToken } from '@utils/decodeToken ';
import { formatDate } from '@utils/dateUtils';
import DownloadCertificate from '@components/common/DownloadCertificate';
import { highlightText } from '@utils/highlight';
import { useSort } from 'hooks/useSort';
import { sortByField } from '@utils/sortUtils';
import { Result } from '@interfaces';
import React from 'react';

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

  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadTrigger, setReloadTrigger] = useState(0);

  const [selectedClass, setSelectedClass] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const { sortConfig, handleSort, getSortIcon } = useSort('score');

  const filteredResults = useMemo(() => {
    const filteredData = results.filter((item: Result) => {
      const classCondition =
        selectedClass === 'All' || item.className === selectedClass;

      const searchCondition =
        !searchQuery ||
        [
          item.student?.studentName,
          String(item.student?.studentID),
          item.className,
          item.courseName,
          item.MT.toString(),
          item.FT.toString(),
        ].some((field) =>
          field?.toLowerCase().includes(searchQuery.toLowerCase())
        );

      return classCondition && searchCondition;
    });

    return sortByField(filteredData, sortConfig.field, sortConfig.order);
  }, [results, selectedClass, searchQuery, sortConfig]);

  // Render item với highlight
  const renderHighlightedItem = (text: string) => {
    return (
      <span>
        {highlightText(text, searchQuery).map((part, index) => (
          <React.Fragment key={index}>{part}</React.Fragment>
        ))}
      </span>
    );
  };

  const uniqueClasses = Array.from(
    new Set(results.map((item: Result) => item.className))
  ).filter(Boolean);

  const { currentData, currentPage, totalPages, setCurrentPage } =
    usePagination(filteredResults, 10);

  const handleSuccess = () => {
    setReloadTrigger((prev) => prev + 1); // Gọi lại danh sách sau khi xóa
  };

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

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, setCurrentPage]);

  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p>Lỗi: {error}</p>;

  const renderRow = (item: any) => {
    return (
      <tr
        key={item.id}
        className='border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-secondary-lavenderFade'
      >
        <td className='flex items-center gap-4 p-4 w-[200px]'>
          {renderHighlightedItem(item.student?.studentName) ||
            'No Student was found'}
        </td>
        <td className='hidden md:table-cell'>
          {renderHighlightedItem(String(item.student.studentID))}
        </td>
        <td className='hidden md:table-cell'>
          {renderHighlightedItem(item.className) || 'No class assigned'}
        </td>

        <td className='hidden md:table-cell p-4'>
          {renderHighlightedItem(String(item.MT))}/100
        </td>
        <td className='hidden md:table-cell p-4'>
          {renderHighlightedItem(String(item.FT))}/100
        </td>
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
          <TableSearch
            searchType='result'
            onSearch={setSearchQuery}
            placeholder='Search students, classes, '
          />
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
            {/* <button className='w-8 h-8 flex items-center justify-center rounded-full bg-primary-redLight_fade'>
              <img src='/filter.png' alt='' width={14} height={14} />
            </button> */}
            <button
              onClick={() => handleSort('score')}
              className='w-8 h-8 flex items-center justify-center rounded-full bg-primary-redLight_fade'
            >
              <img src={getSortIcon()} alt='' width={14} height={14} />
            </button>
          </div>
        </div>
      </div>
      {/* LIST */}
      {currentData.length === 0 ? (
        <div className='text-center py-6 text-gray-500'>no result found</div>
      ) : (
        <Table
          columns={columns(t, role)}
          renderRow={renderRow}
          data={currentData}
        />
      )}
      {totalPages > 1 && (
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
};

export default ResultListPage;
