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
import 'react-tooltip/dist/react-tooltip.css';
import { Tooltip } from 'react-tooltip';

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
          <div className='bg-secondary-blueLight py-6 px-4 rounded-md flex-1 flex gap-4 relative'>
            {/* <Link
              to='/teachers'
              className='absolute top-2 right-3 cursor-pointer'
            >
              <img src='/moreDark.png' alt='' width={20} height={20} />
            </Link> */}
            <div className='w-1/3'>
              <img
                src={'/avatar.png'}
                alt='Avatar'
                width={144}
                height={144}
                className='w-36 h-36 rounded-full object-cover'
              />
            </div>
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
                  <img src='/date.png' alt='' width={14} height={14} />
                  Id:
                  <span className=' truncate'>
                    0a746990-6cf2-45e6-973c-d59dc33e240f
                  </span>
                </div>
                <div className='w-full md:w-1/3 lg:w-full flex items-center gap-2 '>
                  <img src='/mail.png' alt='' width={14} height={14} />
                  Email:
                  <span className=' truncate hover:underline cursor-pointer'>
                    maiminhtu130803@gmail.com
                  </span>
                </div>
                <div className='w-full md:w-1/3 lg:w-full flex items-center gap-2'>
                  <img src='/phone.png' alt='' width={14} height={14} />
                  Phone:
                  <span> 0123456789</span>
                </div>
                <div className='w-full md:w-1/3 lg:w-full flex items-center gap-2 '>
                  <img src='/address.png' alt='' width={14} height={14} />
                  Address:
                  <span className=' truncate '>Hai Phong</span>
                </div>
                <div className='w-full md:w-1/3 lg:w-full flex items-center gap-2'>
                  <img src='/date.png' alt='' width={14} height={14} />
                  Birth:
                  <span>2/2/2003</span>
                </div>
                <div className='w-full md:w-1/3 lg:w-full flex items-center gap-2 '>
                  <img src='/mail.png' alt='' width={14} height={14} />
                  Gender:
                  <span className=' truncate '>Male</span>
                </div>

                <div className='w-full mt-3 md:w-1/3 lg:w-full flex items-center gap-2 '>
                  <img src='/certificate.png' alt='' width={14} height={14} />
                  Qualification:
                  <span className=' truncate '>TEFL-I, TEFL-II</span>
                </div>
                <div className='w-full md:w-1/3 lg:w-full flex items-center gap-2 '>
                  <img src='/star.png' alt='' width={14} height={14} />
                  Specialization:
                  <span className=' truncate '>Toeic</span>
                </div>
              </div>
            </div>
          </div>
          {/* SMALL CARDS */}
          <div className='flex-1 flex gap-4 justify-between flex-wrap flex-rơw'>
            {/* CARD */}
            <div className='bg-white  p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]'>
              <img
                src='/specialization.png'
                alt=''
                width={24}
                height={24}
                className='w-6 h-6'
              />
              <div className=''>
                <h1 className='text-xl font-semibold'>2 years </h1>
                <span className='text-sm text-gray-400'>Experience</span>
              </div>
            </div>
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
                <h1 className='text-xl font-semibold'>2 </h1>
                <span className='text-sm text-gray-400'>Course</span>
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
                <h1 className='text-xl font-semibold'>8 </h1>
                <span className='text-sm text-gray-400'>Classes this week</span>
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
                <h1 className='text-xl font-semibold'>3</h1>
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
      {/* Tooltip hiển thị chi tiết */}
      <Tooltip
        id={`event-tooltip-2`}
        place='top'
        variant='dark'
        className='z-50'
        render={() => (
          <div>
            <p className='text-xs'>English for Travel</p>
            <p className='text-xs'>Business English Level 1</p>
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
            <p className='text-xs'>TRVL-2</p>
            <p className='text-xs'>TOEIC-600</p>
            <p className='text-xs'>TOEIC-400</p>
          </div>
        )}
      />
    </div>
  );
};

export default SingleTeacherPage;
