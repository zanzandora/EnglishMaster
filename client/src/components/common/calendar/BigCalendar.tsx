// 📄 components/common/calendar/BigCalendar.tsx
import React, { useState, useMemo } from 'react';
import { Calendar, View, ToolbarProps, EventProps } from 'react-big-calendar';
import { setHours, setMinutes } from 'date-fns';
import { ExtendedEvent, ResourceCalendar } from '@interfaces';
import DatePicker, { registerLocale } from 'react-datepicker';
import { enGB } from 'date-fns/locale';
import 'react-datepicker/dist/react-datepicker.css';
import SearchBoldIcon from '@components/svg/SearchBoldIcon';

registerLocale('en-GB', enGB);

interface BigCalendarProps {
  events: ExtendedEvent[];
  resources: ResourceCalendar[];
  view: View;
  setView: (view: View) => void;
  filteredEvents: ExtendedEvent[];
  localizer: any;
}

// Custom Event Component
const CustomEventComponent: React.FC<EventProps<ExtendedEvent>> = ({
  event,
}) => {
  return (
    <div
      className='p-2 rounded-lg shadow-md text-white h-full'
      style={{
        backgroundColor: event.data?.type === 'exam' ? '#e74c3c' : '#3498db',
      }}
    >
      <span className='font-bold text-sm'>{event.title}</span>
      {event.data?.subject && (
        <span className='text-xs'>📚 {event.data.subject}</span>
      )}
      {event.data?.room && (
        <span className='text-xs'>🏫 {event.data.room}</span>
      )}
      {event.data?.teacher && (
        <span className='text-xs'>👨‍🏫 {event.data.teacher}</span>
      )}
    </div>
  );
};

// Custom Toolbar Component
const CustomToolbar: React.FC<
  ToolbarProps<ExtendedEvent, ResourceCalendar>
> = ({ label, onNavigate, onView, view }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const memoizedDate = useMemo(() => selectedDate, [selectedDate]);
  return (
    <div className='flex items-center justify-between  p-2  flex-wrap'>
      {/* DatePicker */}
      <DatePicker
        showIcon
        toggleCalendarOnIconClick
        icon={<SearchBoldIcon />}
        locale='en-GB'
        selected={memoizedDate}
        onChange={(date) =>
          date && (setSelectedDate(date), onNavigate('DATE', date))
        }
        showMonthDropdown
        className='px-4 py-2 border rounded-lg border-primary hidden md:inline-block'
        popperClassName='datepicker-popup'
        portalId='root'
        dateFormat='dd/MM/yyyy'
      />

      {/* Nút điều hướng */}
      <div className='flex items-center gap-2 mx-4'>
        <button
          onClick={() => onNavigate('TODAY')}
          className='px-4 py-2 rounded-lg bg-calendar-today-btn text-white text-lg font-semibold tracking-wider  shadow-[0_1px_3px_rgba(0,0,0,0.5)] active:shadow-[0_0px_1px_rgba(0,0,0,0.5)] active:scale-[0.995]'
        >
          Today
        </button>
        <button
          onClick={() => onNavigate('PREV')}
          className='px-4 py-2 rounded-lg bg-calendar-toolBar-btn hover:bg-calendar-toolBar-hover shadow-[0_1px_3px_rgba(0,0,0,0.5)] active:shadow-[0_0px_1px_rgba(0,0,0,0.5)] active:scale-[0.995]'
        >
          ←
        </button>

        {/* Hiển thị tiêu đề ngày/tháng/năm */}
        <span className='min-w-64 text-center px-6 py-2 rounded-lg bg-calendar-toolBar-label text-white font-semibold hidden xl:inline-block'>
          {label}
        </span>

        <button
          onClick={() => onNavigate('NEXT')}
          className='px-4 py-2 rounded-lg bg-calendar-toolBar-btn text-gray-700 hover:bg-calendar-toolBar-hover shadow-[0_1px_3px_rgba(0,0,0,0.5)] active:shadow-[0_0px_1px_rgba(0,0,0,0.5)] active:scale-[0.995]'
        >
          →
        </button>
      </div>

      {/* Chế độ xem: Day / Week / Month */}
      <div className='flex gap-2'>
        {['day', 'week', 'month'].map((mode) => (
          <button
            key={mode}
            onClick={() => onView(mode as View)}
            className={`px-4 py-2 rounded-lg ${
              view === mode
                ? 'bg-primary-redLight_fade font-bold text-orange-900 shadow-[0_1px_3px_rgba(0,0,0,0.5)] active:shadow-[0_0px_1px_rgba(0,0,0,0.5)] active:scale-[0.995]'
                : 'bg-calendar-toolBar-btn text-sky-800 font-bold hover:opacity-80 shadow-[0_1px_3px_rgba(0,0,0,0.5)] active:shadow-[0_0px_1px_rgba(0,0,0,0.5)] active:scale-[0.995]'
            }`}
          >
            {mode.charAt(0).toUpperCase() + mode.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
};

const BigCalendar: React.FC<BigCalendarProps> = ({
  events,
  resources,
  view,
  setView,
  filteredEvents,
  localizer,
}) => {
  return (
    <Calendar
      localizer={localizer}
      events={filteredEvents}
      startAccessor='start'
      endAccessor='end'
      resourceAccessor='resource'
      resources={resources}
      resourceIdAccessor='id'
      resourceTitleAccessor='title'
      view={view}
      onView={(newView) => setView(newView)}
      selectable
      style={{ height: 'calc(100vh - 100px)' }}
      timeslots={1}
      step={30}
      min={setHours(setMinutes(new Date(), 0), 7)}
      max={setHours(setMinutes(new Date(), 0), 23)}
      scrollToTime={setHours(setMinutes(new Date(), 0), 7)}
      components={{
        toolbar: CustomToolbar,
        event: CustomEventComponent,
      }}
    />
  );
};

export default BigCalendar;
