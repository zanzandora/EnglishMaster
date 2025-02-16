import { useState, useMemo, useEffect } from 'react';
import { attendanceData } from '@mockData/data';
import DatePicker from 'react-datepicker';
import Pagination from '@components/common/Pagination';
import Table from '@components/common/table/Table';
import SearchBoldIcon from '@components/svg/SearchBoldIcon';
import {
  addDays,
  startOfWeek,
  format,
  getDay,
  getDate,
  isSameMonth,
  endOfMonth,
} from 'date-fns';
// Định nghĩa kiểu dữ liệu của từng học sinh
type Student = {
  id: number;
  name: string;
  attendance: boolean[]; // Mảng lưu trạng thái điểm danh trong tháng
};

// Tách cấu hình columns
const columns = (currentWeekDays: Date[]) => [
  {
    header: 'Student Name',
    accessor: 'name',
  },
  {
    header: 'Total Week',
    accessor: 'totalWeek',
    className: 'text-center min-w-10',
  },

  ...currentWeekDays.map((date) => ({
    header: format(date, 'dd/MM'),
    accessor: format(date, 'dd/MM/yyyy'),
    className: 'text-center',
  })),
  {
    header: 'Attendance %',
    accessor: 'attendancePercentage',
    className: 'text-center min-w-10',
  },
];

