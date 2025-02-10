import { useState, useMemo } from 'react';
import { ToolbarProps, View } from 'react-big-calendar';
import DatePicker, { registerLocale } from 'react-datepicker';
import { enGB } from 'date-fns/locale';
import 'react-datepicker/dist/react-datepicker.css';
registerLocale('en-GB', enGB);
interface ExtendedEvent {
  id?: string | number;
  title: string;
  allDay?: boolean;
  start: Date;
  end: Date;
  resource?: string;
  data?: {
    subject?: string;
    class?: string;
    room?: string;
    teacher?: string;
    type?: string;
  };
}

export const CustomToolbar: React.FC<ToolbarProps<ExtendedEvent>> = ({
  label,
  onNavigate,
  view,
  onView,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const memoizedDate = useMemo(() => selectedDate, [selectedDate]);
  return (
    <div className='flex items-center justify-between  p-2  flex-wrap'>
      {/* DatePicker */}
      <DatePicker
        showIcon
        toggleCalendarOnIconClick
        icon={
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='1em'
            height='1em'
            viewBox='0 0 48 48'
          >
            <mask id='ipSApplication0'>
              <g
                fill='none'
                stroke='#fff'
                strokeLinejoin='round'
                strokeWidth='4'
              >
                <path strokeLinecap='round' d='M40.04 22v20h-32V22'></path>
                <path
                  fill='#fff'
                  d='M5.842 13.777C4.312 17.737 7.263 22 11.51 22c3.314 0 6.019-2.686 6.019-6a6 6 0 0 0 6 6h1.018a6 6 0 0 0 6-6c0 3.314 2.706 6 6.02 6c4.248 0 7.201-4.265 5.67-8.228L39.234 6H8.845l-3.003 7.777Z'
                ></path>
              </g>
            </mask>
            <path
              fill='currentColor'
              d='M0 0h48v48H0z'
              mask='url(#ipSApplication0)'
            ></path>
          </svg>
        }
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
          className='px-4 py-2 rounded-lg bg-calendar-today-btn text-sky-950 focus:bg-calendar-today-focus focus:text-white hover:opacity-80 font-bold'
        >
          Today
        </button>
        <button
          onClick={() => onNavigate('PREV')}
          className='px-4 py-2 rounded-lg bg-calendar-toolBar-btn hover:bg-calendar-toolBar-hover'
        >
          ←
        </button>

        {/* Hiển thị tiêu đề ngày/tháng/năm */}
        <span className='min-w-64 text-center px-6 py-2 rounded-lg bg-calendar-toolBar-label text-white font-semibold hidden xl:inline-block'>
          {label}
        </span>

        <button
          onClick={() => onNavigate('NEXT')}
          className='px-4 py-2 rounded-lg bg-calendar-toolBar-btn text-gray-700 hover:bg-calendar-toolBar-hover'
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
                ? 'bg-primary-redLight_fade font-bold text-orange-900 '
                : 'bg-calendar-toolBar-btn text-sky-800 font-bold hover:opacity-70'
            }`}
          >
            {mode.charAt(0).toUpperCase() + mode.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
};

export const CustomEventComponent = ({ event }: { event: ExtendedEvent }) => {
  return (
    <div
      className='p-2 rounded-lg shadow-md border border-gray-200 text-white h-full'
      style={{
        backgroundColor: event.data?.type === 'exam' ? '#e74c3c' : '#3498db',
      }}
    >
      <div className='flex flex-col'>
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
    </div>
  );
};

export default CustomEventComponent;
