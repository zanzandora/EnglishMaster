import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import InputField from '../InputField';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { useFetchClassesOptions } from 'hooks/useFetchOptions';
import { toast } from 'react-toastify';
import DatePicker, { registerLocale } from 'react-datepicker';
import { vi } from 'date-fns/locale/vi';
import { formatDate } from '@utils/dateUtils';
import FormModal from '../FormModal';

registerLocale('vi', vi);

const shifts = [
  { label: 'Shift 1: 17:30 - 19:30', value: '17:30-19:30' },
  { label: 'Shift 2: 19:30 - 21:30', value: '19:30-21:30' },
];

const rooms = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  name: i + 1,
}));

// Schema validation dùng Zod
const baseEventSchema = {
  classID: z.coerce.number().min(1, 'Vui lòng chọn lớp học'),
  room: z.coerce.number().min(1, 'Vui lòng chọn phòng học'),
  daysOfWeek: z.string().regex(/^(none|(\d,?)+)$/, 'Vui lòng chọn ngày hợp lệ'),
  shift: z.string().min(1, 'Vui lòng chọn ca học'),
  type: z.string().min(1, 'type is required'),
};

const CreateEventsSchema = z.object(baseEventSchema);

const UpdateEventsSchema = z.object({
  ...baseEventSchema,
  id: z.number(),
});
type CreateEventFormData = z.infer<typeof CreateEventsSchema>;
type UpdateEventFormData = z.infer<typeof UpdateEventsSchema>;

