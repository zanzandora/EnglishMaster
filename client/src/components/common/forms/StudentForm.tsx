import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import InputField from '../InputField';

// Định nghĩa interface cho dữ liệu form
interface StudentFormData {
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

interface StudentErrors {
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

const validateStudent = (data: StudentFormData): StudentErrors => {
  const errors: StudentErrors = {};

  if (
    !data.username ||
    data.username.trim() === '' ||
    data.username.length < 3 ||
    data.username.length > 20
  ) {
    errors.username = 'Username must be between 3 and 20 characters';
  }
  if (
    !data.email ||
    data.email.trim() === '' ||
    !/\S+@\S+\.\S+/.test(data.email)
  ) {
    errors.email = 'Invalid email address';
  }
  if (
    !data.password ||
    data.password.trim() === '' ||
    data.password.length < 8
  ) {
    errors.password = 'Password must be at least 8 characters long';
  }
  if (!data.firstName || data.firstName.trim() === '') {
    errors.firstName = 'First name is required';
  }
  if (!data.lastName || data.lastName.trim() === '') {
    errors.lastName = 'Last name is required';
  }
  if (!data.phone || data.phone.trim() === '') {
    errors.phone = 'Phone is required';
  }
  if (!data.address || data.address.trim() === '') {
    errors.address = 'Address is required';
  }
  if (!data.bloodType || data.bloodType.trim() === '') {
    errors.bloodType = 'Blood Type is required';
  }
  if (!data.birthday || data.birthday.trim() === '') {
    errors.birthday = 'Birthday is required';
  }
  if (!data.sex || data.sex.trim() === '') {
    errors.sex = 'Sex is required';
  }
  if (!data.img || data.img.length === 0) {
    errors.img = 'Image is required';
  }

  return errors;
};

const StudentForm = ({
  type,
  data,
}: {
  type: 'create' | 'update';
  data?: Partial<StudentFormData>;
}) => {
  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors },
  } = useForm<StudentFormData>({
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

  const [localErrors, setLocalErrors] = useState<StudentErrors>({});

  const onSubmit = (formData: StudentFormData) => {
    // Kiểm tra tất cả lỗi bằng validateStudent
    const validationErrors = validateStudent(formData);

    // Nếu có lỗi, lưu lỗi vào localErrors
    if (Object.keys(validationErrors).length > 0) {
      setLocalErrors(validationErrors);

      // Đồng thời cập nhật lỗi lên React Hook Form để hiển thị ban đầu
      Object.entries(validationErrors).forEach(([key, message]) => {
        setError(key as keyof StudentFormData, { message, type: 'manual' });
      });

      // Dừng submit nếu có lỗi
      return;
    }

    // Nếu không có lỗi, gửi dữ liệu
    fetch(`/api/students`, {
      method: type === 'create' ? 'POST' : 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (response.ok) {
          alert(type === 'create' ? 'Student Created!' : 'Student Updated!');
        } else {
          alert('Something went wrong');
        }
      })
      .catch((error) => console.error('Error:', error));
  };

  // Cập nhật  khi nhập liệu và xóa khỏi localErrors khi input đã nhập đúng
  useEffect(() => {
    const subscription = watch((value, { name }) => {
      // Kiểm tra lại lỗi khi nhập liệu
      const newErrors = validateStudent(value);

      // Nếu input đang nhập không còn lỗi, xóa khỏi localErrors
      if (name && !newErrors[name]) {
        setLocalErrors((prevErrors) => {
          const updatedErrors = { ...prevErrors };
          delete updatedErrors[name as keyof StudentFormData];
          return updatedErrors;
        });
      }
    });

    return () => subscription.unsubscribe();
  }, [watch]);

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
          error={errors.username || localErrors.username}
        />
        <InputField
          label='Email'
          name='email'
          register={register}
          error={errors.email || localErrors.email}
        />
        <InputField
          label='Password'
          name='password'
          type='password'
          register={register}
          error={errors.password || localErrors.password}
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
          error={errors.firstName || localErrors.firstName}
        />
        <InputField
          label='Last Name'
          name='lastName'
          register={register}
          error={errors.lastName || localErrors.lastName}
        />
        <InputField
          label='Phone'
          name='phone'
          register={register}
          error={errors.phone || localErrors.phone}
        />
        <InputField
          label='Address'
          name='address'
          register={register}
          error={errors.address || localErrors.address}
        />
        <InputField
          label='Blood Type'
          name='bloodType'
          register={register}
          error={errors.bloodType || localErrors.bloodType}
        />
        <InputField
          label='Birthday'
          name='birthday'
          type='date'
          register={register}
          error={errors.birthday || localErrors.birthday}
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
            <p className='text-xs text-red-400'>
              {errors.sex.message || localErrors.sex}
            </p>
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
