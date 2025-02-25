import { useForm } from 'react-hook-form';
import { z } from 'zod'; // !valadiaton schema
import { zodResolver } from '@hookform/resolvers/zod';
import InputField from '../InputField';
import { useTranslation } from 'react-i18next';

//* Định nghĩa schema bằng cách sử dụng z.object() để mô tả cấu trúc dữ liệu và điều kiện hợp lệ.
const LesonSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be at most 20 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().min(1, 'Phone is required'),
  address: z.string().min(1, 'Address is required'),
  bloodType: z.string().min(1, 'Blood Type is required'),
  birthday: z.string().min(1, 'Birthday is required'),
  sex: z.enum(['male', 'female'], { message: 'Sex is required!' }),
});

// *Tạo TypeScript type từ schema Zod, giúp đồng bộ schema và type
type LesonFormData = z.infer<typeof LesonSchema>;

const LesonForm = ({
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
  } = useForm<LesonFormData>({
    // *Khi submit form, Zod sẽ tự động kiểm tra dữ liệu dựa trên StudentSchema.
    resolver: zodResolver(LesonSchema),
    defaultValues: data || {
      // *defaultValues: Đặt giá trị mặc định cho các input trên form.
      username: '',
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      phone: '',
      address: '',
      bloodType: '',
      birthday: '',
      sex: '',
    },
  });

  const onSubmit = (formData: LesonFormData) => {
    console.log('Submitted Data:', formData);
    alert(type === 'create' ? 'Leson Created!' : 'Leson Updated!');
  };

  return (
    <form className='flex flex-col gap-8' onSubmit={handleSubmit(onSubmit)}>
      <h1 className='text-xl font-semibold'>
        {type === 'create' ? 'Create a new Leson' : 'Update Leson'}
      </h1>
      <span className='text-xs text-gray-400 font-medium'>
        Authentication Information
      </span>
      <div className='flex justify-between flex-wrap gap-4'>
        <div className='flex justify-between items-center flex-1 gap-8'>
          <InputField
            label='Username'
            name='username'
            register={register}
            error={errors.username}
            className='flex-1 '
          />
          <InputField
            label='Password'
            name='password'
            type='password'
            register={register}
            error={errors.password}
            className='flex-1'
          />
        </div>
        <InputField
          label='Email'
          name='email'
          register={register}
          error={errors.email}
          className='min-w-full'
        />
      </div>
      <span className='text-xs text-gray-400 font-medium'>
        Personal Information
      </span>
      <div className='flex justify-between flex-wrap gap-4'>
        <InputField
          label='First Name'
          name='firstName'
          register={register}
          error={errors.firstName}
        />
        <InputField
          label='Last Name'
          name='lastName'
          register={register}
          error={errors.lastName}
        />
        <InputField
          label='Phone'
          name='phone'
          register={register}
          error={errors.phone}
        />
        <InputField
          label='Address'
          name='address'
          register={register}
          error={errors.address}
        />
        <InputField
          label='Blood Type'
          name='bloodType'
          register={register}
          error={errors.bloodType}
        />
        <InputField
          label='Birthday'
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
      <button className='bg-blue-400 text-white p-2 rounded-md'>
        {type === 'create' ? 'Create' : 'Update'}
      </button>
    </form>
  );
};

export default LesonForm;
