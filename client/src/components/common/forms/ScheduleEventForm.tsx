import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import InputField from '../InputField';

const EventSchema = z.object({
  title: z.string().min(1, 'Vui lòng nhập tiêu đề'),
  date: z.string().min(1, 'Vui lòng chọn ngày'),
  startTime: z.string().min(1, 'Vui lòng chọn giờ bắt đầu'),
  endTime: z.string().min(1, 'Vui lòng chọn giờ kết thúc'),
});

type EventFormData = z.infer<typeof EventSchema>;

const ScheduleEventForm = ({
  event,
  onSave,
  onClose,
}: {
  event: any;
  onSave: (event: any) => void;
  onClose: () => void;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EventFormData>({
    resolver: zodResolver(EventSchema),
    defaultValues: {
      title: event?.title || '',
      date: event?.start
        ? new Date(event.start).toISOString().split('T')[0]
        : '',
      startTime: event?.start ? new Date(event.start).toLocaleTimeString() : '',
      endTime: event?.end ? new Date(event.end).toLocaleTimeString() : '',
    },
  });

  const onSubmit = (formData: EventFormData) => {
    const updatedEvent = {
      ...event,
      title: formData.title,
      start: new Date(`${formData.date} ${formData.startTime}`),
      end: new Date(`${formData.date} ${formData.endTime}`),
    };
    onSave(updatedEvent);
  };

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50'>
      <div className='bg-white p-6 rounded-lg shadow-lg w-96'>
        <h2 className='text-xl font-semibold mb-4'>Chỉnh sửa sự kiện</h2>
        <form className='flex flex-col gap-4' onSubmit={handleSubmit(onSubmit)}>
          <InputField
            label='Tiêu đề'
            name='title'
            register={register}
            error={errors.title}
            className='min-w-full'
          />
          <InputField
            label='Ngày'
            name='date'
            type='date'
            register={register}
            error={errors.date}
            className='min-w-full'
          />
          <InputField
            label='Giờ bắt đầu'
            name='startTime'
            type='time'
            register={register}
            error={errors.startTime}
            className='min-w-full'
          />
          <InputField
            label='Giờ kết thúc'
            name='endTime'
            type='time'
            register={register}
            error={errors.endTime}
            className='min-w-full'
          />

          <div className='flex justify-end gap-2'>
            <button
              type='button'
              onClick={onClose}
              className='bg-gray-400 text-white px-4 py-2 rounded'
            >
              Hủy
            </button>
            <button
              type='submit'
              className='bg-blue-500 text-white px-4 py-2 rounded'
            >
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScheduleEventForm;
