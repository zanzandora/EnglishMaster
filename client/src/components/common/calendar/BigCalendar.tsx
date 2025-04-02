import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Calendar, View, ToolbarProps, EventProps } from 'react-big-calendar';
import DatePicker, { registerLocale } from 'react-datepicker';
import { Tooltip } from 'react-tooltip';
import { setHours, setMinutes, format } from 'date-fns';
import { ExtendedEvent, ResourceCalendar } from '@interfaces';
import { enGB } from 'date-fns/locale/en-GB';
import { vi } from 'date-fns/locale/vi';
import { useTranslation } from 'react-i18next';
import 'react-tooltip/dist/react-tooltip.css';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';

registerLocale('en-GB', enGB);
registerLocale('vi', vi);

interface BigCalendarProps {
  events: any[];
  resources?: any;
  view: View;
  setView: (view: View) => void;
  filteredEvents?: ExtendedEvent[];
  localizer: any;
  onDoubleClickEvent?: (event: ExtendedEvent) => void;
  onSelectEvent?: (event: ExtendedEvent) => void;
}

// Custom Event Component
const CustomEventComponent: React.FC<EventProps<ExtendedEvent>> = ({
  event,
}) => {
  const { t } = useTranslation();
  const anchorId = `anchor-${event.id}-${event.start?.getTime()}`;

  return (
    <>
      <div
        id={anchorId}
        className='p-2 rounded-lg shadow-md text-white h-full flex flex-col'
        style={{
          backgroundColor: event.data?.type === 'exam' ? '#e74c3c' : '#3498db',
        }}
        // data-tooltip-id={`event-tooltip-${event.id}`}
      >
        {/* Phần hiển thị gốc vẫn giữ nguyên */}
        <span className='font-bold text-sm relative'>
          {event.title}{' '}
          {event.data?.startTime && event.data?.endTime && (
            <span className='text-xs '>
              {format(event.start, 'HH:mm')} - {format(event.end, 'HH:mm')}
            </span>
          )}
        </span>

        {event.data?.room && (
          <span className='text-xs'>
            🏫 {t('calendar.toolTip.room')} {event.data.room}
          </span>
        )}
        {event.data?.teacher && (
          <span className='text-xs'>
            👨‍🏫 {t('calendar.toolTip.teacher')}: {event.data.teacher}
          </span>
        )}
        {event.data?.course && (
          <span className='text-xs'>
            📚 {t('calendar.toolTip.course')}: {event.data.course}
          </span>
        )}
        {event.data?.type === 'exam' && (
          <span className=' text-red-500'>{t('calendar.toolTip.exam')}</span>
        )}
      </div>
      {/* Tooltip */}
      <Tooltip
        id={`tooltip-${event.id}-${event.start?.getTime()}`}
        anchorId={anchorId}
        place='top'
        variant='dark'
        className='z-50 text-left'
        render={() => (
          <div className=' overflow-auto'>
            <strong>{event.title}</strong>
            {event.data?.type === 'exam' && (
              <span className=' text-red-500 font-bold'>
                ({t('calendar.toolTip.course')})
              </span>
            )}
            <br />
            {event.data?.room && (
              <>
                🏫 {t('calendar.toolTip.room')}: {event.data.room}
                <br />
              </>
            )}
            {event.data?.teacher && (
              <>
                👨‍🏫 {t('calendar.toolTip.teacher')}: {event.data.teacher}
              </>
            )}
            <br />
            {event.data?.course && (
              <>
                {' '}
                📚 {t('calendar.toolTip.course')}: {event.data.course}
              </>
            )}
          </div>
        )}
      />
    </>
  );
};

// Custom Toolbar Component
const CustomToolbar: React.FC<
  ToolbarProps<ExtendedEvent, ResourceCalendar>
