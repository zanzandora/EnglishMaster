import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import InputField from '../InputField';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { formatDate } from '@utils/dateUtils';
import { toast } from 'react-toastify';

const DEFAULT_AVATAR = '/avatar.png';

// Create a more flexible schema to accommodate both create and update
const baseStudentSchema = {
  email: z.string().email('Invalid email address'),
  name: z.string().min(1, 'Name is required'),
  phoneNumber: z.string().min(1, 'Phone is required'),
  address: z.string().min(1, 'Address is required'),
  dateOfBirth: z.string().min(1, 'Birthday is required'),
  gender: z.enum(['male', 'female'], { message: 'Sex is required!' }),
  photo: z.any().optional(), // Add photo field to schema
};

// Create schema - doesn't require ID
const CreateStudentSchema = z.object(baseStudentSchema);

// Update schema - requires ID
const UpdateStudentSchema = z.object({
  ...baseStudentSchema,
  id: z.number(),
});

// Tạo TypeScript type từ schema Zod
type CreateStudentFormData = z.infer<typeof CreateStudentSchema>;
type UpdateStudentFormData = z.infer<typeof UpdateStudentSchema>;

const StudentForm = ({
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
  const tableNameDefault = t('form.table.student');

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [existingPhotoPath, setExistingPhotoPath] = useState<string>('');
  const [photoPath, setPhotoPath] = useState<string>('');

  // Choose the appropriate schema based on form type
  const schema = type === 'create' ? CreateStudentSchema : UpdateStudentSchema;

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
      email: '',
      name: '',
      phoneNumber: '',
      address: '',
      photo: '',
      dateOfBirth: '',
      gender: '',
    },
  });

  const submitStudent = async (formattedData: any) => {
    const url = type === 'create' ? '/student/add' : '/student/edit';

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
        onSuccess(); // Cập nhật danh sách sinh viên ngay sau khi thêm/sửa
      }

      if (setOpen) {
        setOpen(false); // Đóng form sau khi thêm/sửa thành công
      }
    } catch (error: any) {
      toast.error('❌ ' + error.message);
    }
  };

  const onSubmit = async (
    formData: CreateStudentFormData | UpdateStudentFormData
  ) => {
    if (Object.keys(errors).length > 0) {
      console.error('Có lỗi validation:', errors);
      return;
    }

    try {
      const finalPhotoPath = selectedFile
        ? `/${selectedFile.name}`
        : existingPhotoPath || DEFAULT_AVATAR;

      const formattedData = {
        ...formData,
        photo: finalPhotoPath,
        dateOfBirth: formData.dateOfBirth
          ? formatDate(formData.dateOfBirth, 'yyyy-MM-dd')
          : '',
      };

      if (type === 'update' && data?.id) {
        formattedData.id = data.id;
      }

      // console.log('Formatted data being submitted:', formattedData);
      await submitStudent(formattedData);
    } catch (error: any) {
      toast.error('Error processing form' + error.message);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPhotoPath(file.name); // Chỉ lấy tên file
      console.log('✅ File selected:', file.name);
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
      </div>
      <button type='submit' className='bg-blue-400 text-white p-2 rounded-md'>
        {type === 'create'
          ? t('form.actions.create')
          : t('form.actions.update')}
      </button>
    </form>
  );
};

export default StudentForm;
