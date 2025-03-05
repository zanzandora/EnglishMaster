import { useForm } from 'react-hook-form';
import { z } from 'zod'; // !valadiaton schema
import { zodResolver } from '@hookform/resolvers/zod';
import InputField from '../InputField';
import { useTranslation } from 'react-i18next';

//* Định nghĩa schema bằng cách sử dụng z.object() để mô tả cấu trúc dữ liệu và điều kiện hợp lệ.
const CourseSchema = z.object({
  courseName: z.string().min(3, 'Course name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  duration: z.coerce.number().int().positive('Duration is required'),
  fee: z.coerce.number().int().positive('Fee is required'),
  teacher: z.string().min(1, 'Teacher is required'),
});

// *Tạo TypeScript type từ schema Zod, giúp đồng bộ schema và type
type CourseFormData = z.infer<typeof CourseSchema>;

const CourseForm = ({
  type,
  data,
}: {
  type: 'create' | 'update';
  data?: any;
}) => {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CourseFormData>({
    // *Khi submit form, Zod sẽ tự động kiểm tra dữ liệu dựa trên StudentSchema.
    resolver: zodResolver(CourseSchema),
    defaultValues: data || {
      // *defaultValues: Đặt giá trị mặc định cho các input trên form.
      courseName: '',
      description: '',
      duration: 0,
      fee: 0,
      teacher: '',
    },
  });

  const onSubmit = (formData: CourseFormData) => {
    console.log('Submitted Data:', formData);
    alert(type === 'create' ? 'Course Created!' : 'Course Updated!');
  };

  return (
    <form className='flex flex-col gap-8' onSubmit={handleSubmit(onSubmit)}>
      <h1 className='text-xl font-semibold'>
        {type === 'create' ? 'Create a new Course' : 'Update Course'}
      </h1>

      <div className='flex justify-between flex-wrap gap-4'>
        <InputField
          label='Course Name'
          name='courseName'
          register={register}
          error={errors.courseName}
          className='min-w-full'
        />
        <InputField
          label='Teacher in charge'
          name='teahcerInCharge'
          register={register}
          error={errors.teacher}
        >
          <option value=''>{t('form.placeholders.select')}</option>
          <option value='TeacherA'>Teacher A</option>
          <option value='female'>Teacher B</option>
        </InputField>
        <InputField
          label='Fee'
          name='fee'
          register={register}
          error={errors.fee}
        />

        <InputField
          label='Duration'
          type='number'
          name='duration'
          register={register}
          error={errors.duration}
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
      <button className='bg-blue-400 text-white p-2 rounded-md'>
        {type === 'create' ? 'Create' : 'Update'}
      </button>
    </form>
  );
};

export default CourseForm;
