import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import InputField from '../InputField';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import TeacherSelect from '@components/common/select/TeacherSelect';

// Định nghĩa schema bằng cách sử dụng z.object() để mô tả cấu trúc dữ liệu và điều kiện hợp lệ.
const baseCourseSchema = {
  name: z.string().min(3, 'Course name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  duration: z.coerce.number().int().positive('Duration is required'),
  fee: z.coerce.number().int().positive('Fee is required'),
  teachers: z
    .array(
      z.object({
        teacherId: z.number(),
        teacherName: z.string().optional(),
      })
    )
    .min(1, 'Teachers is required'),
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
  const tableNameDefault = t('form.table.course');

  const schema = type === 'create' ? CreateCourseSchema : UpdateCourseSchema;

  const {
    register,
    handleSubmit,
    control,
    trigger,
    formState: { errors, dirtyFields },
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
        const errorText = await response.text();
        throw new Error(errorText);
      }

      toast.success(
        type === 'create'
          ? t('orther.toast.create', { tableNameDefault })
          : t('orther.toast.update', { tableNameDefault })
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
      }

      // Tạo object dữ liệu để gửi đi
      const dataToSubmit = { ...formData };
      console.log('🚀 Raw Form Data:', dataToSubmit);

      // !Nếu teachers không thay đổi, giữ nguyên danh sách cũ
      if (!dirtyFields.teachers) {
        dataToSubmit.teachers =
          data?.teachers?.map((t: any) => t.teacherId) || [];
      } else {
        // !Nếu có thay đổi, chỉ lấy danh sách teacherId từ formData
        dataToSubmit.teachers = formData.teachers.map(
          (t: any) => t.teacherId || t
        );
      }
      console.log('🚀 Before submit Form Data:', dataToSubmit);

      await submitCourse(dataToSubmit);
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

      <div className='flex justify-between flex-wrap gap-4'>
        <InputField
          label={t('form.course.name')}
          name='name'
          register={register}
          error={errors.name}
          className='min-w-full'
        />

        <InputField
          label={t('form.course.fee') + ' ' + t('orther.parValues')}
          name='fee'
          register={register}
          error={errors.fee}
          inputProps={{ pattern: '\\d*', inputMode: 'numeric' }}
        />

        <InputField
          label={t('form.course.duration')}
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
            data?.teachers?.map((t) => ({
              teacherId: t.teacherId,
              teacherName: t.teacherName,
            })) || []
          }
          className='min-w-full'
        />
        <InputField
          label={t('form.course.description')}
          type='textarea'
          name='description'
          register={register}
          error={errors.description}
          inputProps={{
            placeholder: t('form.placeholders.description'),
            rows: 5,
          }}
          className='min-w-full'
        />
      </div>
      <button type='submit' className='bg-blue-400 text-white p-2 rounded-md'>
        {type === 'create'
          ? t('form.actions.create')
          : t('form.actions.update')}
      </button>
    </form>
  );
};

export default CourseForm;
