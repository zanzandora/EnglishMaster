import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import {
  Control,
  FieldValues,
  Controller,
  Merge,
  FieldError,
  FieldErrorsImpl,
} from 'react-hook-form';
import useFetchTeachers from 'hooks/useFetchTeachers';
import { useTranslation } from 'react-i18next';

interface TeacherSelectProps {
  control: Control<FieldValues>; // Sử dụng kiểu Control từ react-hook-form
  name: string;
  error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | string; // Sử dụng kiểu FieldErrors
  className?: string;
  defaultValue?: number[];
}
const TeacherSelect = ({
  control,
  name,
  error,
  className,
  defaultValue,
}: TeacherSelectProps) => {
  const { teachers, loading } = useFetchTeachers();
  const { t } = useTranslation();

  const animatedComponents = makeAnimated();

  // Format các options từ teachers data
  const teacherOptions = teachers.map((teacher: any) => ({
    value: teacher.id,
    label: teacher.name,
  }));

  return (
    <div
      className={`relative flex flex-col gap-2 w-full my-1 md:w-1/4 ${className}`}
    >
      <label className='text-xs text-gray-500' htmlFor='teachers'>
        {t('form.course.teachers')}
      </label>
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        render={({ field, fieldState }) => {
          // Đảm bảo value luôn là mảng
          const selectedValues = Array.isArray(field.value) ? field.value : [];

          // Tạo options từ selectedValues
          // const selectedIDs = field.value.map((obj) => obj.teacherId); // Mảng số
          // const selectedOptions = teacherOptions.filter((opt) =>
          //   selectedIDs.includes(opt.value)
          // );

          return (
            <Select
              {...field}
              isClearable
              isMulti
              options={teacherOptions}
              value={teacherOptions.filter((option) =>
                selectedValues
                  .map((obj) => obj.teacherId)
                  .includes(option.value)
              )}
              onChange={(selected) => {
                const newValue = selected.map((opt) => ({
                  teacherId: opt.value,
                  teacherName: opt.label,
                }));
                field.onChange(newValue);
              }}
              onBlur={() => {
                if (!fieldState.error) {
                  field.onBlur();
                }
              }}
              isLoading={loading}
              components={animatedComponents}
              closeMenuOnSelect={false}
              classNamePrefix='select'
              placeholder={`Choose teachers to manage course`}
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
