import { useForm } from 'react-hook-form';
import { z } from 'zod'; // !validation schema
import { zodResolver } from '@hookform/resolvers/zod';
import InputField from '../InputField';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';

//* Định nghĩa schema bằng cách sử dụng z.object() để mô tả cấu trúc dữ liệu và điều kiện hợp lệ.
const LessonSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(10, 'Title must be at most 10 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  class: z.string().min(1, 'Class is required'),
  teacher: z.string().min(1, 'Teacher is required'),
  course: z.string().min(1, 'Course is required'),
  file: z.any().optional(),
});

// *Tạo TypeScript type từ schema Zod, giúp đồng bộ schema và type
type LessonFormData = z.infer<typeof LessonSchema>;

const LessonForm = ({
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState('lessonInformation');
  const [existingFilePath, setExistingFilePath] = useState<string>('');

  const schema = LessonSchema;

  // Set existing file path if in edit mode
  useEffect(() => {
    if (type === 'update' && data?.file) {
      setExistingFilePath(data.file);
    }
  }, [type, data]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LessonFormData>({
    resolver: zodResolver(schema),
    defaultValues: data || {
      title: '',
      description: '',
      class: '',
      teacher: '',
      course: '',
      file: '',
    },
  });

  const submitLesson = async (formattedData: any) => {
    const url = type === 'create' ? '/lesson/add' : '/lesson/edit';

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

      alert(type === 'create' ? 'Lesson Created!' : 'Lesson Updated!');

      if (onSuccess) {
        onSuccess();
      }

      if (setOpen) {
        setOpen(false);
      }
    } catch (error: any) {
      alert('❌ ' + error.message);
    }
  };

  const onSubmit = async (formData: LessonFormData) => {
    if (Object.keys(errors).length > 0) {
      console.error('Có lỗi validation:', errors);
      return;
    }

    try {
      // const finalFilePath = selectedFile
      //   ? `/${selectedFile.name}`
      //   : existingFilePath;

      const formattedData = {
        ...formData,
      };

      await submitLesson(formattedData);
    } catch (error: any) {
      alert('Error processing form' + error.message);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      console.log('✅ File selected:', file.name);
    }
  };

  return (
    <form className='flex flex-col gap-8' onSubmit={handleSubmit(onSubmit)}>
      <h1 className='text-xl font-semibold'>
        {type === 'create' ? 'Create a new Lesson' : 'Update Lesson'}
      </h1>
      <div className='flex gap-4 items-center justify-start space-x-4'>
        <span className='text-xs text-gray-400 font-medium'>
          <button
            type='button'
            className={` ${
              activeTab === 'lessonInformation'
                ? 'border-b-2 border-blue-500'
                : ''
            }`}
            onClick={() => setActiveTab('lessonInformation')}
          >
            Lesson Information
          </button>
        </span>
      </div>
      <div className='flex justify-between flex-wrap gap-4'>
        {activeTab === 'lessonInformation' && (
          <>
            <InputField
              label='Title'
              name='title'
              register={register}
              error={errors.title}
              className='min-w-full'
            />
            <InputField
              label='Teacher'
              name='teacher'
              register={register}
              error={errors.teacher}
            >
              <option value=''>{t('form.placeholders.select')}</option>
              <option value='TeacherA'>Teacher A</option>
              <option value='TeacherB'>Teacher B</option>
            </InputField>
            <InputField
              label='Class'
              name='class'
              register={register}
              error={errors.class}
            >
              <option value=''>{t('form.placeholders.select')}</option>
              <option value='ClassA'>Class A</option>
              <option value='ClassB'>Class B</option>
            </InputField>
            <InputField
              label='Course'
              name='course'
              register={register}
              error={errors.course}
            >
              <option value=''>{t('form.placeholders.select')}</option>
              <option value='CourseA'>Course A</option>
              <option value='CourseB'>Course B</option>
            </InputField>
            <InputField
              label='Description'
              name='description'
              type='textarea'
              register={register}
              error={errors.description}
              inputProps={{ rows: 5, placeholder: 'Nhập ghi chú...' }}
              className='min-w-full'
            />
            <InputField
              label='Upload file'
              type='file'
              inputProps={{ multiple: true }}
              onFileChange={handleFileChange}
              name='file'
              register={register}
              className='flex-1'
            />
          </>
        )}
      </div>
      <button className='bg-blue-400 text-white p-2 rounded-md'>
        {type === 'create' ? 'Create' : 'Update'}
      </button>
    </form>
  );
};

export default LessonForm;
