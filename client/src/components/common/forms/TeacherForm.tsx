import { useForm } from 'react-hook-form';
import { z } from 'zod'; // !valadiaton schema
import { zodResolver } from '@hookform/resolvers/zod';
import InputField from '../InputField';
import { useTranslation } from 'react-i18next';

//* Định nghĩa schema bằng cách sử dụng z.object() để mô tả cấu trúc dữ liệu và điều kiện hợp lệ.
const TeacherSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be at most 20 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  fullName: z.string().min(1, 'Full name is required'),
  phone: z.string().min(1, 'Phone is required'),
  address: z.string().min(1, 'Address is required'),
  birthday: z.string().min(1, 'Birthday is required'),
  sex: z.enum(['male', 'female'], { message: 'Sex is required!' }),
});

// *Tạo TypeScript type từ schema Zod, giúp đồng bộ schema và type
type TeacherFormData = z.infer<typeof TeacherSchema>;

const TeacherForm = ({
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
  } = useForm<TeacherFormData>({
    // *Khi submit form, Zod sẽ tự động kiểm tra dữ liệu dựa trên teacherSchema.
    resolver: zodResolver(TeacherSchema),
    defaultValues: data || {
      // *defaultValues: Đặt giá trị mặc định cho các input trên form.
      username: '',
      email: '',
      password: '',
      fullName: '',
      phone: '',
      address: '',
      bloodType: '',
      birthday: '',
      sex: '',
    },
  });

  const onSubmit = (formData: TeacherFormData) => {
    console.log('Submitted Data:', formData);
    alert(type === 'create' ? 'Teacher Created!' : 'Teacher Updated!');
  };

  return (
    <form className='flex flex-col gap-8' onSubmit={handleSubmit(onSubmit)}>
      <h1 className='text-xl font-semibold'>
        {type === 'create'
          ? t('form.teacher.titleAdd')
          : t('form.teacher.titleEdit')}
      </h1>
      <span className='text-xs text-gray-400 font-medium'>
        {t('form.sections.authenticationInformation')}
      </span>
      <div className='flex flex-wrap gap-4'>
        <div className='flex justify-between items-center flex-1 gap-8'>
          <InputField
            label={t('form.teacher.username')}
            name='username'
            register={register}
            error={errors.username}
            className='flex-1 '
          />
          <InputField
            label={t('form.teacher.password')}
            name='password'
            type='password'
            register={register}
            error={errors.password}
            className='flex-1'
          />
        </div>
        <InputField
          label={t('form.teacher.email')}
          name='email'
          register={register}
          error={errors.email}
          className='min-w-full'
        />
      </div>
      <span className='text-xs text-gray-400 font-medium'>
        {t('form.sections.personalInformation')}
      </span>
      <div className='flex justify-between flex-wrap gap-4'>
        <div className='flex justify-between items-center flex-1 gap-8'>
          <InputField
            label={t('form.teacher.fullName')}
            name='firstName'
            register={register}
            error={errors.fullName}
            className='flex-1'
          />
          <InputField
            label={t('form.teacher.phone')}
            name='phone'
            register={register}
            error={errors.phone}
            className='flex-1'
          />
        </div>
        <InputField
          label={t('form.teacher.address')}
          name='address'
          register={register}
          error={errors.address}
          className='min-w-full'
        />
        <div className='flex gap-4 items-center justify-start min-w-full'>
          <InputField
            label={t('form.teacher.birthday')}
            name='birthday'
            type='date'
            register={register}
            error={errors.birthday}
          />
          <InputField
            label={t('form.teacher.sex')}
            name='sex'
            register={register}
            error={errors.sex}
          >
            <option value=''>{t('form.placeholders.select')}</option>
            <option value='male'>{t('form.options.male')}</option>
            <option value='female'>{t('form.options.female')}</option>
          </InputField>
        </div>
      </div>
      <button className='bg-blue-400 text-white p-2 rounded-md'>
        {type === 'create'
          ? t('form.actions.create')
          : t('form.actions.update')}
      </button>
    </form>
  );
};

export default TeacherForm;
