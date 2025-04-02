import { useEffect, useMemo, useState } from 'react';
// import DatePicker from 'react-datepicker';
import { useTranslation } from 'react-i18next';
import Table from '@components/common/table/Table';
import Pagination from '@components/common/Pagination';
import useFetchreports from 'hooks/useFetchReports';
import usePagination from 'hooks/usePagination';
import { formatDate } from '@utils/dateUtils';
import TableSearch from '@components/common/table/searchs/TableSearch';
import { useFetchClassesOptions } from 'hooks/useFetchOptions';
import { useAuth } from 'hooks/useAuth';
import { decodeToken } from '@utils/decodeToken ';
import { highlightText } from '@utils/highlight';
import { useSort } from 'hooks/useSort';
import { sortByField } from '@utils/sortUtils';
import { Classes } from '@interfaces';
import React from 'react';

const columns = (t: any) => ({
  student: [
    { header: t('table.reports.student.NO'), accessor: 'stt' },
    { header: t('table.reports.student.name'), accessor: 'studentName' },
    { header: t('table.reports.student.id'), accessor: 'studentID' },
    { header: t('table.reports.student.birth'), accessor: 'dateOfBirth' },
    { header: t('table.reports.student.class'), accessor: 'className' },
    { header: t('table.reports.student.mt'), accessor: 'MT' },
    { header: t('table.reports.student.ft'), accessor: 'FT' },
    { header: t('table.reports.student.totalScore'), accessor: 'totalScore' },
    { header: 'GPA', accessor: 'GPA' },
    { header: t('table.reports.student.status'), accessor: 'status' },
    { header: t('table.reports.student.attended'), accessor: 'totalCheckins' },
    { header: t('table.reports.student.absent'), accessor: 'totalAbsences' },
  ],
  course: [
    { header: t('table.reports.course.NO'), accessor: 'stt' },
    { header: t('table.reports.course.name'), accessor: 'courseName' },
    { header: t('table.reports.course.classes'), accessor: 'className' },
    { header: t('table.reports.course.teachers'), accessor: 'teacherName' },
    { header: t('table.reports.course.students'), accessor: 'studentCount' },
  ],
});

