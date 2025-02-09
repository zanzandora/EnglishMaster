import { ToolbarProps, View } from 'react-big-calendar';

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
  return (
    <div className='flex items-center justify-between bg-white p-2 shadow-md rounded-lg'>
      {/* Nút điều hướng */}
      <div className='flex items-center gap-2 mx-4'>
        <button
          onClick={() => onNavigate('TODAY')}
          className='px-4 py-2 rounded-lg bg-gray-200 text-gray-700'
        >
          Today
        </button>
        <button
          onClick={() => onNavigate('PREV')}
          className='px-4 py-2 rounded-lg bg-gray-200 text-gray-700'
        >
          ←
        </button>

        {/* Hiển thị tiêu đề ngày/tháng/năm */}
        <span className='min-w-64 text-center px-6 py-2 rounded-lg bg-blue-900 text-white font-semibold '>
          {label}
        </span>

        <button
          onClick={() => onNavigate('NEXT')}
          className='px-4 py-2 rounded-lg bg-gray-200 text-gray-700'
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
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700'
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
