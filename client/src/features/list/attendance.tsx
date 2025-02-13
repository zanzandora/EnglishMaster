import { useState, useMemo } from 'react';
import { attendanceData } from '@mockData/data';
import DatePicker from 'react-datepicker';
import Pagination from '@components/common/Pagination';
import Table from '@components/common/table/Table';
import SearchBoldIcon from '@components/svg/SearchBoldIcon';

type Student = {
  id: number;
  name: string;
  attendance: boolean[];
};
const columns = [
  {
    header: 'Student Name',
    accessor: 'name',
    classname: 'text-center min-w-20 sticky left-40 ',
  },
  ...Array.from({ length: 20 }, (_, i) => ({
    header: `${i + 1}`,
    accessor: `day${i + 1}`,
    className: 'hidden md:table-cell p-2 text-center min-w-10',
  })),
];
const AttendancePage = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const memoizedDate = useMemo(() => selectedDate, [selectedDate]);
  const [selectedGrade, setSelectedGrade] = useState('5th');
  const [students, setStudents] = useState<Student[]>(attendanceData);

  const toggleAttendance = (studentIndex: number, dayIndex: number) => {
    const updatedStudents = [...students];
    updatedStudents[studentIndex].attendance[dayIndex] =
      !updatedStudents[studentIndex].attendance[dayIndex];
    setStudents(updatedStudents);
  };

  const renderRow = (item: unknown) => {
    const student = item as Student;
    return (
      <tr
        key={student.id}
        className='border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-secondary-lavenderFade'
      >
        <td className='p-4'>{student.name}</td>
        {student.attendance.map((attended, dayIndex) => (
          <td key={dayIndex} className='hidden md:table-cell text-center'>
            <label className='group flex items-center justify-center cursor-pointer'>
              <input
                type='checkbox'
                checked={attended}
                onChange={() => toggleAttendance(student.id - 1, dayIndex)}
                className='w-5 h-5 hidden peer'
              />
              <span className='relative w-5 h-5 flex justify-center items-center bg-gray-100 border-2 border-gray-400 rounded-md shadow-md transition-all duration-300 peer-checked:border-blue-500 peer-checked:bg-blue-500 group-hover:scale-105'></span>
            </label>
          </td>
        ))}
      </tr>
    );
  };
  return (
    <div className='p-4 mt-0 bg-white m-4 rounded-lg flex-1'>
      {/* TOP */}
      <div className='flex items-center justify-between'>
        <h1 className='hidden md:block text-lg font-semibold'>Attendance</h1>
        <div className='flex flex-col md:flex-row items-center gap-4 w-full md:w-auto'>
          <label className='font-medium'>Select Grade:</label>
          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            className='border px-2 py-1 rounded'
          >
            <option value='5th'>5th</option>
            <option value='6th'>6th</option>
            <option value='7th'>7th</option>
          </select>
          {/* DatePicker */}
          <DatePicker
            showIcon
            toggleCalendarOnIconClick
            icon={<SearchBoldIcon />}
            locale='en-GB'
            selected={memoizedDate}
            onChange={(date) => date && setSelectedDate(date)}
            showMonthDropdown
            className='px-2 border rounded-lg ring-gray-300 hidden md:inline-block'
            popperClassName='datepicker-popup'
            portalId='root'
            dateFormat='dd/MM/yyyy'
          />
          <div className='flex items-center gap-4'>
            <button className='w-8 h-8 flex items-center justify-center rounded-full bg-primary-redLight_fade'>
              <img src='/search_bold.png' alt='' width={14} height={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Bảng điểm danh */}
      <div className='overflow-x-auto'>
        <Table columns={columns} data={students} renderRow={renderRow} />
      </div>
      {/* Phân trang */}
      <Pagination />
    </div>
  );
};

export default AttendancePage;
