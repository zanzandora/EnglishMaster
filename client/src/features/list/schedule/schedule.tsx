import { useState, useMemo } from 'react';
import { dateFnsLocalizer, Event, View } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { calendarEvents } from '@mockData/data';
import Pagination from '@components/common/Pagination';
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

interface ExtendedEvent {
  id: string | number;
  title: string; // Đảm bảo đây là string
  start: Date;
  end: Date;
  resource: string;
  data: {
    subject?: string;
    class?: string;
    room?: string;
    teacher?: string;
    type?: string; // Để xác định màu sắc
  };
}

// *Định nghĩa room resource
const resourcesRooms = [
  { id: 'room101', title: 'Room 101', type: 'room' },
  { id: 'room102', title: 'Room 102', type: 'room' },
  { id: 'room103', title: 'Room 103', type: 'room' },
];

const normalizeEvent = (event: any): ExtendedEvent => {
  return {
    id: event.id ?? Date.now(), // Nếu không có ID, tạo một ID tạm thời
    title: typeof event.title === 'string' ? event.title : 'Không có tiêu đề', // Đảm bảo là string
    start: event.start instanceof Date ? event.start : new Date(event.start), // Chuyển đổi thành Date nếu cần
    end: event.end instanceof Date ? event.end : new Date(event.end),
    resource: event.resource ?? 'Chưa xác định', // Đảm bảo có resource
    data: event.data || {}, // Đảm bảo có object data (không undefined)
  };
};

const Schedule: React.FC = () => {
  const [view, setView] = useState<View>('week');
  const [events, setEvents] = useState<Event[]>(calendarEvents);
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedRoom, setSelectedRoom] = useState<string>(
    resourcesRooms[0].id
  ); // Set initial room to the smallest room
  const normalizedEvents: ExtendedEvent[] = events.map(normalizeEvent);

  const classOptions = useMemo(() => {
    const classList = normalizedEvents
      .map((event) => event.data?.class) // Lấy ra tên lớp từ data
      .filter((className) => className) // Loại bỏ undefined
      .filter((value, index, self) => self.indexOf(value) === index); // Loại bỏ trùng lặp

    // Thêm tùy chọn "Tất cả lớp học" lên đầu
    return [
      { value: 'all', label: 'All Classes' },
      ...classList.map((className) => ({ value: className, label: className })),
    ];
  }, [normalizedEvents]);

  const roomOptions = useMemo(() => {
    return resourcesRooms.map((room) => ({
      value: room.id,
      label: room.title,
    }));
  }, []);

  const filteredEvents = useMemo(() => {
    let filtered = normalizedEvents;
    if (selectedClass !== 'all') {
      filtered = filtered.filter(
        (event) => event.data?.class === selectedClass
      );
    }
    if (selectedRoom) {
      filtered = filtered.filter((event) => event.resource === selectedRoom);
    }
    return filtered;
  }, [selectedClass, selectedRoom, normalizedEvents]);

  return (
    <div className='p-4 bg-white shadow-md rounded-lg m-4 mt-0'>
      <div className='flex items-center justify-between'>
        <h1 className='hidden md:block text-lg font-semibold'>Schedule</h1>
        <div className='flex flex-col md:flex-row items-center w-full md:w-auto px-5'>
          <span className='text-lg font-semibold mx-4'>Filter: </span>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className='p-2 border rounded-md'
          >
            {classOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <select
            value={selectedRoom}
            onChange={(e) => setSelectedRoom(e.target.value)}
            className='p-2 border rounded-md ml-4'
          >
            {roomOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      {/* Sử dụng BigCalendar */}
      <BigCalendar
        filteredEvents={filteredEvents}
        resources={resourcesRooms.filter((room) => room.id === selectedRoom)}
        view={view}
        setView={setView}
        localizer={localizer}
      />
      {/* Phân trang */}
      <Pagination />
      {/* Popup thêm sự kiện */}
    </div>
  );
};

export default Schedule;
