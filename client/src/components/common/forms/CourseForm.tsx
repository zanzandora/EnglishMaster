import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import InputField from '../InputField';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import TeacherSelect from '@components/common/select/TeacherSelect';
import { useEffect, useState } from 'react';

// Định nghĩa schema bằng cách sử dụng z.object() để mô tả cấu trúc dữ liệu và điều kiện hợp lệ.
const baseCourseSchema = {
  name: z.string().min(3, 'Course name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  duration: z.coerce.number().int().positive('Duration is required'),
  fee: z.coerce.number().int().positive('Fee is required'),
  teachers: z.any(),
};

// Tạo TypeScript type từ schema Zod
const CreateCourseSchema = z.object(baseCourseSchema);

const UpdateCourseSchema = z.object({
  ...baseCourseSchema,
  id: z.number(),
});

type CreateCourseFormData = z.infer<typeof CreateCourseSchema>;
type UpdateCourseFormData = z.infer<typeof UpdateCourseSchema>;

const CourseForm = ({
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
  // const [currentTeachers, setCurrentTeachers] = useState([]);

  // useEffect(() => {
  //   if (type === 'update' && data?.id) {
  //     // Lấy danh sách giáo viên hiện tại của khóa học
  //     const fetchTeachers = async () => {
  //       try {
  //         const response = await fetch(`/course/teachers/${data.id}`);
  //         if (response.ok) {
  //           const teachers = await response.json();
  //           setCurrentTeachers(teachers);
  //         }
  //       } catch (error) {
  //         console.error('Failed to fetch teachers:', error);
  //       }
  //     };

  //     fetchTeachers();
  //   }
  // }, [type, data]);

  const schema = type === 'create' ? CreateCourseSchema : UpdateCourseSchema;

  const {
    register,
    handleSubmit,
    control,
    trigger,
    formState: { errors },
  } = useForm({
    // Khi submit form, Zod sẽ tự động kiểm tra dữ liệu dựa trên StudentSchema.
    resolver: zodResolver(schema),
    defaultValues: data || {
      name: '',
      description: '',
      duration: 0,
      fee: 0,
      teachers: [],
    },
  });

  const submitCourse = async (formattedData: any) => {
    const url = type === 'create' ? '/course/add' : '/course/edit';
    // console.log('🔴 API Sending:', formattedData);
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
          ? 'Thêm Khóa học thành công!'
          : 'Cập nhật Khóa học thành công!'
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
    formData: CreateCourseFormData | UpdateCourseFormData
  ) => {
    const isValid = await trigger();
    if (!isValid) {
      toast.error('Validation errors:' + errors);
      return;
    }

    try {
      if (type === 'update' && data?.id) {
        formData.id = data.id;
        formData.teachers =
          formData.teachers?.map((t: any) => t.teacherId) || [];
      }
      // console.log('🚀 Raw Form Data:', formData);
      await submitCourse({
        ...formData,
      });
    } catch (error: any) {
      toast.error('Error processing form' + error.message);
    }
  };

  return (
    <form className='flex flex-col gap-8' onSubmit={handleSubmit(onSubmit)}>
      <h1 className='text-xl font-semibold'>
        {type === 'create' ? 'Create a new Course' : 'Update Course'}
      </h1>

      <div className='flex justify-between flex-wrap gap-4'>
        <InputField
          label='Course Name'
          name='name'
          register={register}
          error={errors.name}
          className='min-w-full'
        />

        <InputField
          label='Fee ( .000Đ )'
          name='fee'
          register={register}
          error={errors.fee}
          inputProps={{ pattern: '\\d*', inputMode: 'numeric' }}
        />

        <InputField
          label='Duration ( month )'
          type='number'
          name='duration'
          register={register}
          error={errors.duration}
        />
        <TeacherSelect
          control={control}
          name='teachers'
          error={errors.teachers}
          defaultValue={
            data?.teachers?.map((t: any) => ({
              value: t.teacherId ?? t.value,
              label: t.teacherName || t.label,
            })) || []
          }
          className='min-w-full'
        />
        <InputField
          label='Description'
          type='textarea'
          name='description'
          register={register}
          error={errors.description}
          inputProps={{ placeholder: 'Nhập ghi chú...', rows: 5 }}
          className='min-w-full'
        />
      </div>
      <button type='submit' className='bg-blue-400 text-white p-2 rounded-md'>
        {type === 'create' ? 'Create' : 'Update'}
      </button>
    </form>
  );
};

export default CourseForm;