const ReportPage = () => {
  const { t } = useTranslation();
  const { token } = useAuth();
  const decodedToken = decodeToken(token);
  const role = decodedToken?.role;
  const [selectedReport, setSelectedReport] = useState('student');
  const [selectedClass, setSelectedClass] = useState<string | undefined>('');
  const { reports, loading, error } = useFetchreports(
    0,
    selectedReport,
    selectedClass
  );
  const { classOptions } = useFetchClassesOptions();
  const [searchQuery, setSearchQuery] = useState('');
  const defaultSortField =
    selectedReport === 'student' ? 'score.totalScore' : 'class.totalStudents';
  const { sortConfig, handleSort, getSortIcon } = useSort(defaultSortField);
  // const [startDate, setStartDate] = useState(
  //   () => new Date(new Date().setDate(new Date().getDate() - 3))
  // );
  // const [endDate, setEndDate] = useState(new Date());

  const filteredReports = useMemo(() => {
    const filteredData = reports.filter((item) => {
      // Class filter
      const classCondition =
        !selectedClass || String(item.class?.classID) === selectedClass;

      // Search query filter
      let searchCondition = true;
      if (searchQuery) {
        const lowerQuery = searchQuery.toLowerCase();

        if (selectedReport === 'student') {
          searchCondition = [
            item.student?.studentName,
            String(item.student?.studentID),
            item.class?.className,
          ].some((field) => field?.toLowerCase().includes(lowerQuery));
        } else if (selectedReport === 'course') {
          searchCondition = [
            item.course?.courseName,
            item.class?.teacherNames,
            item.class?.classNames,
            item.class?.totalStudents?.toString(),
          ].some((field) => field?.toLowerCase().includes(lowerQuery));
        }
      }

      return classCondition && searchCondition;
    });

    // sort logic
    return sortByField(filteredData, sortConfig.field, sortConfig.order);
  }, [reports, selectedClass, searchQuery, selectedReport, sortConfig]);

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
    usePagination(filteredReports, 10);

  const reportsList = [
    { key: 'student', label: 'Student' },
    { key: 'course', label: 'Course' },
  ];

  // Reset search khi chuyển loại báo cáo
  useEffect(() => {
    setSearchQuery('');
    setCurrentPage(1);
  }, [selectedReport, setCurrentPage]);

  // Reset page khi chuyển loại báo cáo
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, setCurrentPage]);

  // Hàm render chung cho Student và Course
  const renderRow = (item: any, index: number, selectedReport: string) => {
    if (selectedReport === 'student') {
      return (
        <tr
          key={item.studentID}
          className='border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-secondary-lavenderFade'
        >
          <td className='p-4'>{(currentPage - 1) * 10 + index + 1}</td>
          <td className='p-4'>
            {renderHighlightedItem(item.student?.studentName)}
          </td>
          <td className='p-4'>
            {renderHighlightedItem(String(item.student?.studentID))}
          </td>
          <td className=''>
            {formatDate(item.student?.dateOfBirth, 'yyyy-MM-dd')}
          </td>
          <td className='p-2'>
            {renderHighlightedItem(item.class?.className) ||
              'No class assigned'}
          </td>
          <td className='p-4'>{item.score?.MT || 0}/100</td>
          <td className='p-4'>{item.score?.FT || 0}/100</td>
          <td className='p-4'>{item.score?.totalScore || 0}/100</td>
          <td className='p-2'>{getScoreGrade(item.score?.totalScore)}</td>
          <td className='p-2'>{item.score?.status || '-'}</td>
          <td className='p-4'>{item.attendance?.totalCheckins}</td>
          <td className='p-4'>{item.attendance?.totalAbsences}</td>
        </tr>
      );
    }

    return (
      <tr
        key={index}
        className='border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-secondary-lavender_fade'
      >
        <td className='p-4'>{(currentPage - 1) * 10 + index + 1}</td>
        <td className='p-4'>
          {renderHighlightedItem(item.course?.courseName)}
        </td>
        <td className='p-4'>{renderHighlightedItem(item.class?.classNames)}</td>
        <td className='p-4'>
          {renderHighlightedItem(item.class?.teacherNames)}
        </td>
        <td className='p-4'>
          {renderHighlightedItem(String(item.class?.totalStudents ?? 0))}
        </td>
      </tr>
    );
  };

  // Hàm tính điểm xếp hạng
  const getScoreGrade = (score: number) => {
    if (score >= 95) return 'Outstanding';
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    return 'Average';
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className='bg-white p-4 rounded-md flex-1 m-4 mt-0'>
      {role === 'admin' && (
        <>
          <div className='flex gap-4 mb-5'>
            {reportsList.map((report) => (
              <button
                key={report.key}
                className={`px-4 py-2 rounded flex grow text-center justify-center ${
                  selectedReport === report.key
                    ? 'bg-primary-redLight_fade font-bold text-orange-900'
                    : 'bg-calendar-toolBar-btn text-sky-800 font-bold hover:opacity-80'
                }`}
                onClick={() => setSelectedReport(report.key)}
              >
                {t(`table.reports.${report.key}.label`)}
              </button>
            ))}
          </div>
        </>
      )}

      {/* Bộ lọc */}
      <div className='flex justify-end gap-4 mb-5'>
        <TableSearch
          searchType={selectedReport as 'student' | 'course'}
          onSearch={setSearchQuery}
          placeholder={t('search.placeholder')}
        />
        <select
          onChange={(event) => setSelectedClass(event.target.value)}
          value={selectedClass}
          className='px-4 py-2 border rounded-full ring-[1.5px] ring-gray-300'
        >
          <option value=''>Select Class</option>
          {classOptions.map((classItem: Classes) => (
            <option key={classItem.id} value={classItem.id}>
              {classItem.name}
            </option>
          ))}
        </select>

        <div className='flex items-center '>
          <button
            onClick={() => handleSort(defaultSortField)}
            className='w-8 h-8 flex items-center justify-center rounded-full bg-primary-redLight_fade'
          >
            <img src={getSortIcon()} alt='Sort' width={14} height={14} />
          </button>
        </div>
        {/* <DatePicker
          locale={t('calendar.locale')}
          selected={startDate}
          onChange={(date) => setStartDate(date || new Date())}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          className='transition-width duration-300 ease-in-out px-4 py-2 border rounded-full border-primary'
        />
        <DatePicker
          locale={t('calendar.locale')}
          selected={endDate}
          onChange={(date) => setEndDate(date || new Date())}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate}
          className='transition-width duration-300 ease-in-out px-4 py-2 border rounded-full border-primary'
        /> */}
      </div>

      {/* Bảng dữ liệu */}
      {currentData.length === 0 ? (
        <div className='text-center py-6 text-gray-500'>no report found</div>
      ) : (
        <Table
          columns={
            selectedReport === 'student'
              ? columns(t).student
              : columns(t).course
          }
          data={currentData}
          renderRow={(item, index) => renderRow(item, index, selectedReport)}
        />
      )}

      {/* Phân trang */}
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

export default ReportPage;
