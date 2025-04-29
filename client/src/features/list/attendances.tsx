import { useState, useMemo } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import { useTranslation } from 'react-i18next';
import Pagination from '@components/common/Pagination';
import Table from '@components/common/table/Table';
import { enGB } from 'date-fns/locale/en-GB';
import { vi } from 'date-fns/locale/vi';
import usePagination from 'hooks/usePagination';
import useFetchAttendances from 'hooks/useFetchAttendance';
import FormModal from '@components/common/FormModal';
import useFetchCurrentTeacher from 'hooks/useFetchCurrentTeacher';
import { toast } from 'react-toastify';
import { useAuth } from 'hooks/useAuth';
import { decodeToken } from '@utils/decodeToken ';

// const role = 'admin';

registerLocale('en-GB', enGB);
registerLocale('vi', vi);

// Tách cấu hình columns
const columnsAdmin = (t: any) => [
  {
    header: t('table.attendances.header.NO'),
    accessor: 'stt',
  },
  {
    header: t('table.attendances.header.name'),
    accessor: 'name',
  },
  {
    header: t('table.attendances.header.class'),
    accessor: 'class',
  },
  {
    header: t('table.attendances.header.absences'),
    accessor: 'absences',
  },
  {
    header: t('table.attendances.header.totalChecking'),
    accessor: 'totalChecking',
  },
  {
    header: t('table.attendances.header.actions'),
    accessor: 'action',
  },
];

const columnsTeacher = [
  { header: 'STT', accessor: 'stt' },
  {
    header: 'Student Name',
    accessor: 'name',
  },
  { header: 'ID Student', accessor: 'id' },

  { header: 'Birth', accessor: 'birth' },
  {
    header: 'Checked',
    accessor: 'checked',
  },
  { header: 'Note', accessor: 'note' },
];

