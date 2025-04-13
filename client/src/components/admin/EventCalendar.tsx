import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { useTranslation } from 'react-i18next';
import 'react-calendar/dist/Calendar.css';
import useFetchSchedules from 'hooks/useFetchSchedules';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'hooks/useAuth';
import { decodeToken } from '@utils/decodeToken ';

const EventCalendar = () => {
  const { t } = useTranslation();

  const { token } = useAuth();
  const decodedToken = decodeToken(token);
  const role = decodedToken?.role;

  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date>(new Date());
  const { schedules } = useFetchSchedules();

  // Helper function to check if the date is within the startDate and endDate range
  const isInDateRange = (
    startDate: Date,
    endDate: Date,
    selectedDate: Date
  ) => {
    return selectedDate >= startDate && selectedDate <= endDate;
  };

  // Helper function to check if the selected date is within the scheduled days of the week
  const isCorrectDayOfWeek = (selectedDate: Date, daysOfWeek: number[]) => {
    const dayOfWeek = selectedDate.getDay(); // Get the day of the week (0 for Sun, 1 for Mon, etc.)
    return daysOfWeek.includes(dayOfWeek);
  };

  // Filter schedules based on selected date
  const filteredSchedules = schedules.filter((event: any) => {
    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);

    // Check if selected date is within range and if it matches the daysOfWeek
    return (
      isInDateRange(startDate, endDate, date) &&
      isCorrectDayOfWeek(date, event.daysOfWeek)
    );
  });

  const goToSchedules = () => {
    setOpen(false);
    navigate(`/${role}/list/schedule`);
  };

  return (
    <div className='bg-white p-4 rounded-md'>
      <Calendar
        onChange={(value) => setDate(value as Date)}
        value={date}
        locale={t('calendar.locale')}
        className={'custome-react-calender'}
      />
      <div className='flex items-center justify-between'>
        <h1 className='text-xl font-semibold my-4 capitalize'>
          {t('calendar.events')}
        </h1>
        <span
          onClick={goToSchedules}
          className='text-xs text-gray-400 cursor-pointer hover:opacity-70'
        >
          View All
        </span>
      </div>
      <div
        className={`flex flex-col gap-4 overflow-y-auto ${
          filteredSchedules.length > 3 ? 'max-h-96' : ''
        } `}
      >
        {filteredSchedules.length === 0 ? (
          <div className='text-center text-gray-500'>
            Dont have any schedule for this date
          </div>
        ) : (
          filteredSchedules.map((event: any) => (
            <div
              className='p-5 rounded-md border-2 border-gray-100 border-t-4 odd:border-secondary even:border-primary-redLight_fade'
              key={event.id}
            >
              <div className='flex items-center justify-between'>
                <h1 className='font-semibold text-gray-600'>
                  Room {event.room}
                </h1>
                <span className='text-gray-500 text-xs'>
                  {event.startTime} - {event.endTime}
                </span>
              </div>
              <p className='mt-2 text-gray-400 text-sm'>
                Class {event.class.className} ({event.teacher.teacherName})
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EventCalendar;
