import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import InputField from '../InputField';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import StudentSelect from '@components/common/select/StudentSelect';
import useFetchTeachers from 'hooks/useFetchTeachers';
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
  const [activeTab, setActiveTab] = useState<'details' | 'students'>('details');

  const { teachers } = useFetchTeachers();
  const { courses } = useFetchCourses();

  const schema = type === 'create' ? CreateClassSchema : UpdateClassSchema;

  const {
    register,
    handleSubmit,
    control,
    watch,
    trigger,
    formState: { errors, dirtyFields },
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
  // Dùng watch để lấy giá trị hiện tại của teacherID và courseID
  const teacherIDValue = watch('teacherID');
  const courseIDValue = watch('courseID');

  const submitClass = async (formattedData: any) => {
    const url = type === 'create' ? '/class/add' : '/class/edit';
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
        const errorData = await response.json();
        throw new Error(errorData.error || 'Something went wrong');
      }

      toast.success(
        type === 'create'
          ? 'Class created successfully!'
          : 'Class updated successfully!'
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

      console.log('🔴 Before Mapping:', formData.students);

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
      console.log('🟢 After Mapping:', dataToSubmit.students);
      console.log('🚀 Raw Form Data:', dataToSubmit);

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
        {type === 'create' ? 'Create a new Class' : 'Update Class'}
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
            Class Details
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
            Add Students
          </button>
        </span>
      </div>

      {activeTab === 'details' && (
        <div className='flex justify-between flex-wrap gap-4'>
          <InputField
            label='Class Name'
            name='name'
            register={register}
            error={errors.name}
            className='min-w-full'
          />

          <div className='flex flex-wrap gap-4 w-full justify-between order-1'>
            <InputField
              label='Teacher in charge'
              name='teacherID'
              register={register}
              value={teacherIDValue !== undefined ? String(teacherIDValue) : ''}
              error={errors.teacherID}
            >
              <option value=''>{t('form.placeholders.select')}</option>
              {teachers.map((teacher: any) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.name}
                </option>
              ))}
            </InputField>
            <InputField
              label='Course'
              name='courseID'
              register={register}
              value={courseIDValue !== undefined ? String(courseIDValue) : ''}
              error={errors.courseID}
              className='flex-1 ml-14'
            >
              <option value=''>{t('form.placeholders.select')}</option>
              {courses.map((course: any) => (
                <option key={course.id} value={course.id}>
                  {course.id} - {course.name}
                </option>
              ))}
            </InputField>
          </div>
          <InputField
            label='Capacity'
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
        />
      )}

      <button className='bg-blue-400 text-white p-2 rounded-md'>
        {type === 'create' ? 'Create' : 'Update'}
      </button>
    </form>
  );
};

export default ClassForm;
