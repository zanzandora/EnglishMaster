import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import InputField from '../InputField';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

// Tạo schema bằng Zod
const StudentSchema = z.object({
  email: z.string().email('Invalid email address'),
  fullName: z.string().min(1, 'Name is required'),
  phone: z.string().min(1, 'Phone is required'),
  address: z.string().min(1, 'Address is required'),
  photo: z.string().min(1, 'Photo is required'),
  dateOfBirth: z.string().min(1, 'Birthday is required'),
  gender: z.enum(['male', 'female'], { message: 'Sex is required!' }),
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
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StudentFormData>({
    resolver: zodResolver(StudentSchema),
    defaultValues: data || {
      email: '',
      fullName: '',
      phone: '',
      address: '',
      photo: '',
      dateOfBirth: '',
      gender: '',
    },
  });

  const onSubmit = (formData: StudentFormData) => {
    console.log('Submitted Data:', formData);
    alert(type === 'create' ? 'Student Created!' : 'Student Updated!');
  };
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  return (
    <form className='flex flex-col gap-8' onSubmit={handleSubmit(onSubmit)}>
      <h1 className='text-xl font-semibold'>
        {type === 'create'
          ? t('form.student.titleAdd')
          : t('form.student.titleEdit')}
      </h1>
      <span className='text-xs text-gray-400 font-medium'>
        {t('form.sections.authenticationInformation')}
      </span>
      <div className='flex flex-wrap gap-4'>
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
            name='fullName'
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
            name='dateOfBirth'
            type='date'
            register={register}
            error={errors.dateOfBirth}
          />
          <InputField
            label={t('form.teacher.sex')}
            name='gender'
            register={register}
            error={errors.gender}
          >
            <option value=''>{t('form.placeholders.select')}</option>
            <option value='male'>{t('form.options.male')}</option>
            <option value='female'>{t('form.options.female')}</option>
          </InputField>
          <InputField
            label='Upload photo'
            type='file'
            inputProps={{ accept: 'image/*' }}
            onFileChange={(file) => setSelectedFile(file)} // Cập nhật state
            name='photo'
            register={register}
            className='flex-1'
          />
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

export default StudentForm;
