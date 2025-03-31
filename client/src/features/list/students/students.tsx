import { Link } from 'react-router-dom';
import Pagination from '@components/common/Pagination';
import Table from '@components/common/table/Table';
import TableSearch from '@components/common/table/searchs/TableSearch';
import FormModal from '@components/common/FormModal';
import { useTranslation } from 'react-i18next';
import usePagination from 'hooks/usePagination';
import { useEffect, useMemo, useState } from 'react';
import useFetchStudents from 'hooks/useFetchStudents';
import { decodeToken } from '@utils/decodeToken ';
import { useAuth } from 'hooks/useAuth';
import { highlightText } from '@utils/highlight';
import React from 'react';
import { useSort } from 'hooks/useSort';
import { sortByField } from '@utils/sortUtils';
import { Student } from '@interfaces';

const columns = (t: any) => [
  {
    header: t('table.students.header.info'),
    accessor: 'info',
  },
  {
    header: t('table.students.header.studentId'),
    accessor: 'studentId',
    className: 'hidden md:table-cell',
  },
  {
    header: t('table.students.header.classes'),
    accessor: 'classes',
    className: 'hidden md:table-cell',
  },
  {
    header: t('table.students.header.phone'),
    accessor: 'phone',
    className: 'hidden lg:table-cell',
  },
  {
    header: t('table.students.header.address'),
    accessor: 'address',
    className: 'hidden lg:table-cell',
  },
  {
    header: t('table.students.header.actions'),
    accessor: 'action',
  },
];

const StudentListPage = () => {
  const { t } = useTranslation();

  const { token } = useAuth();
  const decodedToken = decodeToken(token);
  const role = decodedToken?.role;

  const [reloadTrigger, setReloadTrigger] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const { sortConfig, handleSort, getSortIcon } = useSort<keyof Student>('id');
  const { students, loading, error } = useFetchStudents(reloadTrigger, role);

  // Hàm lọc dữ liệu client-side
  const filteredStudents = useMemo(() => {
    let result = [...(students || [])];

    //* search logic
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter((student) => {
        const searchFields = [
          student.name,
          student.email,
          String(student.id),
          student.phoneNumber,
          student.address,
          student.className,
        ];
        return searchFields.some((field) =>
          field?.toLowerCase().includes(lowerQuery)
        );
      });
    }

    //* sort logic
    return sortByField(result, sortConfig.field, sortConfig.order);
  }, [students, searchQuery, sortConfig]);

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

  const { currentData, currentPage, totalPages, setCurrentPage } =
    usePagination(filteredStudents || [], 10);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, setCurrentPage]);

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
        <td className='flex items-center gap-4 p-4'>
          <img
            src={item.photo}
            alt=''
            width={40}
            height={40}
            className='md:hidden xl:block w-10 h-10 rounded-full object-cover'
          />
          <div className='flex flex-col'>
            <h3 className='font-semibold'>
              {renderHighlightedItem(item.name)}
            </h3>
            <p className='text-xs text-gray-500'>
              {renderHighlightedItem(item.email)}
            </p>
          </div>
        </td>
        <td className='hidden md:table-cell'>
          {renderHighlightedItem(String(item.id))}
        </td>
        <td className='hidden md:table-cell'>
          {renderHighlightedItem(item.className) || 'No class assigned'}
        </td>
        <td className='hidden md:table-cell'>
          {renderHighlightedItem(item.phoneNumber)}
        </td>
        <td className='hidden md:table-cell'>
          {renderHighlightedItem(item.address)}
        </td>
        <td>
          <div className='flex items-center gap-2'>
            <Link to={`/${role}/list/students/${item.id}`}>
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
              <>
                <FormModal
                  table='student'
                  type='update'
                  data={item}
                  onSuccess={handleSuccess}
                />
                <FormModal
                  table='student'
                  type='delete'
                  id={item.id}
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
          {t('table.students.title')}
        </h1>
        <div className='flex flex-col md:flex-row items-center gap-4 w-full md:w-auto'>
          <TableSearch
            searchType='student'
            onSearch={setSearchQuery}
            placeholder={t('search.placeholder')}
          />
          <div className='flex items-center gap-4 self-end'>
            {/* <button className='w-8 h-8 flex items-center justify-center rounded-full bg-primary-redLight_fade'>
              <img src='/filter.png' alt='' width={14} height={14} />
            </button> */}
            <button
              onClick={() => handleSort('id')}
              className='w-8 h-8 flex items-center justify-center rounded-full bg-primary-redLight_fade'
            >
              <img src={getSortIcon()} alt='' width={14} height={14} />
            </button>
            {role === 'admin' && (
              <FormModal
                table='student'
                type='create'
                onSuccess={handleSuccess}
              />
            )}
          </div>
        </div>
      </div>
      {/* LIST */}
      {currentData.length === 0 ? (
        <div className='text-center py-6 text-gray-500'>no student found</div>
      ) : (
        <Table columns={columns(t)} renderRow={renderRow} data={currentData} />
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

export default StudentListPage;
