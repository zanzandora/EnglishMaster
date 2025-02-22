import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import InputField from '../InputField';

// Tạo schema bằng Zod
const StudentSchema = z.object({
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

// Tạo TypeScript type từ schema Zod
type StudentFormData = z.infer<typeof StudentSchema>;

const StudentForm = ({
  type,
  data,
}: {
  type: 'create' | 'update';
  data?: any;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StudentFormData>({
    resolver: zodResolver(StudentSchema),
    defaultValues: data || {
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

  const onSubmit = (formData: StudentFormData) => {
    console.log('Submitted Data:', formData);
    alert(type === 'create' ? 'Student Created!' : 'Student Updated!');
  };

  return (
    <form className='flex flex-col gap-8' onSubmit={handleSubmit(onSubmit)}>
      <h1 className='text-xl font-semibold'>
        {type === 'create' ? 'Create a new student' : 'Update student'}
      </h1>
      <span className='text-xs text-gray-400 font-medium'>
        Authentication Information
      </span>
      <div className='flex justify-between flex-wrap gap-4'>
        <InputField
          label='Username'
          name='username'
          register={register}
          error={errors.username}
        />
        <InputField
          label='Email'
          name='email'
          register={register}
          error={errors.email}
        />
        <InputField
          label='Password'
          name='password'
          type='password'
          register={register}
          error={errors.password}
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
        <div className='flex flex-col gap-2 w-full md:w-1/4'>
          <label className='text-xs text-gray-500'>Sex</label>
          <select
            className='ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full'
            {...register('sex')}
          >
            <option value=''>Select</option>
            <option value='male'>Male</option>
            <option value='female'>Female</option>
          </select>
          {errors.sex && (
            <p className='text-xs text-red-400'>{errors.sex.message}</p>
          )}
        </div>
      </div>
      <button className='bg-blue-400 text-white p-2 rounded-md'>
        {type === 'create' ? 'Create' : 'Update'}
      </button>
    </form>
  );
};

export default StudentForm;
