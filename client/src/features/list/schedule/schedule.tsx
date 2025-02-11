import { useState } from 'react';
import { Calendar, dateFnsLocalizer, Event, View } from 'react-big-calendar';
import {
  format,
  parse,
  startOfWeek,
  getDay,
  setHours,
  setMinutes,
} from 'date-fns';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import {
  handleDeleteEvent,
  handleSaveEvent,
  handleSelectEvent,
  handleSelectSlot,
} from './functions';
import { calendarEvents } from '@mockData/data';
import {
  CustomEventComponent,
  CustomToolbar,
} from '@components/common/calendar/CustomeBigCalendar';
import Pagination from '@components/common/Pagination';

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
  { id: 'room101', title: 'Phòng 101', type: 'room' },
  { id: 'room102', title: 'Phòng 102', type: 'room' },
  { id: 'room103', title: 'Phòng 103', type: 'room' },
];

const normalizeEvent = (event: any): ExtendedEvent => {
  return {
    id: event.id !== undefined ? event.id : Date.now(), // Nếu không có ID, tạo một ID tạm thời
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
  const [showPopup, setShowPopup] = useState(false);
  const [newEvent, setNewEvent] = useState<{
    id?: number;
    title: string;
    start: Date;
    end: Date;
    resource?: string;
  }>({
    title: '',
    start: new Date(),
    end: new Date(),
  });
  const [editing, setEditing] = useState(false);
  const normalizedEvents: ExtendedEvent[] = events.map(normalizeEvent);
  return (
    <div className='p-4 bg-white shadow-md rounded-lg m-4 mt-0'>
      <Calendar
        localizer={localizer}
        events={normalizedEvents}
        toolbar={true}
        startAccessor='start'
        endAccessor='end'
        resourceAccessor='resource'
        resources={resourcesRooms}
        resourceIdAccessor='id'
        resourceTitleAccessor='title'
        view={view}
        onView={(newView) => setView(newView)}
        selectable
        onSelectSlot={(slotInfo) =>
          handleSelectSlot(slotInfo, setNewEvent, setEditing, setShowPopup)
        }
        onSelectEvent={(event) =>
          handleSelectEvent(
            event,
            events,
            setNewEvent,
            setEditing,
            setShowPopup
          )
        }
        style={{ height: 'calc(100vh - 100px)' }}
        timeslots={1}
        step={30}
        min={setHours(setMinutes(new Date(), 0), 7)} // 7:00 AM
        max={setHours(setMinutes(new Date(), 0), 23)} // 6:00 PM
        scrollToTime={setHours(setMinutes(new Date(), 0), 7)} // Khi mở lịch, cuộn đến 7:00 AM
        components={{
          toolbar: CustomToolbar,
          event: CustomEventComponent,
        }}
      />
      {/* Phân trang */}
      <Pagination />
      {/* Popup thêm sự kiện */}
      {/* {showPopup && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white p-6 rounded-lg shadow-lg w-[400px]'>
            <h2 className='text-xl font-bold mb-4'>
              {editing ? 'Chỉnh sửa sự kiện' : 'Thêm sự kiện'}
            </h2>
            <input
              type='text'
              placeholder='Tiêu đề sự kiện'
              value={newEvent.title as string}
              onChange={(e) =>
                setNewEvent({ ...newEvent, title: e.target.value })
              }
              className='w-full p-2 border rounded mb-2'
            />
            <label className='block mb-1'>Chọn giáo viên:</label>
            <select
              className='w-full p-2 border rounded mb-2'
              value={newEvent.resource || ''}
              onChange={(e) =>
                setNewEvent({ ...newEvent, resource: e.target.value })
              }
            >
              <option value=''>Không chọn</option>
              {resources.map((res) => (
                <option key={res.id} value={res.id}>
                  {res.teacher}
                </option>
              ))}
            </select>
            <div className='flex gap-2'>
              <button
                onClick={() =>
                  handleSaveEvent(
                    newEvent,
                    editing,
                    events,
                    setEvents,
                    setShowPopup
                  )
                }
                className='bg-blue-500 text-white px-4 py-2 rounded-md'
              >
                Lưu
              </button>
              {editing && (
                <button
                  onClick={() =>
                    handleDeleteEvent(
                      newEvent,
                      editing,
                      events,
                      setEvents,
                      setShowPopup
                    )
                  }
                  className='bg-red-500 text-white px-4 py-2 rounded-md'
                >
                  Xóa
                </button>
              )}
              <button
                onClick={() => setShowPopup(false)}
                className='bg-gray-300 px-4 py-2 rounded-md'
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default Schedule;
