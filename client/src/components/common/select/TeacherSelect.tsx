import { useState } from 'react';
import Select from 'react-select';
import {
  Control,
  FieldValues,
  Controller,
  Merge,
  FieldError,
  FieldErrorsImpl,
} from 'react-hook-form';
import useFetchTeachers from 'hooks/useFetchTeachers';

interface TeacherSelectProps {
  control: Control<FieldValues>; // Sử dụng kiểu Control từ react-hook-form
  name: string;
  error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | string; // Sử dụng kiểu FieldErrors
  className?: string;
  defaultValue?: string[];
}
const TeacherSelect = ({
  control,
  name,
  error,
  className,
  defaultValue,
}: TeacherSelectProps) => {
  const { teachers, loading } = useFetchTeachers();

  // Debug để xem giá trị defaultValue
  console.log('TeacherSelect defaultValue:', defaultValue);

  // Format các options từ teachers data
  const teacherOptions = teachers.map((teacher: any) => ({
    value: teacher.id,
    label: teacher.name,
  }));

  // Debug để xem các options có sẵn
  console.log('TeacherSelect options:', teacherOptions);

  return (
    <div
      className={`relative flex flex-col gap-2 w-full my-1 md:w-1/4 ${className}`}
    >
      <label className='text-xs text-gray-500' htmlFor='teachers'>
        Select Teachers
      </label>
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        render={({ field, fieldState }) => {
          // Debug để xem giá trị hiện tại của field
          console.log('Field value:', field.value);

          // Đảm bảo value luôn là mảng
          const selectedValues = Array.isArray(field.value) ? field.value : [];
          console.log('Select Value', selectedValues);

          // Tạo options từ selectedValues
          const selectedOptions = selectedValues.map((id) => {
            const teacher = teachers.find((t) => t.id === field.value);
            return teacher
              ? { value: teacher.id, label: teacher.name }
              : { value: id, label: 'Loading...' };
          });

          // Debug để xem các options đã chọn
          console.log('Selected options:', selectedOptions);

          return (
            <Select
              {...field}
              isClearable
              isMulti
              options={teacherOptions}
              value={teacherOptions.filter((option) =>
                selectedValues.includes(option.value)
              )}
              onChange={(selected) => {
                field.onChange(selected?.map((option) => option.value) || []);
                // console.log(selected);
              }}
              onBlur={() => {
                if (!fieldState.error) {
                  field.onBlur();
                }
              }}
              isLoading={loading}
              classNamePrefix='select'
            />
          );
        }}
      />
      {typeof error === 'object' && error?.message && (
        <span className='absolute left-0 top-full mt-1 text-xs text-red-400'>
          {error.message.toString()}
        </span>
      )}
      {typeof error === 'string' && (
        <span className='absolute left-0 top-full mt-1 text-xs text-red-400'>
          {error}
        </span>
      )}
    </div>
  );
};

export default TeacherSelect;
