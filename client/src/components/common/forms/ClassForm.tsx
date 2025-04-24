import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import InputField from '../InputField';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import StudentSelect from '@components/common/select/StudentSelect';
import useFetchCourses from 'hooks/useFetchCourses';

//* Định nghĩa schema bằng cách sử dụng z.object() để mô tả cấu trúc dữ liệu và điều kiện hợp lệ.
const baseClassSchema = {
  name: z.string().min(2, 'Class name must be at least 2 characters'),
  capacity: z.coerce.number().int().positive('Capacity is required'),
  teacherID: z.coerce.number().min(1, 'Teacher is required'),
  courseID: z.coerce.number().min(1, 'Course is required'),
  students: z
    .array(
      z.object({
        studentID: z.number(),
        studentName: z.string().optional(),
      })
    )
    .min(1, 'student is required'),
};

// *Tạo TypeScript type từ schema Zod, giúp đồng bộ schema và type
const CreateClassSchema = z.object(baseClassSchema);
const UpdateClassSchema = z.object({ ...baseClassSchema, id: z.number() });

type CreateClassFormData = z.infer<typeof CreateClassSchema>;
type UpdateClassFormData = z.infer<typeof UpdateClassSchema>;

const ClassForm = ({
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
  const tableNameDefault = t('form.table.class');
  const [activeTab, setActiveTab] = useState<'details' | 'students'>('details');

  const { courses } = useFetchCourses();

  const schema = type === 'create' ? CreateClassSchema : UpdateClassSchema;

  // State to track the currently selected course
  const [selectedCourseId, setSelectedCourseId] = useState<number | ''>(
    data?.courseID ?? ''
  );
  // const [capacityValue, setCapacityValue] = useState<number | ''>(
  //   data?.capacity ?? 0
  // );

  const {
    register,
    handleSubmit,
    control,
    trigger,
    formState: { errors, dirtyFields },
    setValue,
    watch,
  } = useForm({
    // *Khi submit form, Zod sẽ tự động kiểm tra dữ liệu dựa trên ClassSchema.
    resolver: zodResolver(schema),
    defaultValues: data || {
      name: '',
      capacity: 5,
      startDate: '',
      endDate: '',
      teacherID: '',
      courseID: '',
      students: [],
    },
  });

  const capacityValue = watch('capacity');

  // Filter teachers based on the selected course
  const filteredTeachers = useMemo(() => {
    return (
      courses.find((c) => String(c.id) === String(selectedCourseId))
        ?.teachers || []
    );
  }, [courses, selectedCourseId]);

  const submitClass = async (formattedData: any) => {
    const url = type === 'create' ? '/class/add' : '/class/edit';
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Something went wrong');
      }

      toast.success(
        type === 'create'
          ? t('orther.toast.create', { tableNameDefault })
          : t('orther.toast.update', { tableNameDefault })
      );
      onSuccess();
      if (setOpen) setOpen(false);
    } catch (error: any) {
      toast.error('❌ ' + error.message);
    }
  };

  const onSubmit = async (
    formData: CreateClassFormData | UpdateClassFormData
  ) => {
    const isValid = await trigger();
    if (!isValid) {
      toast.error('Validation errors:' + errors);
      return;
    }

    try {
      if (type === 'update' && data?.id) {
        formData.id = data.id;
      }

      // Tạo object dữ liệu để gửi đi
      const dataToSubmit = { ...formData };

      // !Nếu teachers không thay đổi, giữ nguyên danh sách cũ
      if (!dirtyFields.students) {
        dataToSubmit.students = data?.students || [];
      } else {
        // Chuyển đổi đúng định dạng từ object sang số
        dataToSubmit.students = formData.students.map((s: any) =>
          typeof s === 'object' ? s.studentID : s
        );
      }

      await submitClass({
        ...formData,
      });
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

      <div className='flex gap-4'>
        <span className='text-xs text-gray-400 font-medium'>
          <button
            type='button'
            className={` ${
              activeTab === 'details' ? 'border-b-2 border-blue-500' : ''
            }`}
            onClick={() => setActiveTab('details')}
          >
            {t('form.class.sections.classDetails')}
          </button>
        </span>
        <span className='text-xs text-gray-400 font-medium'>
          <button
            type='button'
            className={` ${
              activeTab === 'students' ? 'border-b-2 border-blue-500' : ''
            }`}
            onClick={() => setActiveTab('students')}
          >
            {t('form.class.sections.addStudents')}
          </button>
        </span>
      </div>

      {activeTab === 'details' && (
        <div className='flex justify-between flex-wrap gap-4'>
          <InputField
            label={t('form.class.name')}
            name='name'
            register={register}
            error={errors.name}
            className='min-w-full'
          />

          <div className='flex flex-wrap gap-4 w-full justify-between order-1'>
            <InputField
              label={t('form.class.course')}
              name='courseID'
              register={register}
              value={
                selectedCourseId !== undefined ? String(selectedCourseId) : ''
              }
              error={errors.courseID}
              className='flex-1 '
              inputProps={{
                onChange: (e) => {
                  const value = Number(e.target.value);
                  setSelectedCourseId(value);
                  setValue('courseID', value);
                  // Reset teacherID when course changes
                  setValue('teacherID', '');
                },
              }}
            >
              <option value=''>{t('form.placeholders.select')}</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.id} - {course.name}
                </option>
              ))}
            </InputField>
            <InputField
              label={t('form.class.teacher')}
              name='teacherID'
              register={register}
              error={errors.teacherID}
              className='ml-14'
            >
              <option value=''>{t('form.placeholders.select')}</option>
              {filteredTeachers.length > 0 ? (
                filteredTeachers.map((teacher) => (
                  <option key={teacher.teacherId} value={teacher.teacherId}>
                    {teacher.teacherName}
                  </option>
                ))
              ) : (
                <option value='' disabled>
                  Dont have teacher
                </option>
              )}
            </InputField>
          </div>
          <InputField
            label={t('form.class.capacity')}
            name='capacity'
            type='number'
            register={register}
            error={errors.capacity}
          />
        </div>
      )}

      {activeTab === 'students' && (
        <StudentSelect
          control={control}
          name='students'
          defaultValue={
            data?.students?.map((t: any) => ({
              studentID: t.studentID,
              studentName: t.studentName,
            })) || []
          }
          className='min-w-full'
          maxStudents={Number(capacityValue) || 0}
        />
      )}

      <button className='bg-blue-400 text-white p-2 rounded-md'>
        {type === 'create'
          ? t('form.actions.create')
          : t('form.actions.update')}
      </button>
    </form>
  );
};

export default ClassForm;
