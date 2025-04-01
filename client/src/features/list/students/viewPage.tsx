import Announcements from '@components/admin/Announcements';
import { useState, useMemo, useEffect } from 'react';
import FormModal from '@components/common/FormModal';
import { View, dateFnsLocalizer } from 'react-big-calendar';
import { Link, useParams } from 'react-router-dom';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import BigCalendar from '@components/common/calendar/BigCalendar';
import { ExtendedEvent, Student } from '@interfaces';
import useFetchSchedules from 'hooks/useFetchSchedules';
import { useAuth } from 'hooks/useAuth';
import { decodeToken } from '@utils/decodeToken ';

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

// *Helper: Tạo đối tượng Date từ base date và chuỗi thời gian (hh:mm)
const createEventDate = (base: Date, timeStr: string): Date => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const date = new Date(base);
  date.setHours(hours, minutes);
  return date;
};

const generateRecurringEvents = (schedule: any): ExtendedEvent[] => {
  const events: ExtendedEvent[] = [];
  const startDate = new Date(schedule.startDate);
  const endDate = new Date(schedule.endDate);

  // Trường hợp exam: chỉ tạo 1 event dựa trên startDate
  if (schedule.type === 'exam') {
    const eventStart = createEventDate(
      new Date(schedule.startDate),
      schedule.startTime
    );
    const eventEnd = createEventDate(
      new Date(schedule.startDate),
      schedule.endTime
    );
    return [{ ...schedule, start: eventStart, end: eventEnd }];
  }

  // Các event lặp theo daysOfWeek: chuyển chuỗi thành mảng số
  const daysOfWeek = schedule.daysOfWeek?.split(',').map(Number) || [];
  let currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    // Chuyển JS day (0-6, CN-Sat) thành 1-7, với thứ 2 = 1
    const dayJs = ((currentDate.getDay() + 6) % 7) + 1;
    if (daysOfWeek.includes(dayJs)) {
      const eventStart = createEventDate(currentDate, schedule.startTime);
      const eventEnd = createEventDate(currentDate, schedule.endTime);
      events.push({ ...schedule, start: eventStart, end: eventEnd });
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return events;
};

const SingleStudentPage = () => {
  const { id } = useParams();
  const [reloadTrigger] = useState(0);

  const { token } = useAuth();
  const decodedToken = decodeToken(token);
  const role = decodedToken?.role;

  const [student, setStudent] = useState<Student | null>(null);
  const [studentClass, setStudentClass] = useState<any>(null);
  const [classSchedule, setClassSchedule] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const { schedules } = useFetchSchedules(reloadTrigger);

  const [events, setEvents] = useState<ExtendedEvent[]>([]);

  const [setView] = useState<View>('week');

  const normalizeEvent = (eventObj: any): ExtendedEvent => {
    const startDatePart = eventObj.startDate.split('T')[0];
    const endDatePart = eventObj.endDate.split('T')[0];
    return {
      id: eventObj.id,
      title: eventObj.class.className,
      start: eventObj.start,
      end: eventObj.end,
      resource: eventObj.room,
      data: {
        id: eventObj.id,
        classID: eventObj.class.classID,
        className: eventObj.class.className,
        type: eventObj.type,
        repeatRule: eventObj.repeatRule,
        daysOfWeek: eventObj.daysOfWeek,
        startDate: startDatePart,
        endDate: endDatePart,
        startTime: eventObj.startTime,
        endTime: eventObj.endTime,
        room: eventObj.room,
        teacher: eventObj.teacher?.teacherName || '',
        course: eventObj.course?.courseName || 'N/A',
      },
    };
  };

  const normalizedEvents = useMemo(() => events.map(normalizeEvent), [events]);

  const filteredEvents = useMemo(() => {
    if (studentClass === 'all') return normalizedEvents;
    return normalizedEvents.filter(
      (event) => event.data?.className === studentClass
    );
  }, [studentClass, normalizedEvents]);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await fetch(`/student/${id}`);

        // Thử parse JSON
        const data = await res.json();

        setStudent(data);
        setStudentClass(data.className);

        const classScheduleData = schedules.filter(
          (event) => event.class.className === data.className
        );

        setClassSchedule(classScheduleData);
      } catch (error) {
        console.error('Lỗi khi fetch teacher:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [id, schedules]);

  // *Khi schedules thay đổi, tạo các event bằng cách "flatMap" qua generateRecurringEvents
  useEffect(() => {
    if (schedules) {
      setEvents(schedules.flatMap(generateRecurringEvents));
    }
  }, [schedules, reloadTrigger]);

  if (loading) return <p>Đang tải...</p>;
  if (!student) return <p>Không tìm thấy sinh viên</p>;
  console.log(classSchedule);

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
                <h1 className='text-xl font-semibold'>
                  {student.totalAbsences}
                </h1>
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
                <h1 className='text-xl font-semibold truncate w-32'>
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
        <div className='mt-4 bg-white rounded-md p-4 h-[650px] overflow-auto'>
          <h1>Student&apos;s Schedule</h1>
          <div className='calendar-wrapper '>
            <BigCalendar
              events={filteredEvents}
              view='week'
              setView={setView}
              localizer={localizer}
              filteredEvents={filteredEvents}
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
          </div>
        </div>
        {/* <PerformanceChart /> */}
        <Announcements />
      </div>
    </div>
  );
};

export default SingleStudentPage;
