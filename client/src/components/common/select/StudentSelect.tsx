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
import useFetchStudents from 'hooks/useFetchStudents';
import { useTranslation } from 'react-i18next';

interface StudentSelectProps {
  control: Control<FieldValues>; // Sử dụng kiểu Control từ react-hook-form
  name: string;
  error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | string; // Sử dụng kiểu FieldErrors
  className?: string;
  defaultValue?: number[];
}
const StudentSelect = ({
  control,
  name,
  error,
  className,
  defaultValue,
}: StudentSelectProps) => {
  const { students, loading } = useFetchStudents();
  const { t } = useTranslation();

  const animatedComponents = makeAnimated();

  // Debug để xem giá trị defaultValue
  // console.log('TeacherSelect defaultValue:', defaultValue);

  // Format các options từ teachers data
  const studentOptions = students.map((student: any) => ({
    value: student.id,
    label: `${student.name} - (${student.id})`,
  }));

  // Debug để xem các options có sẵn
  // console.log('studentSelect options:', studentOptions);

  return (
    <div
      className={`relative flex flex-col gap-2 w-full my-1 md:w-1/4 ${className}`}
    >
      <label className='text-xs text-gray-500' htmlFor='teachers'>
        {t('form.class.students')}
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

          // // Tạo options từ selectedValues
          // const selectedIDs = field.value.map((obj) => obj.studentID);
          // const selectedOptions = studentOptions.filter((opt) =>
          //   selectedIDs.includes(opt.value)
          // );

          // // Debug để xem các options đã chọn
          // console.log('Selected options:', selectedOptions);

          return (
            <Select
              {...field}
              isClearable
              isMulti
              options={studentOptions}
              value={studentOptions.filter((option) =>
                selectedValues
                  .map((obj) => obj.studentID)
                  .includes(option.value)
              )}
              onChange={(selected) => {
                // Chuyển đổi selected từ dạng options sang dạng { studentID, studentName }
                const newValue = selected.map((opt) => ({
                  studentID: opt.value,
                  studentName: opt.label.split(' - ')[0],
                }));
                field.onChange(newValue);
                console.log('selected student', newValue);
                // console.log(selected);
              }}
              onBlur={() => {
                if (!fieldState.error) {
                  field.onBlur();
                }
              }}
              isLoading={loading}
              components={animatedComponents}
              menuPlacement='auto'
              closeMenuOnSelect={false}
              menuShouldBlockScroll={false}
              classNamePrefix='select'
              placeholder={`Choose students to add class`}
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

export default StudentSelect;
