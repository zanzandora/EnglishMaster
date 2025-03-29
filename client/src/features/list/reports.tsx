import { useState } from 'react';
import DatePicker from 'react-datepicker';
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

const columns = {
  student: [
    { header: 'STT', accessor: 'stt' },
    { header: 'Student Name', accessor: 'studentName' },
    { header: 'Student ID', accessor: 'studentID' },
    { header: 'Birth', accessor: 'dateOfBirth' },
    { header: 'Class', accessor: 'className' },
    { header: 'Middle Score (MT)', accessor: 'MT' },
    { header: 'Final Score (FT)', accessor: 'FT' },
    { header: 'Total Score', accessor: 'totalScore' },
    { header: 'GPA', accessor: 'GPA' },
    { header: 'Status', accessor: 'status' },
    { header: 'Attended', accessor: 'totalCheckins' },
    { header: 'Absences', accessor: 'totalAbsences' },
  ],
  course: [
    { header: 'STT', accessor: 'stt' },
    { header: 'Course Name', accessor: 'courseName' },
    { header: 'Classes', accessor: 'className' },
    { header: 'Teachers', accessor: 'teacherName' },
    { header: 'Students', accessor: 'studentCount' },
  ],
};

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
  const [startDate, setStartDate] = useState(
    () => new Date(new Date().setDate(new Date().getDate() - 3))
  );
  const [endDate, setEndDate] = useState(new Date());

  const { currentData, currentPage, totalPages, setCurrentPage } =
    usePagination(reports, 10);

  const reportsList = [
    { key: 'student', label: 'Student' },
    { key: 'course', label: 'Course' },
  ];

  // Hàm render chung cho Student và Course
  const renderRow = (item: any, index: number, selectedReport: string) => {
    if (selectedReport === 'student') {
      return (
        <tr
          key={item.studentID}
          className='border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-secondary-lavenderFade'
        >
          <td className='p-4'>{(currentPage - 1) * 10 + index + 1}</td>
          <td className='p-4'>{item.student?.studentName}</td>
          <td className='p-4'>{item.student?.studentID}</td>
          <td className=''>
            {formatDate(item.student?.dateOfBirth, 'yyyy-MM-dd')}
          </td>
          <td className='p-2'>
            {item.class?.className || 'No class assigned'}
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
        <td className='p-4'>{item.course?.courseName || 'Dont have course'}</td>
        <td className='p-4'>{item.stats?.classNames || 'No class assigned'}</td>
        <td className='p-4'>
          {item.stats?.teacherNames || 'No teacher assigned'}
        </td>
        <td className='p-4'>{item.stats?.totalStudents || '-'}</td>
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
      <div className='flex gap-4 mb-5'>
        <TableSearch />
        <select
          onChange={(event) => setSelectedClass(event.target.value)}
          value={selectedClass}
          className='px-4 py-2 border rounded-full ring-[1.5px] ring-gray-300'
        >
          <option value=''>Select Class</option>
          {classOptions.map((classItem) => (
            <option key={classItem.id} value={classItem.id}>
              {classItem.name}
            </option>
          ))}
        </select>
        <DatePicker
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
        />
      </div>

      {/* Bảng dữ liệu */}
      <Table
        columns={
          selectedReport === 'student' ? columns.student : columns.course
        }
        data={currentData}
        renderRow={(item, index) => renderRow(item, index, selectedReport)}
      />

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