const AttendancePage = () => {
  const { t } = useTranslation();
  const { token } = useAuth();
  const decodedToken = decodeToken(token);
  const role = decodedToken?.role;

  // ! TEEACHER LOGIN DEMO
  const { teacher } = useFetchCurrentTeacher(role);
  // const [role, setRole] = useState('teacher');

  const [selectedTeacher, setSelectedTeacher] = useState<string>('All');
  const [selectedClass, setSelectedClass] = useState<string>('All');
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const [reloadTrigger, setReloadTrigger] = useState(0); // Triggers a re-render when data is updated

  const { attendances, loading, error } = useFetchAttendances(
    role,
    reloadTrigger
  );

  // **🔥 State để lưu attendance đã chỉnh sửa**
  const [updatedAttendances, setUpdatedAttendances] = useState<{
    [key: string]: boolean[];
  }>({});
  const [updatedNotes, setUpdatedNotes] = useState<{ [key: string]: string }>(
    {}
  );

  const handleCheckboxChange = (
    studentID: number,
    currentStatus: boolean | null
  ) => {
    const newStatus = currentStatus === null ? true : !currentStatus;
    setUpdatedAttendances((prev) => ({
      ...prev,
      [studentID]: [newStatus],
    }));
  };

  const handleNoteChange = (studentID: number, value: string) => {
    setUpdatedNotes((prev) => {
      const updated = { ...prev, [studentID]: value };

      setUpdatedAttendances((prevAttendances) => ({
        ...prevAttendances,
        [studentID]: [false], // Gửi status false cho những student chưa checked
      }));

      return updated;
    });
  };

  const handleSubmitAttendance = async () => {
    try {
      await Promise.all(
        Object.entries(updatedAttendances).map(async ([studentID, status]) => {
          if (status !== null) {
            await fetch('/attendance/edit', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                studentID,
                status,
                note: updatedNotes[studentID] || '',
              }),
            });
          }
        })
      );
      toast.success('Điểm danh thành công');
      setReloadTrigger((prev) => prev + 1);
    } catch (error) {
      toast.error('Lỗi: ' + error);
    }
  };

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };

  //* Lọc danh sách theo class và teacher
  const filteredAttendancesAdmin = useMemo(() => {
    const studentMap = new Map();
    attendances.forEach((item) => {
      if (!studentMap.has(item.student.studentID)) {
        studentMap.set(item.student.studentID, item);
      }
    });

    const filtered = Array.from(studentMap.values()).filter((item) => {
      const classMatch =
        selectedClass === 'All' ||
        item.class.classID.toString() === selectedClass; // Ensure both are strings for comparison
      const teacherMatch =
        selectedTeacher === 'All' ||
        item.teacher.teacherName === selectedTeacher; // Lọc theo teacher nếu có

      return classMatch && teacherMatch;
    });

    return filtered;
  }, [attendances, selectedClass, selectedTeacher]);

  // **🔥 Lọc danh sách attendance cho teacher đăng nhập**
  const filteredAttendancesTeacher = useMemo(() => {
    return attendances.filter((item) => {
      if (!teacher) return false; // Nếu chưa có teacher, không hiển thị dữ liệu
      const teacherMatch = item.teacher.teacherID === teacher.teacherID;
      const classMatch =
        selectedClass === 'All' ||
        item.class.classID.toString() === selectedClass;
      const dateMatch =
        !selectedDate ||
        new Date(item.checkInTime).toDateString() ===
          selectedDate.toDateString();
      return teacherMatch && classMatch && dateMatch;
    });
  }, [attendances, teacher, selectedClass, selectedDate]);

  // **🔥 Lọc danh sách lớp cho admin**
  const classOptionsAdmin = useMemo(() => {
    const classMap = new Map();
    attendances.forEach((item) => {
      if (!classMap.has(item.class.classID)) {
        classMap.set(item.class.classID, {
          className: item.class.className,
          classID: item.class.classID,
        });
      }
    });
    return Array.from(classMap.values());
  }, [attendances]);

  // **🔥 Lọc danh sách lớp cho teacher đăng nhập**
  const classOptionsTeacher = useMemo(() => {
    if (!teacher) return [];
    const classMap = new Map();
    attendances
      .filter((item) => item.teacher.teacherID === teacher.teacherID)
      .forEach((item) => {
        if (!classMap.has(item.class.classID)) {
          classMap.set(item.class.classID, {
            className: item.class.className,
            classID: item.class.classID,
          });
        }
      });
    return Array.from(classMap.values());
  }, [attendances, teacher]);

  //! RENDER ROW ADMIN
  const renderRowAdmin = (item: any, index: number) => {
    const absences = attendances
      .filter((a) => a.student.studentID === item.student.studentID)
      .filter((a) => a.status === false).length;

    return (
      <tr
        key={`admin-${item.student.studentID}-${index}`}
        className='border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-secondary-lavenderFade'
      >
        <td className='p-4'>{(currentPage - 1) * 10 + index + 1}</td>
        <td className='p-4'>{item.student.studentName}</td>
        <td className=' '>{item.class.className}</td>
        <td className='p-4 '>{absences} class</td>
        <td className='p-4 '>{item.totalCheckins}</td>
        <td className=' '>
          <FormModal
            table='attendances'
            type='list'
            id={item.student.studentID}
          />
        </td>
      </tr>
    );
  };

  //! RENDER ROW TEACHER
  const renderRowTeacher = (item: any, index: number) => {
    const latestStatus =
      updatedAttendances[item.student.studentID]?.[0] ?? item.status ?? null;

    return (
      <tr
        key={`teacher-${item.student.studentID}-${index}`}
        className='border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-secondary-lavender_fade'
      >
        <td className='p-4'>{(currentPage - 1) * 10 + index + 1}</td>
        <td className='p-4'>{item.student.studentName}</td>
        <td className='p-4'>{item.student.studentID}</td>
        <td className='p-4'>{item.student.dateOfBirth}</td>
        <td className='p-4'>
          <input
            type='checkbox'
            className='w-5 h-5'
            checked={latestStatus === true}
            onChange={() =>
              handleCheckboxChange(item.student.studentID, latestStatus)
            }
          />
        </td>
        <td className='p-4'>
          <input
            key={`note-${item.student.studentID}`}
            type='text'
            className=' p-2 border rounded-md'
            value={updatedNotes[item.student.studentID] ?? item.note}
            onChange={(e) =>
              handleNoteChange(item.student.studentID, e.target.value)
            }
          />
        </td>
      </tr>
    );
  };

  const { currentData, currentPage, totalPages, setCurrentPage } =
    usePagination(
      role === 'admin' ? filteredAttendancesAdmin : filteredAttendancesTeacher,
      10
    );

  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p>Lỗi: {error}</p>;

  return (
    <div className='p-4 mt-0 bg-white m-4 rounded-lg flex-1'>
      <div className='flex items-center justify-between'>
        <h1 className='hidden md:block text-lg font-semibold'>
          {t('table.attendances.title')}
          {role === 'teacher' && `- ${teacher?.teacherName}`}
        </h1>
        <div className='flex flex-col md:flex-row items-center gap-4 w-full md:w-auto'>
          {/* <button
            className={`w-full text-sm text-gray-500 hover:text-gray-700`}
            onClick={() =>
              setRole((prevRole) =>
                prevRole === 'admin' ? 'teacher' : 'admin'
              )
            }
          >
            {role}
          </button> */}
          {role === 'admin' && (
            <>
              <select
                className='border rounded-md p-2'
                value={selectedTeacher}
                onChange={(e) => setSelectedTeacher(e.target.value)}
              >
                <option value='All'>{t('filters.teachers.all')}</option>
                {Array.from(
                  new Set(
                    attendances.map((item: any) => item.teacher.teacherName)
                  )
                ).map((teacherName) => (
                  <option key={teacherName} value={teacherName}>
                    {teacherName}
                  </option>
                ))}
              </select>
            </>
          )}
          <select
            className='border rounded-md p-2'
            value={selectedClass}
            onChange={(e) => {
              setSelectedClass(e.target.value);
            }}
          >
            <option value='All'>{t('filters.classes.all')}</option>
            {role === 'admin' &&
              classOptionsAdmin.map((classOption) => (
                <option key={classOption.classID} value={classOption.classID}>
                  {classOption.className}
                </option>
              ))}
            {role === 'teacher' &&
              classOptionsTeacher.map((classOption) => (
                <option key={classOption.classID} value={classOption.classID}>
                  {classOption.className}
                </option>
              ))}
          </select>
          {role === 'teacher' && (
            <DatePicker
              readOnly
              disabled
              todayButton='TODAY'
              selected={selectedDate}
              onChange={handleDateChange}
              className='border rounded-md p-2'
              placeholderText='Select a date (m/d/yyyy)'
            />
          )}

          {role === 'teacher' && (
            <button
              className='border rounded-md p-2 bg-blue-500 text-white'
              onClick={handleSubmitAttendance}
            >
              Submit
            </button>
          )}
        </div>
      </div>
      <div className='overflow-x-auto'>
        <Table
          columns={role === 'admin' ? columnsAdmin(t) : columnsTeacher}
          data={currentData}
          renderRow={(item, index) =>
            role === 'admin'
              ? renderRowAdmin(item, index)
              : renderRowTeacher(item, index)
          }
        />
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
