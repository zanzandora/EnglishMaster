import React, { useState, useMemo, useEffect } from 'react';
import { dateFnsLocalizer, Event, View } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { role } from '@mockData/data';
import BigCalendar from '@components/common/calendar/BigCalendar';
import { ExtendedEvent } from '@interfaces';
import { useTranslation } from 'react-i18next';
import FormModal from '@components/common/FormModal';
import useFetchSchedules from 'hooks/useFetchSchedules';

const locales = { 'en-US': import('date-fns/locale/en-US') };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

// *Định nghĩa các room resource cố định
const resourcesRooms = [
  { id: 1, title: 'Room 1', type: 'room' },
  { id: 2, title: 'Room 2', type: 'room' },
  { id: 3, title: 'Room 3', type: 'room' },
  { id: 4, title: 'Room 4', type: 'room' },
  { id: 5, title: 'Room 5', type: 'room' },
  { id: 6, title: 'Room 6', type: 'room' },
  { id: 7, title: 'Room 7', type: 'room' },
  { id: 8, title: 'Room 8', type: 'room' },
  { id: 9, title: 'Room 9', type: 'room' },
  { id: 10, title: 'Room 10', type: 'room' },
];

// *Helper: Tạo đối tượng Date từ base date và chuỗi thời gian (hh:mm)
const createEventDate = (base: Date, timeStr: string): Date => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const date = new Date(base);
  date.setHours(hours, minutes);
  return date;
};

// *Hàm normalize: chuyển event thành cấu trúc ExtendedEvent chuẩn
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

// *Hàm sinh các event theo lịch (bao gồm cả trường hợp exam và lặp hàng tuần)
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

const Schedule: React.FC = () => {
  const { t } = useTranslation();
  const [view, setView] = useState<View>('week');
  const [events, setEvents] = useState<Event[]>([]);
  const [reloadTrigger, setReloadTrigger] = useState(0);
  const { schedules } = useFetchSchedules(reloadTrigger);

  // *Khi schedules thay đổi, tạo các event bằng cách "flatMap" qua generateRecurringEvents
  useEffect(() => {
    if (schedules) {
      setEvents(schedules.flatMap(generateRecurringEvents));
    }
  }, [schedules, reloadTrigger]);

  // *Normalize các event trước khi render (để thống nhất cấu trúc)
  const normalizedEvents = useMemo(() => events.map(normalizeEvent), [events]);

  // *Filter state: lớp học và phòng
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedRoom, setSelectedRoom] = useState<string>(
    resourcesRooms[0].id.toString()
  );
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [openTrigger, setOpenTrigger] = useState<number>(0);

  // *Tạo danh sách option cho dropdown lớp học (loại bỏ trùng lặp)
  const classOptions = useMemo(() => {
    const classes = Array.from(
      new Set(normalizedEvents.map((e) => e.data?.className).filter(Boolean))
    );
    return [
      { value: 'all', label: 'All Classes' },
      ...classes.map((c) => ({ value: c, label: c })),
    ];
  }, [normalizedEvents]);

  // *Tạo option cho dropdown phòng (với dữ liệu tĩnh)
  const roomOptions = useMemo(() => {
    return resourcesRooms.map((room) => ({
      value: room.id,
      label: room.title,
    }));
  }, []);

  // *Lọc event dựa trên lớp học và phòng đã chọn
  const filteredEvents = useMemo(() => {
    let filtered = normalizedEvents;
    if (selectedClass !== 'all') {
      filtered = filtered.filter((e) => e.data?.className === selectedClass);
    }
    if (selectedRoom) {
      filtered = filtered.filter((e) => e.resource.toString() === selectedRoom);
    }
    return filtered;
  }, [selectedClass, selectedRoom, normalizedEvents]);

  const handleDoubleClickEvent = (event: any) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
    // Mỗi lần double click, cập nhật openTrigger bằng timestamp (giá trị khác nhau)
    setOpenTrigger(Date.now());
  };

  const handleSuccess = () => {
    setReloadTrigger((prev) => prev + 1); // Gọi lại danh sách sau khi xóa
  };
  const handleReload = () => {
    setReloadTrigger((prev) => prev + 1);
  };

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
                {option.value === 'all'
                  ? t('filters.classes.all')
                  : option.label}
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
          <div className='pl-5'>
            {role === 'admin' && (
              <FormModal
                table='schedule'
                type='create'
                onSuccess={handleSuccess}
              />
            )}
          </div>
        </div>
      </div>
      <BigCalendar
        events={events}
        filteredEvents={filteredEvents}
        resources={resourcesRooms.filter(
          (room) => room.id.toString() === selectedRoom
        )}
        view={view}
        setView={setView}
        localizer={localizer}
        onDoubleClickEvent={handleDoubleClickEvent}
      />
      {isModalOpen && selectedEvent && role === 'admin' && (
        <FormModal
          table='schedule'
          type='update'
          data={selectedEvent.data}
          onSuccess={handleReload}
          hideTrigger={true}
          openTrigger={openTrigger}
        />
      )}
    </div>
  );
};

export default Schedule;
