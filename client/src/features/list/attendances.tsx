import { useState, useMemo } from 'react';
import { attendanceData as rawAttendanceData } from '@mockData/data';
import DatePicker, { registerLocale } from 'react-datepicker';
import { useTranslation } from 'react-i18next';
import Pagination from '@components/common/Pagination';
import Table from '@components/common/table/Table';
import SearchBoldIcon from '@components/svg/SearchBoldIcon';
import {
  addDays,
  startOfWeek,
  format,
  isSameMonth,
  getDaysInMonth,
} from 'date-fns';
import { enGB } from 'date-fns/locale/en-GB';
import { vi } from 'date-fns/locale/vi';
import usePagination from 'hooks/usePagination';

const role = 'admin';

registerLocale('en-GB', enGB);
registerLocale('vi', vi);

// Định nghĩa kiểu dữ liệu của từng học sinh
type Student = {
  id: number;
  name: string;
  className: string;
  teacher: string;
  attendance: Record<string, boolean>;
  note?: string; // Lưu điểm danh theo ngày thực tế
};

// Tách cấu hình columns
const columnsAdmin = (currentWeekDays: Date[], t: any) => [
  {
    header: t('table.attendances.header.name'),
    accessor: 'name',
  },
  {
    header: t('table.attendances.header.total'),
    accessor: 'total',
  },
  ...currentWeekDays.map((date) => ({
    header: format(date, 'dd/MM'),
    accessor: format(date, 'dd/MM/yyyy'),
    className: 'text-center',
  })),
  {
    header: t('table.attendances.header.attendancePercentage'),
    accessor: 'attendancePercentage',
    className: 'text-center min-w-10',
  },
];

const columnsTeacher = [
  { header: 'STT', accessor: 'id' },
  {
    header: 'Student Name',
    accessor: 'name',
  },
  { header: 'Birth', accessor: 'birth' },
  {
    header: 'Checked',
    accessor: 'attendance',
  },
  { header: 'Note', accessor: 'note' },
];

