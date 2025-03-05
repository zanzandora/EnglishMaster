import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import InputField from '../InputField';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import FileUploadModal from '../FileUploadModal';

// Tạo schema bằng Zod
const TeacherSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be at most 20 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  fullName: z.string().min(1, 'Name is required'),
  phone: z.string().min(1, 'Phone is required'),
  address: z.string().min(1, 'Address is required'),
  photo: z.string().min(1, 'Photo is required'),
  dateOfBirth: z.string().min(1, 'Birthday is required'),
  gender: z.enum(['male', 'female'], { message: 'Sex is required!' }),

  qualification: z.string().min(1, 'Qualification is required'),
  specialization: z.string().min(1, 'Specialization is required'),
  experience: z.number().min(1, 'Experience is required'),
});

// Tạo TypeScript type từ schema Zod
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
    resolver: zodResolver(TeacherSchema),
    defaultValues: data || {
      username: '',
      email: '',
      password: '',
      fullName: '',
      phone: '',
      address: '',
      photo: '',
      dateOfBirth: '',
      gender: '',
      qualification: '',
      specialization: '',
      experience: 0,
    },
  });

  const [activeTab, setActiveTab] = useState('personalInformation');

  const onSubmit = (formData: TeacherFormData) => {
    console.log('Submitted Data:', formData);
    alert(type === 'create' ? 'Teacher Created!' : 'Teacher Updated!');
  };
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
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
          label={t('form.teacher.email')}
          name='email'
          register={register}
          error={errors.email}
          className='min-w-full'
        />
      </div>
      <div className='flex gap-4 items-center justify-start space-x-4'>
        <span className='text-xs text-gray-400 font-medium'>
          <button
            type='button'
            className={` ${
              activeTab === 'personalInformation'
                ? 'border-b-2 border-blue-500'
                : ''
            }`}
            onClick={() => setActiveTab('personalInformation')}
          >
            {t('form.sections.personalInformation')}
          </button>
        </span>
        <span className='text-xs text-gray-400 font-medium'>
          <button
            type='button'
            className={` ${
              activeTab === 'professionalInformation'
                ? 'border-b-2 border-blue-500'
                : ''
            }`}
            onClick={() => setActiveTab('professionalInformation')}
          >
            Professional Information
          </button>
        </span>
      </div>
      <div className='flex justify-between flex-wrap gap-4'>
        {activeTab === 'personalInformation' && (
          <>
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
              <div className='mt-5'>
                <FileUploadModal />
              </div>
            </div>
          </>
        )}

        {activeTab === 'professionalInformation' && (
          <>
            <InputField
              label={t('form.teacher.qualification')}
              name='qualification'
              register={register}
              error={errors.qualification}
              className='min-w-full'
            />
            <InputField
              label={t('form.teacher.specialization')}
              name='specialization'
              register={register}
              error={errors.specialization}
              className='min-w-full'
            />
            <InputField
              label={t('form.teacher.experience')}
              type='number'
              name='experience'
              register={register}
              error={errors.experience}
            />
          </>
        )}
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
