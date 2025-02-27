import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';

const ShiftForm = ({
  type,
  data,
  onShiftChange,
}: {
  type: 'create' | 'update';
  data?: { value: string; label: string };
  onShiftChange: (newShift: { value: string; label: string }) => void;
}) => {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: data || { value: '', label: '' },
  });

  useEffect(() => {
    reset(data || { value: '', label: '' });
  }, [data, reset]);

  const onSubmit = (formData: { value: string; label: string }) => {
    onShiftChange(formData); // Cập nhật shift mới vào EventForm
  };

  return (
    <div className='w-full'>
      <form
        className='flex flex-col gap-4 p-4'
        onSubmit={handleSubmit(onSubmit)}
      >
        <label className='font-medium'>Tên ca học</label>
        <input
          {...register('label')}
          className='border p-2 rounded-md'
          placeholder='VD: Ca 1: 18:00 - 19:30'
        />

        <label className='font-medium'>Thời gian</label>
        <input
          {...register('value')}
          className='border p-2 rounded-md'
          placeholder='VD: 18:00-19:30'
        />

        <button type='submit' className='bg-blue-500 text-white p-2 rounded-md'>
          {type === 'create' ? 'Tạo mới' : 'Cập nhật'}
        </button>
      </form>
    </div>
  );
};

export default ShiftForm;
