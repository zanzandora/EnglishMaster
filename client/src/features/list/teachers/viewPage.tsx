import Announcements from '@components/admin/Announcements';
import PerformanceChart from '@components/admin/charts/PerformanceChart';
import { useState, useMemo } from 'react';
import FormModal from '@components/common/FormModal';
import { role, calendarEvents } from '@mockData/data';
import { View, dateFnsLocalizer } from 'react-big-calendar';
import { Link } from 'react-router-dom';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import BigCalendar from '@components/common/calendar/BigCalendar';

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

const SingleTeacherPage = () => {
  // const { id } = useParams();
  const [view, setView] = useState<View>('week');
  const [selectedClass, setSelectedClass] = useState<string>('all');

  // Room Resources cho Calendar
  const resourcesRooms = [
    { id: 'room101', title: 'Phòng 101', type: 'room' },
    { id: 'room102', title: 'Phòng 102', type: 'room' },
    { id: 'room103', title: 'Phòng 103', type: 'room' },
  ];

  // Chuẩn hóa dữ liệu sự kiện
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

  return (
    <div className='flex-1 p-4 flex flex-col gap-4 xl:flex-row'>
      {/* LEFT */}
      <div className='w-full xl:w-2/3'>
        {/* TOP */}
        <div className='flex flex-col lg:flex-row gap-4'>
          {/* USER INFO CARD */}
          <div className='bg-secondary-blueLight py-6 px-4 rounded-md flex-1 flex gap-4'>
            <div className='w-2/3 flex flex-col justify-between gap-4'>
              <div className='flex items-center gap-4'>
                <h1 className='text-xl font-semibold'>Leonard Snyder</h1>
                {role === 'admin' && (
                  <FormModal
                    table='teacher'
                    type='update'
                    data={{
                      id: 1,
                      username: 'deanguerrero',
                      email: 'deanguerrero@gmail.com',
                      password: 'password',
                      firstName: 'Dean',
                      lastName: 'Guerrero',
                      phone: '+1 234 567 89',
                      address: '1234 Main St, Anytown, USA',
                      bloodType: 'A+',
                      dateOfBirth: '2000-01-01',
                      sex: 'male',
                      img: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=1200',
                    }}
                  />
                )}
              </div>

              <div className='flex justify-between gap-2 flex-wrap text-xs font-medium flex-col text-gray-700'>
                <div className='w-full md:w-1/3 lg:w-full flex items-center gap-2'>
                  <img
                    src='/specialization.png'
                    alt=''
                    width={14}
                    height={14}
                  />

                  <span>Specialization: Toeic</span>
                </div>
                <div className='w-full md:w-1/3 lg:w-full flex items-center gap-2'>
                  <img src='/experience.png' alt='' width={14} height={14} />

                  <span>Experience: 5 years</span>
                </div>
                <div className='w-full md:w-1/3 lg:w-full flex items-center gap-2'>
                  <img src='/date.png' alt='' width={14} height={14} />
                  <span>Birth: 2/2/2003</span>
                </div>
                <div className='w-full md:w-1/3 lg:w-full flex items-center gap-2 '>
                  <img src='/mail.png' alt='' width={14} height={14} />
                  <span className=' truncate'>
                    Email: maiminhtu130803@gmail.com
                  </span>
                </div>
                <div className='w-full md:w-1/3 lg:w-full flex items-center gap-2'>
                  <img src='/phone.png' alt='' width={14} height={14} />
                  <span>Phone: 0123456789</span>
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
                <h1 className='text-xl font-semibold'>90%</h1>
                <span className='text-sm text-gray-400'>Attendance</span>
              </div>
            </div>
            {/* CARD */}
            <div className='bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]'>
              <img
                src='/singleBranch.png'
                alt=''
                width={24}
                height={24}
                className='w-6 h-6'
              />
              <div className=''>
                <h1 className='text-xl font-semibold'>2</h1>
                <span className='text-sm text-gray-400'>Branches</span>
              </div>
            </div>
            {/* CARD */}
            <div className='bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]'>
              <img
                src='/singleLesson.png'
                alt=''
                width={24}
                height={24}
                className='w-6 h-6'
              />
              <div className=''>
                <h1 className='text-xl font-semibold'>6</h1>
                <span className='text-sm text-gray-400'>Lessons</span>
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
                <h1 className='text-xl font-semibold'>6</h1>
                <span className='text-sm text-gray-400'>Classes</span>
              </div>
            </div>
          </div>
        </div>
        {/* BOTTOM */}
        <div className='mt-4 bg-white rounded-md p-4 h-[800px]'>
          <h1>Teacher&apos;s Schedule</h1>
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
              Teacher&apos;s Classes
            </Link>
            <Link className='p-3 rounded-md bg-secondary-lavenderFade' to='/'>
              Teacher&apos;s Students
            </Link>
            <Link className='p-3 rounded-md bg-secondary-lavenderFade' to='/'>
              Teacher&apos;s Lessons
            </Link>
            <Link className='p-3 rounded-md bg-secondary-lavenderLight' to='/'>
              Teacher&apos;s Exams
            </Link>
            <Link className='p-3 rounded-md bg-secondary-blueLight' to='/'>
              Teacher&apos;s Assignments
            </Link>
          </div>
        </div>
        {/* <PerformanceChart /> */}
        <Announcements />
      </div>
    </div>
  );
};

export default SingleTeacherPage;
