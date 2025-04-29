import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import InputField from '../InputField';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { formatDate } from '@utils/dateUtils';

const DEFAULT_AVATAR = '/avatar.png';

// Tạo schema bằng Zod
const baseTeacherSchema = {
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be at most 20 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(1, 'Name is required'),
  phoneNumber: z.string().min(1, 'Phone is required'),
  address: z.string().min(1, 'Address is required'),
  photo: z.any().optional(),
  dateOfBirth: z.string().min(1, 'Birthday is required'),
  gender: z.enum(['male', 'female'], { message: 'Sex is required!' }),

  specialization: z.string().min(1, 'Specialization is required'),
  experience: z.coerce.number().min(1, 'Experience is required'),
};

// Tạo TypeScript type từ schema Zod
const CreateTeacherSchema = z.object(baseTeacherSchema);

const UpdateTeacherSchema = z.object({
  ...baseTeacherSchema,
  userID: z.number(),
});

type CreateTeacherFormData = z.infer<typeof CreateTeacherSchema>;
type UpdateTeacherFormData = z.infer<typeof UpdateTeacherSchema>;

const TeacherForm = ({
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
  const tableNameDefault = t('form.table.teacher');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState('personalInformation');
  const [existingPhotoPath, setExistingPhotoPath] = useState<string>('');
  const [photoPath, setPhotoPath] = useState<string>('');

  const schema = type === 'create' ? CreateTeacherSchema : UpdateTeacherSchema;

  // Set existing photo path if in edit mode
  useEffect(() => {
    if (type === 'update' && data?.photo) {
      setExistingPhotoPath(data.photo);
    }
  }, [type, data]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: data || {
      username: '',
      email: '',
      password: '',
      name: '',
      phoneNumber: '',
      address: '',
      photo: '',
      dateOfBirth: '',
      gender: '',
      specialization: '',
      experience: 0,
    },
  });

  const submitTeacher = async (formattedData: any) => {
    const url = type === 'create' ? '/teacher/add' : '/teacher/edit';

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
    formData: CreateTeacherFormData | UpdateTeacherFormData
  ) => {
    if (Object.keys(errors).length > 0) {
      console.error('Có lỗi validation:', errors);
      return;
    }

    try {
      const finalPhotoPath = selectedFile
        ? `/${selectedFile.name}`
        : existingPhotoPath || DEFAULT_AVATAR; // Sử dụng ảnh hiện tại hoặc ảnh mặc định

      const formattedData = {
        ...formData,
        photo: finalPhotoPath,
        dateOfBirth: formData.dateOfBirth
          ? formatDate(formData.dateOfBirth, 'yyyy-MM-dd')
          : '',
      };

      if (type === 'update' && data?.userID) {
        formattedData.userID = data.userID;
      }

      await submitTeacher(formattedData);
    } catch (error: any) {
      toast.error('Error processing form' + error.message);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPhotoPath(file.name); // Chỉ lấy tên file
    }
  };

  return (
    <form className='flex flex-col gap-8' onSubmit={handleSubmit(onSubmit)}>
      <h1 className='text-xl font-semibold'>
        {type === 'create'
          ? t('form.titles.add', { tableNameDefault })
          : t('form.titles.edit', { tableNameDefault })}
      </h1>
      <span className='text-xs text-gray-400 font-medium'>
        {t('form.teacher.sections.authenticationInformation')}
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
            inputProps={{
              readOnly: type === 'update',
              disabled: type === 'update',
            }}
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
            {t('form.teacher.sections.personalInformation')}
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
            {t('form.teacher.sections.professionalInformation')}
          </button>
        </span>
      </div>
      <div className='flex justify-between flex-wrap gap-4'>
        {activeTab === 'personalInformation' && (
          <>
            <div className='flex justify-between items-center flex-1 gap-8'>
              <InputField
                label={t('form.teacher.fullName')}
                name='name'
                register={register}
                error={errors.name}
                className='flex-1'
              />
              <InputField
                label={t('form.teacher.phone')}
                name='phoneNumber'
                register={register}
                error={errors.phoneNumber}
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
                label={t('form.teacher.uploadPhoto')}
                type='file'
                inputProps={{ accept: 'image/*' }}
                onFileChange={handleFileChange}
                name='photo'
                register={register}
                className='flex-1'
              />
            </div>
          </>
        )}

        {activeTab === 'professionalInformation' && (
          <>
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
