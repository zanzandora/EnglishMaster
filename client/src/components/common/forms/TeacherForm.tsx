import { useForm } from 'react-hook-form';
import InputField from '../InputField';

// Định nghĩa interface cho dữ liệu form
interface TeacherFormData {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  bloodType: string;
  birthday: string;
  sex: 'male' | 'female' | '';
  img: FileList | null;
}

interface TeacherErrors {
  username?: string;
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  bloodType?: string;
  birthday?: string;
  sex?: string;
  img?: string;
}

const validateTeacher = (data: TeacherFormData): TeacherErrors => {
  const errors: TeacherErrors = {};

  if (!data.username || data.username.length < 3 || data.username.length > 20) {
    errors.username = 'Username must be between 3 and 20 characters';
  }
  if (!data.email || !/\S+@\S+\.\S+/.test(data.email)) {
    errors.email = 'Invalid email address';
  }
  if (!data.password || data.password.length < 8) {
    errors.password = 'Password must be at least 8 characters long';
  }
  if (!data.firstName) errors.firstName = 'First name is required';
  if (!data.lastName) errors.lastName = 'Last name is required';
  if (!data.phone) errors.phone = 'Phone is required';
  if (!data.address) errors.address = 'Address is required';
  if (!data.bloodType) errors.bloodType = 'Blood Type is required';
  if (!data.birthday) errors.birthday = 'Birthday is required';
  if (!data.sex) errors.sex = 'Sex is required';
  if (!data.img) errors.img = 'Image is required';

  return errors;
};

const TeacherForm = ({
  type,
  data,
}: {
  type: 'create' | 'update';
  data?: Partial<TeacherFormData>;
}) => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<TeacherFormData>({
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
      img: null,
    },
  });

  const onSubmit = async (formData: TeacherFormData) => {
    const validationErrors = validateTeacher(formData);
    if (Object.keys(validationErrors).length > 0) {
      Object.entries(validationErrors).forEach(([key, message]) => {
        setError(key as keyof TeacherFormData, { message });
      });
    } else {
      const response = await fetch(`/api/Teachers`, {
        method: type === 'create' ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert(type === 'create' ? 'Teacher Created!' : 'Teacher Updated!');
      } else {
        alert('Something went wrong');
      }
    }
  };

  return (
    <form className='flex flex-col gap-8'>
      <h1 className='text-xl font-semibold'>
        {type === 'create' ? 'Create a new Teacher' : 'Update Teacher'}
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

export default TeacherForm;
