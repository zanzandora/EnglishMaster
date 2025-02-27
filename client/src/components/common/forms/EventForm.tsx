import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import InputField from '../InputField';
import { useTranslation } from 'react-i18next';
import FormModal from '../FormModal';
import { useState } from 'react';

const shifts = [
  { label: 'Ca 1: 18:00 - 19:30', value: '18:00-19:30' },
  { label: 'Ca 2: 19:30 - 21:00', value: '19:30-21:00' },
];
// Danh sách dữ liệu giả lập (có thể thay bằng API)
const subjects = ['IELTS', 'TOEIC', 'Giao tiếp', 'Ngữ pháp'];
const teachers = ['Mai Minh Tu', 'Nguyen Van A', 'Tran Thi C'];
const rooms = ['Phòng 101', 'Phòng 102', 'Phòng 103'];

// Schema validation với Zod
const EventSchema = z.object({
  subject: z.string().min(1, 'Vui lòng chọn môn học'),
  teacher: z.string().min(1, 'Vui lòng chọn giáo viên'),
  room: z.string().min(1, 'Vui lòng chọn phòng học'),
  date: z.string().min(1, 'Vui lòng chọn ngày'),
  shift: z.string().min(1, 'Vui lòng chọn ca học'),
});

// Tạo TypeScript type từ schema Zod
type EventFormData = z.infer<typeof EventSchema>;

const EventForm = ({
  type,
  data,
}: {
  type: 'create' | 'update';
  data?: Partial<EventFormData>;
}) => {
  const { t } = useTranslation();
  const [selectedShift, setSelectedShift] = useState(data?.shift || '');
  const [shiftsData, setShiftsData] = useState(shifts);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EventFormData>({
    resolver: zodResolver(EventSchema),
    defaultValues: data || {
      subject: '',
      teacher: '',
      room: '',
      date: '',
      shift: '',
    },
  });

  const handleShiftChange = (newShift: { value: string; label: string }) => {
    setShiftsData((prev) => {
      const exists = prev.some((s) => s.value === newShift.value);
      return exists
        ? prev.map((s) => (s.value === newShift.value ? newShift : s))
        : [...prev, newShift];
    });
    setSelectedShift(newShift.value); // Cập nhật giá trị được chọn ngay lập tức
  };
  const onSubmit = (formData: EventFormData) => {
    console.log('Submitted Data:', formData);
    alert(type === 'create' ? 'Event Created!' : 'Event Updated!');
  };

  return (
    <form className='flex flex-col gap-8' onSubmit={handleSubmit(onSubmit)}>
      <h1 className='text-xl font-semibold'>
        {type === 'create'
          ? t('form.event.titleAdd')
          : t('form.event.titleEdit')}
      </h1>
      {/* Môn học */}
      <InputField
        label='Môn học'
        name='subject'
        register={register}
        error={errors.subject}
        className='min-w-full'
      >
        <option value=''>Chọn môn học</option>
        {subjects.map((subject) => (
          <option key={subject} value={subject}>
            {subject}
          </option>
        ))}
      </InputField>

      {/* Giáo viên */}
      <InputField
        label='Giáo viên'
        name='teacher'
        register={register}
        error={errors.teacher}
        className='min-w-full'
      >
        <option value=''>Chọn giáo viên</option>
        {teachers.map((teacher) => (
          <option key={teacher} value={teacher}>
            {teacher}
          </option>
        ))}
      </InputField>

      {/* Phòng học */}
      <InputField
        label='Phòng học'
        name='room'
        register={register}
        error={errors.room}
        className='min-w-full'
      >
        <option value=''>Chọn phòng học</option>
        {rooms.map((room) => (
          <option key={room} value={room}>
            {room}
          </option>
        ))}
      </InputField>

      {/* Ngày học */}
      <InputField
        label='Ngày học'
        name='date'
        type='date'
        register={register}
        error={errors.date}
        className='min-w-full'
      />

      <div className='flex items-center gap-4'>
        {/* Khung giờ */}
        <InputField
          label='Ca học'
          name='shift'
          register={register}
          error={errors.shift}
          className='w-full'
          inputProps={{
            onChange: (e: any) => setSelectedShift(e.target.value),
          }}
        >
          <option value=''>Chọn ca học</option>
          {shifts.map((shift) => (
            <option key={shift.value} value={shift.value}>
              {shift.label}
            </option>
          ))}
        </InputField>
        {/* Nút mở FormModal để Create Shift */}
        <div className='relative mt-6  flex items-center gap-2'>
          <FormModal
            table='shift'
            type='create'
            data={{}} // Truyền data rỗng để tạo mới
            onShiftChange={handleShiftChange}
          />
          {/* Nút mở FormModal để Update Shift */}
          {selectedShift && (
            <FormModal
              table='shift'
              type='update'
              data={shiftsData.find((s) => s.value === selectedShift)}
              onShiftChange={handleShiftChange}
            />
          )}
        </div>
      </div>

      <button className='bg-blue-400 text-white p-2 rounded-md'>
        {type === 'create'
          ? t('form.actions.create')
          : t('form.actions.update')}
      </button>
    </form>
  );
};

export default EventForm;
