import Announcements from '@components/admin/Announcements';
import { useState, useMemo, useEffect } from 'react';
import FormModal from '@components/common/FormModal';
import { role, calendarEvents } from '@mockData/data';
import { View, dateFnsLocalizer } from 'react-big-calendar';
import { Link, useParams } from 'react-router-dom';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import BigCalendar from '@components/common/calendar/BigCalendar';
import { Student } from '@interfaces';

const locales = {
  'en-US': import('date-fns/locale/en-US'),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const SingleStudentPage = () => {
  const { id } = useParams();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  const [view, setView] = useState<View>('week');
  const [selectedClass, setSelectedClass] = useState<string>('all');

  const normalizeEvent = (event: any) => {
    return {
      id: event.id ?? Date.now(),
      title: typeof event.title === 'string' ? event.title : 'No Title',
      start: event.start instanceof Date ? event.start : new Date(event.start),
      end: event.end instanceof Date ? event.end : new Date(event.end),
      resource: event.resource ?? 'Unknown',
      data: event.data || {},
    };
  };

  const normalizedEvents = useMemo(
    () => calendarEvents.map(normalizeEvent),
    []
  );

  const filteredEvents = useMemo(() => {
    if (selectedClass === 'all') return normalizedEvents;
    return normalizedEvents.filter(
      (event) => event.data?.class === selectedClass
    );
  }, [selectedClass, normalizedEvents]);
  // Chuẩn hóa dữ liệu sự kiện

  // Room Resources cho Calendar
  const resourcesRooms = [
    { id: 'room101', title: 'Phòng 101', type: 'room' },
    { id: 'room102', title: 'Phòng 102', type: 'room' },
    { id: 'room103', title: 'Phòng 103', type: 'room' },
  ];

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await fetch(`/student/${id}`);

        // Thử parse JSON
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || 'Lỗi không xác định');

        setStudent(data);
      } catch (error) {
        console.error('Lỗi khi fetch student:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [id]);

  if (loading) return <p>Đang tải...</p>;
  if (!student) return <p>Không tìm thấy sinh viên</p>;

  return (
    <div className='flex-1 p-4 flex flex-col gap-4 xl:flex-row'>
      {/* LEFT */}
      <div className='w-full xl:w-2/3'>
        {/* TOP */}
        <div className='flex flex-col lg:flex-row gap-4'>
          {/* USER INFO CARD */}
          <div className='bg-secondary-blueLight py-6 px-4 rounded-md flex-1 flex gap-4'>
            <div className='w-1/3'>
              <img
                src={student.photo ?? '/avarta.png'}
                width={144}
                height={144}
                className='w-36 h-36 rounded-full object-cover'
              />
            </div>
            <div className='w-2/3 flex flex-col justify-between gap-4'>
              <div className='flex items-center gap-4'>
                <h1 className='text-xl font-semibold'>{student.name}</h1>
                {role === 'admin' && (
                  <FormModal
                    table='student'
                    type='update'
                    id={student.id}
                    data={{
                      id: student.id,
                      email: student.email,
                      fullName: student.name,
                      phone: student.phoneNumber,
                      address: student.address,
                      dateOfBirth: student.dateOfBirth,
                      gender: student.gender,
                      img: student.photo,
                    }}
                  />
                )}
              </div>
              <div className='flex justify-between gap-2 flex-wrap text-xs font-medium flex-col text-gray-700'>
                <div className='w-full md:w-1/3 lg:w-full flex items-center gap-2'>
                  <img src='/id_badge.png' alt='' width={14} height={14} />
                  Id:
                  <span className=' truncate'>{student.id}</span>
                </div>

                <div className='w-full md:w-1/3 lg:w-full flex items-center gap-2 '>
                  <img src='/mail.png' alt='' width={14} height={14} />
                  Email:
                  <span className=' truncate'> {student.email}</span>
                </div>
                <div className='w-full md:w-1/3 lg:w-full flex items-center gap-2'>
                  <img src='/phone.png' alt='' width={14} height={14} />
                  Phone:
                  <span>{student.phoneNumber}</span>
                </div>
                <div className='w-full md:w-1/3 lg:w-full flex items-center gap-2 '>
                  <img src='/address.png' alt='' width={14} height={14} />
                  Address:
                  <span className=' truncate'>{student.address}</span>
                </div>
                <div className='w-full md:w-1/3 lg:w-full flex items-center gap-2'>
                  <img src='/date.png' alt='' width={14} height={14} />
                  Birth:
                  <span>{student.dateOfBirth.split('T')[0]}</span>
                </div>
                <div className='w-full md:w-1/3 lg:w-full flex items-center gap-2'>
                  <img src='/gender.png' alt='' width={14} height={14} />
                  Gender:
                  <span>{student.gender}</span>
                </div>
              </div>
            </div>
          </div>
          {/* SMALL CARDS */}
          <div className='flex-1 flex gap-4 justify-between flex-wrap'>
            {/* CARD */}
            <div className='bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]'>
              <img
                src='/singleAttendance.png'
                alt=''
                width={24}
                height={24}
                className='w-6 h-6'
              />
              <div className=''>
                <h1 className='text-xl font-semibold'>2</h1>
                <span className='text-sm text-gray-400'>Absent</span>
              </div>
            </div>

            {/* CARD */}
            <div className='bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]'>
              <img
                src='/singleClass.png'
                alt=''
                width={24}
                height={24}
                className='w-6 h-6'
              />
              <div className=''>
                <h1 className='text-xl font-semibold'>
                  {student.className || 'No class assigned'}
                </h1>
                <span className='text-sm text-gray-400'>Classes</span>
              </div>
            </div>

            {/* CARD */}
            <div className='bg-white p-4 rounded-md flex gap-4 w-full flex-1 md:w-[48%] xl:w-[45%] 2xl:w-[48%]'>
              <img
                src='/singlecourse.png'
                alt=''
                width={24}
                height={24}
                className='w-6 h-6'
              />
              <div className=''>
                <h1 className='text-xl font-semibold'>
                  {student.courseName || 'No course assigned'}
                </h1>
                <span className='text-sm text-gray-400'>Course</span>
              </div>
            </div>
          </div>
        </div>
        {/* BOTTOM */}
        <div className='mt-4 bg-white rounded-md p-4 h-[800px]'>
          <h1>Student&apos;s Schedule</h1>
          <div className='calendar-wrapper'>
            <BigCalendar
              events={normalizedEvents}
              resources={resourcesRooms}
              view='week'
              setView={setView}
              filteredEvents={filteredEvents}
              localizer={localizer}
            />
          </div>
        </div>
      </div>
      {/* RIGHT */}
      <div className='w-full xl:w-1/3 flex flex-col gap-4'>
        <div className='bg-white p-4 rounded-md'>
          <h1 className='text-xl font-semibold'>Shortcuts</h1>
          <div className='mt-4 flex gap-4 flex-wrap text-sm text-gray-500 '>
            <Link className='p-3 rounded-md bg-secondary-blueLight' to='/'>
              Student&apos;s Classes
            </Link>
            <Link className='p-3 rounded-md bg-secondary-lavenderFade' to='/'>
              Student&apos;s Lessons
            </Link>
            <Link className='p-3 rounded-md bg-secondary-lavenderLight' to='/'>
              Student&apos;s Exams
            </Link>
            <Link className='p-3 rounded-md bg-secondary-blueLight' to='/'>
              Student&apos;s Assignments
            </Link>
          </div>
        </div>
        {/* <PerformanceChart /> */}
        <Announcements />
      </div>
    </div>
  );
};

export default SingleStudentPage;
