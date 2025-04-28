import FormModal from '@components/common/FormModal';
import Pagination from '@components/common/Pagination';
import Table from '@components/common/table/Table';
import TableSearch from '@components/common/table/searchs/TableSearch';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import usePagination from 'hooks/usePagination';
import { useEffect, useMemo, useState } from 'react';
import useFetchTeachers from 'hooks/useFetchTeachers';
import { useAuth } from 'hooks/useAuth';
import { decodeToken } from '@utils/decodeToken ';
import { highlightText } from '@utils/highlight';
import { sortByField } from '@utils/sortUtils';
import { Teacher } from '@interfaces';
import React from 'react';
import { useSort } from 'hooks/useSort';

const columns = (t: any) => [
  {
    header: t('table.teachers.header.info'),
    accessor: 'info',
  },
  {
    header: t('table.teachers.header.teacherId'),
    accessor: 'teacherId',
    className: 'hidden md:table-cell',
  },
  {
    header: 'User Name',
    accessor: 'userName',
    className: 'hidden md:table-cell',
  },
  {
    header: t('table.teachers.header.phone'),
    accessor: 'phone',
    className: 'hidden lg:table-cell',
  },
  {
    header: t('table.teachers.header.address'),
    accessor: 'address',
    className: 'hidden lg:table-cell',
  },
  {
    header: t('table.teachers.header.actions'),
    accessor: 'action',
  },
];

const TeacherListPage = () => {
  const { t } = useTranslation();

  const { token } = useAuth();
  const decodedToken = decodeToken(token);
  const role = decodedToken?.role;

  const [reloadTrigger, setReloadTrigger] = useState(0); // Triggers a re-render when data is updated
  const [searchQuery, setSearchQuery] = useState('');
  const { sortConfig, handleSort, getSortIcon } = useSort<keyof Teacher>('id');
  const { teachers, loading, error } = useFetchTeachers(reloadTrigger);

  // Hàm lọc dữ liệu client-side
  const filteredTeachers = useMemo(() => {
    let result = [...(teachers || [])];

    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter((teacher) => {
        const searchFields = [
          teacher.name,
          teacher.email,
          teacher.userName,
          String(teacher.userID),
          teacher.phoneNumber,
          teacher.address,
        ];
        return searchFields.some((field) =>
          field?.toLowerCase().includes(lowerQuery)
        );
      });
    }

    //* sort logic
    return sortByField(result, sortConfig.field, sortConfig.order);
  }, [teachers, searchQuery, sortConfig]);

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

  const handleSuccess = () => {
    setReloadTrigger((prev) => prev + 1); // Gọi lại danh sách sau khi xóa
  };
  const { currentData, currentPage, totalPages, setCurrentPage } =
    usePagination(filteredTeachers, 10);

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
        <td className='flex item-center gap-4 p-4'>
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
          {renderHighlightedItem(String(item.userID))}
        </td>
        <td className='hidden md:table-cell'>
          {renderHighlightedItem(item.userName)}
        </td>
        <td className='hidden md:table-cell'>
          {renderHighlightedItem(item.phoneNumber)}
        </td>
        <td className='hidden lg:table-cell'>
          {renderHighlightedItem(item.address)}
        </td>
        <td>
          <div className='flex teachers-center gap-2'>
            <Link to={`/${role}/list/teachers/${item.userID}`}>
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
                  table='teacher'
                  type='update'
                  data={item}
                  onSuccess={handleSuccess}
                />
                <FormModal
                  table='teacher'
                  type='delete'
                  id={item.userID}
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
      <div className='flex item-center justify-between'>
        <h1 className='hidden md:block text-lg font-semibold'>
          {t('table.teachers.title')}
        </h1>
        <div className='flex flex-col md:flex-row teachers-center gap-4 w-full md:w-auto'>
          <TableSearch
            searchType='teacher'
            onSearch={setSearchQuery}
            placeholder={t('search.placeholder')}
          />
          <div className='flex teachers-center gap-4 self-end'>
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
                table='teacher'
                type='create'
                onSuccess={handleSuccess}
              />
            )}
          </div>
        </div>
      </div>
      {/* LIST */}
      {currentData.length === 0 ? (
        <div className='text-center py-6 text-gray-500'>no teacher found</div>
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

export default TeacherListPage;