const AttendancePage = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [currentWeek, setCurrentWeek] = useState<number>(1);
  const memoizedDate = useMemo(() => selectedDate, [selectedDate]);
  const [attendances, setAttendances] = useState<Student[]>(attendanceData);
  const [selectedTeacher, setSelectedTeacher] = useState<string>('All');
  const [selectedClass, setSelectedClass] = useState<string>('All');

  // Lấy số tuần trong tháng đã chọn
  const totalWeeks = useMemo(() => {
    if (!selectedDate) return 0;

    const startOfMonth = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      1
    );
    const endOfMonth = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth() + 1,
      0
    );

    let start = startOfWeek(startOfMonth);
    let weeks = 0;

    while (start <= endOfMonth) {
      weeks++;
      start = addDays(start, 7); // Chuyển sang tuần tiếp theo
    }

    return weeks;
  }, [selectedDate]);

  // Tính các ngày trong tuần hiện tại
  const currentWeekDays = useMemo(() => {
    if (!selectedDate) return [];
    const startDate = startOfWeek(
      addDays(
        new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1),
        (currentWeek - 1) * 7
      )
    );
    return Array.from({ length: 7 }, (_, i) => addDays(startDate, i)).filter(
      (date) => isSameMonth(date, selectedDate)
    );
  }, [selectedDate, currentWeek]);

  // Điều hướng tuần trước và tuần sau
  const handlePreviousWeek = () => {
    setCurrentWeek((prev) => (prev > 1 ? prev - 1 : totalWeeks));
  };

  const handleNextWeek = () => {
    setCurrentWeek((prev) => (prev < totalWeeks ? prev + 1 : 1));
  };

  // Tính tổng số buổi có mặt trong tuần
  const calculateTotalAttendance = (attendance: boolean[]) => {
    return currentWeekDays.reduce((total, date) => {
      const dayIndex = getDate(date) - 1; // Chỉ số của ngày trong mảng attendance
      return total + (attendance[dayIndex] ? 1 : 0);
    }, 0);
  };

  // Tính phần trăm điểm danh trong tháng
  const calculateAttendancePercentage = (attendance: boolean[]) => {
    const totalDaysInMonth = endOfMonth(selectedDate!).getDate();
    const totalAttendanceDays = attendance.filter((day) => day).length;
    return ((totalAttendanceDays / totalDaysInMonth) * 100).toFixed(2);
  };

  // Tách dữ liệu cho bảng
  const tableData = attendances.map((student) => {
    const totalWeek = calculateTotalAttendance(student.attendance);
    const attendancePercentage = calculateAttendancePercentage(
      student.attendance
    );
    return {
      ...student,
      totalWeek, // Tổng số buổi có mặt trong tuần hiện tại
      attendancePercentage, // Phần trăm điểm danh trong tháng
    };
  });

  // Render từng dòng trong bảng
  const renderRow = (item: unknown) => {
    const student = item as Student & {
      totalWeek: number;
      attendancePercentage: string;
    };
    return (
      <tr
        key={student.id}
        className='border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-secondary-lavenderFade'
      >
        <td className='p-4'>{student.name}</td>
        <td className='text-center'>{student.totalWeek}</td>
        {currentWeekDays.map((date) => {
          const dayIndex = getDate(date) - 1; // Chỉ số của ngày trong mảng attendance
          const attended = student.attendance[dayIndex] || false;
          return (
            <td key={date.toString()} className='text-center'>
              <label className='group flex items-center justify-center cursor-pointer'>
                <input
                  type='checkbox'
                  checked={attended}
                  onChange={() => {
                    const updatedStudents = [...attendances];
                    const studentIndex = updatedStudents.findIndex(
                      (s) => s.id === student.id
                    );
                    if (studentIndex !== -1) {
                      updatedStudents[studentIndex].attendance[dayIndex] =
                        !attended;
                      setAttendances(updatedStudents);
                    }
                  }}
                  className='w-5 h-5 hidden peer'
                />
                <span className='relative w-5 h-5 flex justify-center items-center bg-gray-100 border-2 border-gray-400 rounded-md shadow-md transition-all duration-300 peer-checked:border-blue-500 peer-checked:bg-blue-500 group-hover:scale-105'></span>
              </label>
            </td>
          );
        })}
        <td className='text-center'>{student.attendancePercentage}%</td>
      </tr>
    );
  };

  useEffect(() => {
    if (selectedDate) {
      const startOfMonth = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        1
      );
      const selectedWeek = Math.ceil(
        (selectedDate.getDate() + startOfMonth.getDay()) / 7
      );
      setCurrentWeek(selectedWeek);
    }
  }, [selectedDate]);

  return (
    <div className='p-4 mt-0 bg-white m-4 rounded-lg flex-1'>
      <div className='flex items-center justify-between'>
        <h1 className='hidden md:block text-lg font-semibold'>Attendance</h1>
        <div className='flex flex-col md:flex-row items-center gap-4 w-full md:w-auto'>
          {/* Bộ lọc Teacher */}
          <select
            className='border rounded-md p-2'
            value={selectedTeacher}
            onChange={(e) => setSelectedTeacher(e.target.value)}
          >
            <option value='All'>All Teachers</option>
            <option value='Teacher A'>Teacher A</option>
            <option value='Teacher B'>Teacher B</option>
          </select>
          {/* Bộ lọc Class */}
          <select
            className='border rounded-md p-2'
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            <option value='All'>All Classes</option>
            <option value='Class 1'>Class 1</option>
            <option value='Class 2'>Class 2</option>
          </select>
          <DatePicker
            showIcon
            toggleCalendarOnIconClick
            icon={<SearchBoldIcon />}
            locale='en-GB'
            selected={memoizedDate}
            onChange={(date) => {
              setSelectedDate(date);
            }}
            className='px-2 border rounded-lg ring-gray-300 hidden md:inline-block'
            popperClassName='datepicker-popup'
            portalId='root'
            dateFormat='dd/MM/yyyy'
          />
          <button className='w-8 h-8 flex items-center justify-center rounded-full bg-primary-redLight_fade'>
            <img src='/search_bold.png' alt='' width={14} height={14} />
          </button>
        </div>
      </div>

      <div className='flex justify-between my-4'>
        <button
          onClick={handlePreviousWeek}
          className='px-4 py-2 bg-gray-300 rounded'
        >
          Previous Week
        </button>
        <span>
          Week {currentWeek} / {totalWeeks}
        </span>
        <button
          onClick={handleNextWeek}
          className='px-4 py-2 bg-gray-300 rounded'
        >
          Next Week
        </button>
      </div>

      <div className='overflow-x-auto'>
        <Table
          columns={columns(currentWeekDays)}
          data={tableData}
          renderRow={renderRow}
        />
      </div>
      <Pagination />
    </div>
  );
};

export default AttendancePage;
