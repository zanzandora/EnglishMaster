import { useForm } from 'react-hook-form';
import { z } from 'zod'; // !valadiaton schema
import { zodResolver } from '@hookform/resolvers/zod';
import InputField from '../InputField';
import { useTranslation } from 'react-i18next';

//* Định nghĩa schema bằng cách sử dụng z.object() để mô tả cấu trúc dữ liệu và điều kiện hợp lệ.
const ClassSchema = z.object({
  className: z
    .string()
    .min(3, 'Class name must be at least 3 characters')
    .max(8, 'Class name must be at most 8 characters'),
  capacity: z.coerce.number().int().positive('Capacity is required'),
  startDate: z.string().min(10, 'Start date is required'),
  endDate: z.string().min(10, 'End date is required'),
  teacher: z.string().min(1, 'Teacher is required'),
  course: z.string().min(1, 'Course is required'),
});

// *Tạo TypeScript type từ schema Zod, giúp đồng bộ schema và type
type ClassFormData = z.infer<typeof ClassSchema>;

const ClassForm = ({
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
  } = useForm<ClassFormData>({
    // *Khi submit form, Zod sẽ tự động kiểm tra dữ liệu dựa trên ClassSchema.
    resolver: zodResolver(ClassSchema),
    defaultValues: data || {
      className: '',
      capacity: 0,
      startDate: '',
      endDate: '',
      teacher: '',
      course: '',
    },
  });

  const onSubmit = (formData: ClassFormData) => {
    console.log('Submitted Data:', formData);
    alert(type === 'create' ? 'Class Created!' : 'Class Updated!');
  };

  return (
    <form className='flex flex-col gap-8' onSubmit={handleSubmit(onSubmit)}>
      <h1 className='text-xl font-semibold'>
        {type === 'create' ? 'Create a new Class' : 'Update Class'}
      </h1>

      <div className='flex justify-between flex-wrap gap-4'>
        <InputField
          label='Class Name'
          name='className'
          register={register}
          error={errors.className}
          className='min-w-full'
        />
        <InputField
          label='Capicity'
          name='capicity'
          type='number'
          register={register}
          error={errors.capacity}
        />
        <InputField
          label='Start Date'
          name='startTime'
          type='date'
          register={register}
          error={errors.startDate}
        />
        <InputField
          label='End Date'
          name='endTime'
          type='date'
          register={register}
          error={errors.endDate}
        />
        <div className='flex flex-wrap gap-4 w-full justify-between order-1'>
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
            label='Course'
            name='course'
            register={register}
            error={errors.teacher}
          >
            <option value=''>{t('form.placeholders.select')}</option>
            <option value='TeacherA'>Course A</option>
            <option value='female'>Course B</option>
          </InputField>
          <InputField
            label=''
            name='e'
            register={register}
            error={errors.endDate}
            inputProps={{ disabled: true }}
            className=' invisible'
          />
        </div>
      </div>
      <button className='bg-blue-400 text-white p-2 rounded-md'>
        {type === 'create' ? 'Create' : 'Update'}
      </button>
    </form>
  );
};

export default ClassForm;
