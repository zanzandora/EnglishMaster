import Select, {
  components as selectComponents,
  OptionProps,
} from 'react-select';
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
import CustomTooltip from '../CustomTooltip';

interface StudentSelectProps {
  control: Control<FieldValues>; // Sử dụng kiểu Control từ react-hook-form
  name: string;
  error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | string; // Sử dụng kiểu FieldErrors
  className?: string;
  defaultValue?: number[];
  maxStudents?: number; // Thêm prop maxStudents để giới hạn số lượng học sinh
  hasClass?: boolean;
}

interface StudentOptionType {
  value: number;
  label: string;
  studentID: number;
  email: string;
  gender: string;
  hasClass: boolean;
}

const CustomOption = (props: OptionProps<StudentOptionType, true>) => {
  const { data, innerProps } = props;
  const anchorId = `student-option-${data.value}`;
  return (
    <>
      <div
        {...innerProps}
        id={anchorId}
        style={{ display: 'flex', alignItems: 'right', cursor: 'pointer' }}
      >
        <selectComponents.Option {...props} />
      </div>
      <CustomTooltip anchorId={anchorId} float={true}>
        <div>
          <div>
            <b>Name:</b> {data.label.split(' - ')[0]}
          </div>
          <div>
            <b>Student ID:</b> {data.studentID}
          </div>
          <div>
            <b>Email:</b> {data.email}
          </div>
          <div>
            <b>Gender:</b> {data.gender}
          </div>
          <div>
            <b>Status:</b>{' '}
            {data.hasClass ? (
              <span className='text-red-500'>Have registered for class</span>
            ) : (
              <span className='text-green-500'>
                Have <strong>NOT</strong> registered for class
              </span>
            )}
          </div>
        </div>
      </CustomTooltip>
    </>
  );
};
const StudentSelect = ({
  control,
  name,
  error,
  className,
  defaultValue,
  maxStudents = 0, // Giá trị mặc định là 0 (không giới hạn)
}: StudentSelectProps) => {
  const { students, loading } = useFetchStudents();
  const { t } = useTranslation();

  const animatedComponents = makeAnimated();

  // Format các options từ students data, bổ sung thông tin cho tooltip
  const studentOptions: StudentOptionType[] = students.map((student: any) => ({
    value: student.id,
    label: `${student.name} - (${student.id})`,
    studentID: student.id,
    email: student.email || 'N/A',
    gender: student.gender || 'N/A',
    hasClass: !!student.className,
  }));

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
          // Đảm bảo value luôn là mảng
          const selectedValues = Array.isArray(field.value) ? field.value : [];

          // // Tạo options từ selectedValues
          // const selectedIDs = field.value.map((obj) => obj.studentID);
          // const selectedOptions = studentOptions.filter((opt) =>
          //   selectedIDs.includes(opt.value)
          // );

          const selectedCount = selectedValues.length;

          // Disable các option chưa được chọn nếu đã đạt maxStudents
          const optionsWithDisabled =
            maxStudents > 0 && selectedCount >= maxStudents
              ? studentOptions.map((option) => ({
                  ...option,
                  isDisabled: !selectedValues
                    .map((obj) => obj.studentID)
                    .includes(option.value),
                }))
              : studentOptions;

          return (
            <>
              <Select
                {...field}
                styles={{
                  option: (provided, { data }) => ({
                    ...provided,
                    color: data.hasClass ? '#ef4444' : '#22c55e',
                    backgroundColor: 'white',
                    ':active': {
                      ...provided[':active'],
                      backgroundColor: data.hasClass ? '#fee2e2' : '#dcfce7',
                    },
                  }),
                }}
                isClearable
                maxMenuHeight={250}
                isMulti
                options={optionsWithDisabled}
                value={studentOptions.filter((option) =>
                  selectedValues
                    .map((obj) => obj.studentID)
                    .includes(option.value)
                )}
                onChange={(selected) => {
                  // Chỉ cho phép chọn tối đa maxStudents
                  let newSelected = selected;
                  if (maxStudents > 0 && selected.length > maxStudents) {
                    newSelected = selected.slice(0, maxStudents);
                  }
                  // Chuyển đổi selected từ dạng options sang dạng { studentID, studentName }
                  const newValue = newSelected.map((opt) => ({
                    studentID: opt.value,
                    studentName: opt.label.split(' - ')[0],
                  }));
                  field.onChange(newValue);
                }}
                onBlur={() => {
                  if (!fieldState.error) {
                    field.onBlur();
                  }
                }}
                isLoading={loading}
                components={{
                  ...animatedComponents,
                  Option: CustomOption,
                }}
                menuPlacement='auto'
                closeMenuOnSelect={false}
                menuShouldBlockScroll={false}
                classNamePrefix='select'
                placeholder={`Choose students to add class`}
              />
              {maxStudents > 0 && (
                <div className='text-xs text-gray-400 mt-1'>
                  -{'>'}
                  {selectedCount}/{maxStudents} students selected
                </div>
              )}
            </>
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