const AttendancePage = () => {
  const { t } = useTranslation();
  const [role, setRole] = useState('admin');
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [currentWeek, setCurrentWeek] = useState<number>(1);
  const [attendances, setAttendances] = useState<Student[]>(() =>
    rawAttendanceData.map((student) => ({
      ...student,
      attendance: Object.fromEntries(
        Object.entries(student.attendance).map(([date, attended]) => [
          date,
          attended ?? false,
        ])
      ),
      note: student.note || '', // Ensure note property is included
    }))
  );
  const [selectedTeacher, setSelectedTeacher] = useState<string>('All');
  const [selectedClass, setSelectedClass] = useState<string>('All');

  // Lấy các ngày trong tuần hiện tại
  const currentWeekDays = useMemo(() => {
    if (!selectedDate) return [];
    const startDate = startOfWeek(addDays(selectedDate, (currentWeek - 1) * 7));
    return Array.from({ length: 7 }, (_, i) => addDays(startDate, i)).filter(
      (date) => isSameMonth(date, selectedDate)
    );
  }, [selectedDate, currentWeek]);

  // Tính tổng số buổi có mặt trong tuần
  const calculateTotalAttendance = (attendance: Record<string, boolean>) => {
    return currentWeekDays.reduce((total, date) => {
      const formattedDate = format(date, 'dd/MM/yyyy');
      return total + (attendance[formattedDate] ? 1 : 0);
    }, 0);
  };

  // Tính phần trăm điểm danh của từng học sinh theo ngày đã chọn
  const calculateAttendancePercentage = (
    attendance: Record<string, boolean>,
    selectedDate: Date = new Date()
  ) => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const totalDaysInMonth = getDaysInMonth(selectedDate); // Tổng số ngày trong tháng

    let attendedDays = 0;

    // Lặp qua tất cả các ngày trong tháng
    for (let day = 1; day <= totalDaysInMonth; day++) {
      const date = new Date(year, month, day);
      const formattedDate = format(date, 'dd/MM/yyyy');
      if (attendance[formattedDate]) {
        attendedDays++;
      }
    }

    // Tính phần trăm
    return totalDaysInMonth > 0
      ? ((attendedDays / totalDaysInMonth) * 100).toFixed(2)
      : '0.00';
  };

  // Lọc dữ liệu theo bộ lọc Teacher và Class
  const filteredAttendances = useMemo(() => {
    return attendances.filter((student) => {
      const isTeacherMatch =
        selectedTeacher === 'All' || student.teacher === selectedTeacher;
      const isClassMatch =
        selectedClass === 'All' || student.className === selectedClass;
      return isTeacherMatch && isClassMatch;
    });
  }, [attendances, selectedTeacher, selectedClass]);

  const tableData = filteredAttendances.map((student) => ({
    ...student,
    total: calculateTotalAttendance(student.attendance),
    attendancePercentage: calculateAttendancePercentage(
      student.attendance,
      selectedDate || new Date()
    ),
  }));
  const { currentData, currentPage, totalPages, setCurrentPage } =
    usePagination(tableData, 10);
  // Render từng dòng trong bảng
  const renderRowAdmin = (item: unknown) => {
    const student = item as Student & {
      total: number;
      attendancePercentage: string;
    };
    return (
      <tr
        key={student.id}
        className='border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-secondary-lavenderFade'
      >
        <td className='p-4'>{student.name}</td>
        <td className='p-4'>{student.total}</td>
        {currentWeekDays.map((date) => {
          const formattedDate = format(date, 'dd/MM/yyyy');
          const attended = student.attendance[formattedDate] || false;
          return (
            <td key={formattedDate} className='text-center'>
              <label className='group flex items-center justify-center cursor-pointer'>
                <input
                  type='checkbox'
                  checked={attended}
                  onChange={() => {
                    setAttendances((prev) =>
                      prev.map((s) =>
                        s.id === student.id
                          ? {
                              ...s,
                              attendance: {
                                ...s.attendance,
                                [formattedDate]: !attended,
                              },
                            }
                          : s
                      )
                    );
                  }}
                  disabled={role === 'admin'}
                  className='w-5 h-5 hidden peer'
                />
                <span className='relative w-5 h-5 flex justify-center items-center bg-gray-100 border-2 border-gray-400 rounded-md shadow-md transition-all duration-300 peer-checked:border-blue-500 peer-checked:bg-blue-500 group-hover:scale-105'></span>
              </label>
            </td>
          );
        })}
        <td className='text-center'>{student.attendancePercentage}%</td>
        <td className='p-4'>{student.note}</td>
      </tr>
    );
  };

  const renderRowTeacher = (item: unknown) => {
    const student = item as Student;
    return (
      <tr
        key={student.id}
        className='border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-secondary-lavender_fade'
      >
        <td className='p-4'>{student.id}</td>
        <td className='p-4'>{student.name}</td>
        <td className='p-4'>{student.birth}</td>
        <td className='p-4'>
          <input
            type='checkbox'
            onChange={() => {
              setAttendances((prev) =>
                prev.map((s) =>
                  s.id === student.id
                    ? {
                        ...s,
                        attendance: {
                          ...s.attendance,
                          [format(new Date(), 'dd/MM/yyyy')]:
                            !s.attendance[format(new Date(), 'dd/MM/yyyy')],
                        },
                      }
                    : s
                )
              );
            }}
            className='w-5 h-5'
          />
        </td>
        <td className='p-4'>{student.note}</td>
      </tr>
    );
  };

  return (
    <div className='p-4 mt-0 bg-white m-4 rounded-lg flex-1'>
      <div className='flex items-center justify-between'>
        <h1 className='hidden md:block text-lg font-semibold'>
          {t('table.attendances.title')}
        </h1>
        <div className='flex flex-col md:flex-row items-center gap-4 w-full md:w-auto'>
          <button
            className={`w-full text-sm text-gray-500 hover:text-gray-700`}
            onClick={() =>
              setRole((prevRole) =>
                prevRole === 'admin' ? 'teacher' : 'admin'
              )
            }
          >
            {role}
          </button>
          <select
            className='border rounded-md p-2'
            value={selectedTeacher}
            onChange={(e) => setSelectedTeacher(e.target.value)}
          >
            <option value='All'>{t('filters.teachers.all')}</option>
            <option value='Teacher A'>Teacher A</option>
            <option value='Teacher B'>Teacher B</option>
          </select>
          <select
            className='border rounded-md p-2'
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            <option value='All'>{t('filters.classes.all')}</option>
            <option value='Class 1'>Class 1</option>
            <option value='Class 2'>Class 2</option>
          </select>
          <DatePicker
            showIcon
            toggleCalendarOnIconClick
            icon={<SearchBoldIcon />}
            locale={t('calendar.locale')}
            selected={selectedDate}
            onChange={(date) => {
              setSelectedDate(date);
              setCurrentWeek(1);
            }}
            showMonthDropdown
            className='px-2 border rounded-lg ring-gray-300 hidden md:inline-block'
            popperClassName='datepicker-popup'
            portalId='root'
            dateFormat='dd/MM/yyyy'
          />
        </div>
      </div>
      <div className='overflow-x-auto'>
        {role === 'admin' ? (
          <Table
            columns={columnsAdmin(currentWeekDays, t)}
            data={currentData}
            renderRow={renderRowAdmin}
          />
        ) : (
          <Table
            columns={columnsTeacher}
            data={currentData}
            renderRow={renderRowTeacher}
          />
        )}
      </div>
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default AttendancePage;
