import { useState } from 'react';

const students = [
  { id: 1, name: 'Rahul S', attendance: Array(15).fill(false) },
  { id: 2, name: 'Harry Potter', attendance: Array(15).fill(false) },
  { id: 3, name: 'Jhon C', attendance: Array(15).fill(false) },
  { id: 4, name: 'Emma Watson', attendance: Array(15).fill(false) },
  { id: 5, name: 'Jackson W', attendance: Array(15).fill(false) },
];

const AttendancePage = () => {
  const [selectedMonth, setSelectedMonth] = useState('2024-05');
  const [selectedGrade, setSelectedGrade] = useState('5th');
  const [attendanceData, setAttendanceData] = useState(students);

  const handleCheckboxChange = (studentIndex, dayIndex) => {
    const newAttendance = [...attendanceData];
    newAttendance[studentIndex].attendance[dayIndex] =
      !newAttendance[studentIndex].attendance[dayIndex];
    setAttendanceData(newAttendance);
  };

  return (
    <div className='p-6 space-y-6 bg-white m-4 rounded-lg'>
      <h1 className='text-2xl font-bold'>Attendance</h1>

      {/* Bộ lọc */}
      <div className='flex items-center gap-4'>
        <div className='flex items-center gap-2'>
          <label className='font-medium'>Select Month:</label>
          <input
            type='month'
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className='border p-2 rounded'
          />
        </div>

        <div className='flex items-center gap-2'>
          <label className='font-medium'>Select Grade:</label>
          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            className='border p-2 rounded'
          >
            <option value='5th'>5th</option>
            <option value='6th'>6th</option>
            <option value='7th'>7th</option>
          </select>
        </div>

        <button className='bg-blue-500 text-white px-4 py-2 rounded'>
          Search
        </button>
      </div>

      {/* Bảng điểm danh */}
      <div className='overflow-auto'>
        <table className='min-w-full border-collapse border border-gray-300'>
          <thead>
            <tr className='bg-gray-100'>
              <th className='border p-2 w-16'>Student ID</th>
              <th className='border p-2 w-48'>Name</th>
              {Array.from({ length: 15 }, (_, i) => (
                <th key={i} className='border p-2 text-center'>
                  {i + 1}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {attendanceData.map((student, studentIndex) => (
              <tr key={student.id} className='border-b'>
                <td className='border p-2 text-center'>{student.id}</td>
                <td className='border p-2'>{student.name}</td>
                {student.attendance.map((attended, dayIndex) => (
                  <td key={dayIndex} className='border p-2 text-center'>
                    <input
                      type='checkbox'
                      checked={attended}
                      onChange={() =>
                        handleCheckboxChange(studentIndex, dayIndex)
                      }
                      className='w-5 h-5'
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendancePage;
