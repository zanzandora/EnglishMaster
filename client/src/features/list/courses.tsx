import FormModal from '@components/common/FormModal';
import Pagination from '@components/common/Pagination';
import Table from '@components/common/table/Table';
import TableSearch from '@components/common/table/searchs/TableSearch';
import { decodeToken } from '@utils/decodeToken ';
import { highlightText } from '@utils/highlight';
import { useAuth } from 'hooks/useAuth';
import useFetchcourses from 'hooks/useFetchCourses';
import usePagination from 'hooks/usePagination';
import React, { useEffect } from 'react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useSort } from 'hooks/useSort';
import { sortByField } from '@utils/sortUtils';

const columns = (t: any) => [
  {
    header: t('table.courses.header.name'),
    accessor: 'name',
  },

  {
    header: t('table.courses.header.duration'),
    accessor: 'duration',
    className: 'hidden md:table-cell',
  },
  {
    header: t('table.courses.header.teachers'),
    accessor: 'teachers',
    className: 'hidden md:table-cell',
  },
  {
    header: t('table.courses.header.fee'),
    accessor: 'fee',
    className: 'hidden md:table-cell',
  },
  {
    header: t('table.courses.header.actions'),
    accessor: 'action',
  },
];

const SubjectListPage = () => {
  const { t } = useTranslation();

  const { token } = useAuth();
  const decodedToken = decodeToken(token);
  const role = decodedToken?.role;

  const [reloadTrigger, setReloadTrigger] = useState(0); // Triggers a re-render when data is updated
  const [searchQuery, setSearchQuery] = useState('');
  const { sortConfig, handleSort, getSortIcon } = useSort('fee');
  const { courses, loading, error } = useFetchcourses(reloadTrigger);

  // Hàm lọc dữ liệu client-side
  const filteredCourses = useMemo(() => {
    let result = [...(courses || [])];

    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter((course) => {
        // Kiểm tra tồn tại trước khi truy cập
        const teacherNames =
          course.teachers
            ?.map((t: any) => t.teacherName?.toLowerCase())
            ?.filter(Boolean) || [];

        const searchFields = [
          course.name,
          course.description,
          String(course.fee),
          String(course.duration),
          ...teacherNames,
        ];
        return searchFields.some((field) =>
          field?.toLowerCase().includes(lowerQuery)
        );
      });
    }

    //* sort logic
    return sortByField(result, sortConfig.field, sortConfig.order);
  }, [courses, searchQuery, sortConfig]);

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
    usePagination(filteredCourses, 10);

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
          <div className='flex flex-col'>
            <h3 className='font-semibold '>
              {renderHighlightedItem(item.name)}
            </h3>
            <p className='text-xs text-gray-500 ml-2 line-clamp-custom w-[200px]'>
              {item.description}
            </p>
          </div>
        </td>
        <td className='hidden md:table-cell '>
          {renderHighlightedItem(String(item.duration))} month
        </td>
        <td className='hidden md:table-cell'>
          {Array.isArray(item.teachers) && item.teachers.length > 0 ? (
            <ul className='list-disc pl-4'>
              {item.teachers.map((teacher: any) => (
                <li key={teacher.teacherId}>
                  <Link
                    to={`/admin/list/teachers/${teacher.userID}`}
                    className='text-blue-600 hover:underline'
                  >
                    {renderHighlightedItem(teacher.teacherName)}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <span className='text-gray-500'>No teacher assigned</span>
          )}
        </td>
        <td className='hidden md:table-cell'>
          {renderHighlightedItem(
            String(
              item.fee.toLocaleString('vi-VN', {
                style: 'currency',
                currency: 'VND',
              })
            )
          )}
        </td>
        <td>
          <div className='flex items-center gap-2'>
            {role === 'admin' && (
              <>
                <FormModal
                  table='course'
                  type='update'
                  data={item}
                  onSuccess={handleSuccess}
                />
                <FormModal
                  table='course'
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
          {t('table.courses.title')}
        </h1>
        <div className='flex flex-col md:flex-row items-center gap-4 w-full md:w-auto'>
          <TableSearch
            searchType='course'
            onSearch={setSearchQuery}
            placeholder={t('search.placeholder')}
          />
          <div className='flex items-center gap-4 self-end'>
            {/* <button className='w-8 h-8 flex items-center justify-center rounded-full bg-primary-redLight_fade'>
              <img src='/filter.png' alt='' width={14} height={14} />
            </button> */}
            <button
              onClick={() => handleSort('fee')}
              className='w-8 h-8 flex items-center justify-center rounded-full bg-primary-redLight_fade'
            >
              <img src={getSortIcon()} alt='' width={14} height={14} />
            </button>
            {role === 'admin' && (
              <FormModal
                table='course'
                type='create'
                onSuccess={handleSuccess}
              />
            )}
          </div>
        </div>
      </div>
      {/* LIST */}
      {currentData.length === 0 ? (
        <div className='text-center py-6 text-gray-500'>no course found</div>
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

export default SubjectListPage;