//* Hàm chuyển đổi shift thành startTime và endTime
const parseShift = (shiftStr: string) => {
  const [startTime, endTime] = shiftStr.split('-');
  return { startTime, endTime };
};
const EventForm = ({
  type,
  data,
  onSuccess = () => {},
  setOpen,
}: {
  type: 'create' | 'update';
  data?: any;
  onSuccess?: () => void;
  setOpen?: (open: boolean) => void;
}) => {
  const { t } = useTranslation();
  const tableNameDefault = t('form.table.schedule');
  const [openTrigger, setOpenTrigger] = useState<number>(0);
  const [OpenDelete, setOpenDelete] = useState(false);

  const handleOpenDeleteModal = () => {
    setOpenTrigger((prev) => prev + 1); // Tăng giá trị trigger để mở lại modal
    setOpenDelete(true);
  };

  const { classOptions } = useFetchClassesOptions();

  const [startDate, setStartDate] = useState<Date>(() => {
    if (type === 'update' && data?.startDate) {
      return new Date(data.startDate);
    }
    return new Date(); // mặc định nếu create
  });

  const [endDate, setEndDate] = useState<Date>(() => {
    if (type === 'update' && data?.endDate) {
      return new Date(data.endDate);
    }
    const today = new Date();
    today.setDate(today.getDate() + 10);
    return today;
  });
  // Dùng activeTab để chuyển đổi giữa các section
  const [activeTab, setActiveTab] = useState<'eventInfo' | 'scheduling'>(
    'eventInfo'
  );

  const schema = type === 'create' ? CreateEventsSchema : UpdateEventsSchema;

  const normalizeTime = (time: string) => time.slice(0, 5);

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues:
      type === 'update' && data
        ? {
            id: data.id,
            classID: data.classID || '',
            room: Number(data.room) || 0,
            daysOfWeek: data?.daysOfWeek || '',
            shift:
              data?.startTime && data?.endTime
                ? `${normalizeTime(data.startTime)}-${normalizeTime(
                    data.endTime
                  )}`
                : '',
            type: data?.type || 'class',
          }
        : {
            classID: 0,
            room: 0,
            daysOfWeek: '',
            shift: '',
            type: 'class',
          },
  });

  const submitSchedule = async (formattedData: any) => {
    const url = type === 'create' ? '/schedule/add' : '/schedule/edit';
    console.log('🔴 API Sending:', formattedData);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      toast.success(
        type === 'create'
          ? t('orther.toast.create', { tableNameDefault })
          : t('orther.toast.update', { tableNameDefault })
      );

      if (onSuccess) {
        onSuccess();
      }

      if (setOpen) {
        setOpen(false);
      }
    } catch (error: any) {
      toast.error('❌ ' + error.message);
    }
  };

  const onSubmit = async (
    formData: CreateEventFormData | UpdateEventFormData
  ) => {
    const isValid = await trigger();
    if (!isValid) {
      console.log('Validation errors:', errors);
      toast.error('Validation errors:' + JSON.stringify(errors));
      return;
    }

    try {
      const { startTime, endTime } = parseShift(formData.shift);

      // Định dạng ngày: YYYY-MM-DD
      const formattedStartDate = formatDate(startDate, 'yyyy-MM-dd');
      const formattedEndDate = formatDate(endDate, 'yyyy-MM-dd');

      const formattedData: any = {
        classID: formData.classID,
        type: formData.type === 'none' ? '' : formData.type,
        repeatRule: formData.type === 'class' ? 'weekly' : 'custom',
        daysOfWeek: formData.daysOfWeek,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        startTime: startTime,
        endTime: endTime,
        room: Number(formData.room),
      };

      if (type === 'update' && data?.id) {
        formattedData.id = data.id;
      }
      console.log('🚀 Before submit Form Data:', formattedData);

      if (type === 'create') {
        // 🔥 Gọi API kiểm tra xung đột trước khi gửi form
        const conflictResponse = await fetch('/schedule/check-conflict', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formattedData),
        });

        if (!conflictResponse.ok) {
          const errorText = await conflictResponse.text();
          toast.error(`❌ ${errorText}`);
          return; // Dừng lại nếu có lỗi
        }
      }

      await submitSchedule(formattedData);
    } catch (error: any) {
      toast.error('Error processing form' + error.message);
    }
  };
  return (
    <form className='flex flex-col gap-8' onSubmit={handleSubmit(onSubmit)}>
      <h1 className='text-xl font-semibold'>
        {type === 'create'
          ? t('form.titles.add', { tableNameDefault })
          : t('form.titles.edit', { tableNameDefault })}
      </h1>

      {/* Tab Navigation */}
      <div className='flex gap-4 items-center'>
        <button
          type='button'
          className={`text-xs text-gray-400 font-medium ${
            activeTab === 'eventInfo' ? 'border-b-2 border-blue-500' : ''
          }`}
          onClick={() => setActiveTab('eventInfo')}
        >
          {t('form.schedule.sections.eventInfo')}
        </button>
        <button
          type='button'
          className={`text-xs text-gray-400 font-medium ${
            activeTab === 'scheduling' ? 'border-b-2 border-blue-500' : ''
          }`}
          onClick={() => setActiveTab('scheduling')}
        >
          {t('form.schedule.sections.scheduleDetails')}
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'eventInfo' && (
        <div className='flex flex-col gap-4'>
          <InputField
            label={t('form.schedule.class')}
            name='classID'
            register={register}
            error={errors.classID}
            className='min-w-full'
          >
            <option value=''>{t('form.placeholders.select')}</option>
            {classOptions.map((cls: any) => (
              <option key={cls.id} value={cls.id}>
                {cls.name}
              </option>
            ))}
          </InputField>

          <InputField
            label={t('form.schedule.room')}
            name='room'
            register={register}
            error={errors.room}
            className='min-w-full'
          >
            <option value=''>{t('form.placeholders.select')}</option>
            {rooms.map((room) => (
              <option key={room.id} value={room.id}>
                Room {room.name}
              </option>
            ))}
          </InputField>
          <InputField
            label={t('form.schedule.type')}
            name='type'
            register={register}
            error={errors.type}
            className='w-full'
            inputProps={{ disabled: true }}
          >
            <option value=''>{t('form.placeholders.select')}</option>
            <option value='class'>Class</option>
            <option value='exam'>Exam</option>
          </InputField>
        </div>
      )}

      {activeTab === 'scheduling' && (
        <div className='relative flex flex-col gap-2 min-w-full my-2 md:w-1/4'>
          <div className=' flex flex-row gap-4 justify-between items-center my-2'>
            <div className=' relative'>
              <label className='text-xs text-gray-500 absolute bottom-full mb-1'>
                {t('form.schedule.startDate')}
              </label>
              <DatePicker
                todayButton='Today'
                locale={vi}
                selected={startDate}
                onChange={(date) => date && setStartDate(date)}
                selectsStart
                showMonthDropdown
                startDate={startDate}
                endDate={endDate}
                className={`transition-width duration-300 ease-in-out px-4 py-2 border rounded-md  `}
              />
            </div>
            <div className=' relative'>
              <label className='text-xs text-gray-500 absolute bottom-full mb-1'>
                {t('form.schedule.endDate')}
              </label>
              <DatePicker
                locale={vi}
                selected={endDate}
                onChange={(date) => date && setEndDate(date)}
                selectsEnd
                showMonthDropdown
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                className={`transition-width duration-300 ease-in-out px-4 py-2 border rounded-md  `}
              />
            </div>
          </div>
          <div className='flex flex-col gap-4'>
            <InputField
              label={t('form.schedule.daysOfWeek')}
              name='daysOfWeek'
              register={register}
              error={errors.daysOfWeek}
              className='min-w-full'
              inputProps={{
                placeholder:
                  '1 -> Mon, 2 -> Tue, . . . ,7->Sun (input "none" to skip)',
              }}
            />
            <InputField
              label={t('form.schedule.shift')}
              name='shift'
              register={register}
              error={errors.shift}
              className='min-w-full'
            >
              <option value=''>{t('form.placeholders.select')}</option>
              {shifts.map((shift) => (
                <option key={shift.value} value={shift.value}>
                  {shift.label}
                </option>
              ))}
            </InputField>
          </div>
        </div>
      )}

      <button type='submit' className='bg-blue-400 text-white p-2 rounded-md'>
        {type === 'create'
          ? t('form.actions.create')
          : t('form.actions.update')}
      </button>
      {type === 'update' && (
        <button
          type='button'
          className='bg-red-500 text-white p-2 rounded-md'
          onClick={handleOpenDeleteModal}
        >
          {t('form.actions.delete')}
        </button>
      )}

      {OpenDelete && (
        <FormModal
          table='schedule'
          type='delete'
          id={data.id}
          onSuccess={() => {
            if (setOpen) setOpen(false); // Đóng modal update
            onSuccess(); // đóng modal update
          }}
          hideTrigger={true}
          openTrigger={openTrigger}
        />
      )}
    </form>
  );
};

export default EventForm;
