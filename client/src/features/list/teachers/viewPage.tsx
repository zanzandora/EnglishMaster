import Announcements from '@components/admin/Announcements';
import { useState, useMemo, useEffect } from 'react';
import FormModal from '@components/common/FormModal';
import { View, dateFnsLocalizer } from 'react-big-calendar';
import { Link, useParams } from 'react-router-dom';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import BigCalendar from '@components/common/calendar/BigCalendar';
import 'react-tooltip/dist/react-tooltip.css';
import { Tooltip } from 'react-tooltip';
import { ExtendedEvent, Teacher } from '@interfaces';
import useFetchSchedules from 'hooks/useFetchSchedules';
import { decodeToken } from '@utils/decodeToken ';
import { useAuth } from 'hooks/useAuth';
import { formatDate } from '@utils/dateUtils';
import { useTranslation } from 'react-i18next';

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

const SingleTeacherPage = () => {
  const { t } = useTranslation();
  const { userID } = useParams();
  const [reloadTrigger, setReloadTrigger] = useState(0);

  const { token } = useAuth();
  const decodedToken = decodeToken(token);
  const role = decodedToken?.role;

  const [view, setView] = useState<View>('week');
  const [teacherClass, setTeacherClass] = useState<string>('null');

  const { schedules } = useFetchSchedules(reloadTrigger);

  const [teacher, setTeacehr] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState(true);

  const [events, setEvents] = useState<ExtendedEvent[]>([]);

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
    return normalizedEvents.filter((event) =>
      teacherClass.includes(event.data?.className)
    );
  }, [teacherClass, normalizedEvents]);

  // *Lọc các sự kiện trong tuần này
  const getEventsThisWeek = (events: any) => {
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 1));
    startOfWeek.setHours(0, 0, 0, 0); // Set to the beginning of the day
    const endOfWeek = new Date(startOfWeek.getTime() + 6 * 24 * 60 * 60 * 1000);
    endOfWeek.setHours(23, 59, 59, 999); // Set to the end of the day

    return events.filter(
      (event: any) => event.start >= startOfWeek && event.start <= endOfWeek
    );
  };

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const res = await fetch(`/teacher/${userID}`);

        const data = await res.json();

        if (!res.ok) throw new Error(data.error || 'Lỗi không xác định');

        setTeacehr(data);
        setTeacherClass(data?.classNames);
      } catch (error) {
        console.error('Lỗi khi fetch teacher:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeacher();
  }, [userID, reloadTrigger]);

  const handleSuccess = () => {
    setReloadTrigger((prev) => prev + 1); // Gọi lại danh sách sau khi xóa
  };

  // *Khi schedules thay đổi, tạo các event bằng cách "flatMap" qua generateRecurringEvents
  useEffect(() => {
    if (schedules) {
      setEvents(schedules.flatMap(generateRecurringEvents));
    }
  }, [schedules, reloadTrigger]);

  if (loading) return <p>Đang tải...</p>;

  if (!teacher) return <p>Không tìm thấy giáo viên</p>;

  return (
    <div className='flex-1 p-4 flex flex-col gap-4 xl:flex-row'>
      {/* LEFT */}
      <div className='w-full xl:w-2/3'>
        {/* TOP */}
        <div className='flex flex-col lg:flex-row gap-4'>
          {/* USER INFO CARD */}
          <div className='bg-secondary-blueLight py-6 px-4 rounded-md flex-1 flex gap-4 relative'>
            {/* <Link
              to='/teachers'
              className='absolute top-2 right-3 cursor-pointer'
            >
              <img src='/moreDark.png' alt='' width={20} height={20} />
            </Link> */}
            <div className='w-1/3'>
              <img
                src={teacher.photo || '/avatar.png'}
                alt='Avatar'
                width={144}
                height={144}
                className='w-36 h-36 rounded-full object-cover'
              />
            </div>
            <div className='w-2/3 flex flex-col justify-between gap-4'>
              <div className='flex items-center gap-4'>
                <h1 className='text-xl font-semibold'>{teacher.name}</h1>
                {role === 'admin' && (
                  <FormModal
                    table='teacher'
                    type='update'
                    data={{
                      username: teacher.username,
                      password: teacher.password,
                      email: teacher.email,
                      name: teacher.name,
                      phoneNumber: teacher.phoneNumber,
                      address: teacher.address,
                      dateOfBirth: formatDate(teacher.dateOfBirth),
                      gender: teacher.gender,
                      photo: teacher.photo,
                      experience: teacher.experience,
                      specialization: teacher.specialization,
                    }}
                    onSuccess={handleSuccess}
                  />
                )}
              </div>
              <div className='flex justify-between gap-2 flex-wrap text-xs font-medium flex-col text-gray-700'>
                <div className='w-full md:w-1/3 lg:w-full flex items-center gap-2'>
                  <img src='/date.png' alt='' width={14} height={14} />
                  {t('profile.code')}:
                  <span className=' truncate'>{teacher.userID}</span>
                </div>
                <div className='w-full md:w-1/3 lg:w-full flex items-center gap-2'>
                  <img src='/date.png' alt='' width={14} height={14} />
                  {t('profile.userName')}:
                  <span className=' truncate'>{teacher.username}</span>
                </div>
                <div className='w-full md:w-1/3 lg:w-full flex items-center gap-2 '>
                  <img src='/mail.png' alt='' width={14} height={14} />
                  Email:
                  <span className=' truncate hover:underline cursor-pointer'>
                    {teacher.email}
                  </span>
                </div>
                <div className='w-full md:w-1/3 lg:w-full flex items-center gap-2'>
                  <img src='/phone.png' alt='' width={14} height={14} />
                  {t('profile.phone')}:<span> {teacher.phoneNumber}</span>
                </div>
                <div className='w-full md:w-1/3 lg:w-full flex items-center gap-2 '>
                  <img src='/address.png' alt='' width={14} height={14} />
                  {t('profile.address')}:
                  <span className=' truncate '>{teacher.address}</span>
                </div>
                <div className='w-full md:w-1/3 lg:w-full flex items-center gap-2'>
                  <img src='/date.png' alt='' width={14} height={14} />
                  {t('profile.birth')}:
                  <span>
                    {teacher.dateOfBirth
                      ? teacher.dateOfBirth.split('T')[0]
                      : 'N/A'}
                  </span>
                </div>
                <div className='w-full md:w-1/3 lg:w-full flex items-center gap-2 '>
                  <img src='/mail.png' alt='' width={14} height={14} />
                  {t('profile.gender')}:
                  <span className=' truncate '>{teacher.gender}</span>
                </div>

                <div className='w-full mt-3 md:w-1/3 lg:w-full flex items-center gap-2 '>
                  <img src='/certificate.png' alt='' width={14} height={14} />
                  {t('profile.teacher.experience')}:
                  <span className=' truncate '>{teacher.experience}</span>
                </div>
                <div className='w-full md:w-1/3 lg:w-full flex items-center gap-2 '>
                  <img src='/star.png' alt='' width={14} height={14} />
                  {t('profile.teacher.specialization')}:
                  <span className=' truncate '>{teacher.specialization}</span>
                </div>
              </div>
            </div>
          </div>
          {/* SMALL CARDS */}
          <div className='flex-1 flex gap-4 justify-between flex-wrap flex-rơw'>
            {/* CARD */}
            <div
              data-tooltip-id={`event-tooltip-2`}
              className='bg-white  p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]'
            >
              <img
                src='/singlecourse.png'
                alt=''
                width={24}
                height={24}
                className='w-6 h-6'
              />
              <div className=''>
                <h1 className='text-3xl font-semibold'>
                  {teacher.totalCourses}
                </h1>
                <span className='text-sm text-gray-400'>
                  {t('card.label.courses')}
                </span>
              </div>
            </div>

            {/* CARD */}
            <div className='bg-white  p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]'>
              <img
                src='/singleCalendar.png'
                alt=''
                width={24}
                height={24}
                className='w-6 h-6'
              />
              <div className=''>
                <h1 className='text-3xl font-semibold'>
                  {getEventsThisWeek(filteredEvents).length}
                </h1>
                <span className='text-sm text-gray-400'>
                  {t('card.label.classThisWeek')}
                </span>
              </div>
            </div>

            {/* CARD */}
            <div
              data-tooltip-id={`event-tooltip-4`}
              className='bg-white p-4  rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]'
            >
              <img
                src='/singleClass.png'
                alt=''
                width={24}
                height={24}
                className='w-6 h-6'
              />
              <div className=''>
                <h1 className='text-3xl font-semibold'>
                  {teacher.totalClasses}
                </h1>
                <span className='text-sm text-gray-400'>
                  {t('card.label.classes')}
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* BOTTOM */}
        <div className='mt-4 bg-white rounded-md p-4 h-[750px] overflow-auto'>
          <h1>{t('orther.label.teacherSchedule')}</h1>
          <div className='calendar-wrapper'>
            <BigCalendar
              events={filteredEvents}
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
          <h1 className='text-xl font-semibold'>{t('shortcuts.title')}</h1>
          <div className='mt-4 flex gap-4 flex-wrap text-sm text-gray-500 '>
            <Link
              className='p-3 rounded-md bg-secondary-blueLight'
              to={`/admin/list/classes/${teacher.userID}`}
            >
              {t('shortcuts.classesStudents')}
            </Link>

            <Link
              className='p-3 rounded-md bg-secondary-lavenderLight'
              to={`/admin/list/exams/${teacher.userID}`}
            >
              {t('shortcuts.exams')}
            </Link>
          </div>
        </div>
        {/* <PerformanceChart /> */}
        <Announcements />
      </div>
      {/* Tooltip hiển thị chi tiết */}
      <Tooltip
        id={`event-tooltip-2`}
        place='top'
        variant='dark'
        className='z-50'
        render={() => (
          <div>
            {teacher.courseNames.length > 0 ? (
              teacher.courseNames.map((courseName: string, index: number) => (
                <p key={index} className='text-xs'>
                  {courseName}
                </p>
              ))
            ) : (
              <p className='text-xs'>No courses assigned</p>
            )}
          </div>
        )}
      />
      <Tooltip
        id={`event-tooltip-4`}
        place='top'
        variant='dark'
        className='z-50'
        render={() => (
          <div>
            {teacher.classNames.length > 0 ? (
              teacher.classNames.map((className: string, index: number) => (
                <p key={index} className='text-xs'>
                  {className}
                </p>
              ))
            ) : (
              <p className='text-xs'>No classes assigned</p>
            )}
          </div>
        )}
      />
    </div>
  );
};

export default SingleTeacherPage;