> = ({ label, onNavigate, onView, view }) => {
  const { t } = useTranslation();
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [isInputVisible, setIsInputVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const memoizedDate = useMemo(() => selectedDate, [selectedDate]);

  // *Theo dõi chiều rộng của div chứa DatePicker
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        // Nếu chiều rộng < 150px thì thực hiện thay đổi
        setIsInputVisible(containerWidth > 820);
      }
    };

    // Gọi lại handleResize khi resize
    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      ref={containerRef}
      className='flex items-center justify-between  p-2  flex-wrap'
    >
      {/* DatePicker */}
      <DatePicker
        locale={t('calendar.locale')}
        selected={memoizedDate}
        onChange={(date) =>
          date && (setSelectedDate(date), onNavigate('DATE', date))
        }
        showMonthDropdown
        className={`transition-width duration-300 ease-in-out px-4 py-2 border rounded-full border-primary `}
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
          {t('calendar.today')}
        </button>
        <button
          onClick={() => onNavigate('PREV')}
          className='px-4 py-2 rounded-lg bg-calendar-toolBar-btn hover:bg-calendar-toolBar-hover shadow-[0_1px_3px_rgba(0,0,0,0.5)] active:shadow-[0_0px_1px_rgba(0,0,0,0.5)] active:scale-[0.995]'
        >
          ←
        </button>

        {/* Hiển thị tiêu đề ngày/tháng/năm */}
        <span
          className={`min-w-64  text-center px-6 py-2 rounded-lg bg-calendar-toolBar-label text-white font-semibold hidden xl:inline-block`}
        >
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
        {['day', 'week', 'month'].map((mode) => {
          // Nếu isInputVisible là false và mode là 'day' hoặc 'week' thì return null để không render
          if (
            !isInputVisible &&
            (mode === 'day' || mode === 'month' || mode === 'week')
          )
            return null;

          return (
            <button
              key={mode}
              onClick={() => onView(mode as View)}
              className={`px-4 py-2 rounded-lg ${
                view === mode
                  ? 'bg-primary-redLight_fade font-bold text-orange-900 shadow-[0_1px_3px_rgba(0,0,0,0.5)] active:shadow-[0_0px_1px_rgba(0,0,0,0.5)] active:scale-[0.995]'
                  : 'bg-calendar-toolBar-btn text-sky-800 font-bold hover:opacity-80 shadow-[0_1px_3px_rgba(0,0,0,0.5)] active:shadow-[0_0px_1px_rgba(0,0,0,0.5)] active:scale-[0.995]'
              }`}
            >
              {t(`calendar.${mode}`)}
            </button>
          );
        })}
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
  onDoubleClickEvent,
  onSelectEvent,
}) => {
  const { t } = useTranslation();

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
      min={setHours(setMinutes(new Date(), 0), 17)}
      max={setHours(setMinutes(new Date(), 0), 23)}
      scrollToTime={setHours(setMinutes(new Date(), 0), 7)}
      onDoubleClickEvent={onDoubleClickEvent}
      onSelectEvent={onSelectEvent}
      formats={{
        dayFormat: (date) =>
          format(date, 'EEE (dd/MM)', {
            locale: t('calendar.locale') === 'en-GB' ? enGB : vi,
          }),
        weekdayFormat: (date) =>
          format(date, 'EEEE', {
            locale: t('calendar.locale') === 'en-GB' ? enGB : vi,
          }),
        monthHeaderFormat: (date) =>
          format(date, 'MM / yyyy', {
            locale: t('calendar.locale') === 'en-GB' ? enGB : vi,
          }),
        dayRangeHeaderFormat: ({ start, end }) =>
          `${format(start, 'dd/MM/yyyy', {
            locale: t('calendar.locale') === 'en-GB' ? enGB : vi,
          })} - ${format(end, 'dd/MM/yyyy', {
            locale: t('calendar.locale') === 'en-GB' ? enGB : vi,
          })}`,
        dayHeaderFormat: (date) =>
          format(date, 'EEE (dd/MM)', {
            locale: t('calendar.locale') === 'en-GB' ? enGB : vi,
          }),
      }}
      components={{
        toolbar: CustomToolbar,
        event: CustomEventComponent,
      }}
      popup
      dayLayoutAlgorithm='no-overlap'
    />
  );
};

export default BigCalendar;
