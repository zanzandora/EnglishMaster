import { useForm } from 'react-hook-form';
import { z } from 'zod'; // !validation schema
import { zodResolver } from '@hookform/resolvers/zod';
import InputField from '../InputField';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { toast } from 'react-toastify';
//* Định nghĩa schema bằng cách sử dụng z.object() để mô tả cấu trúc dữ liệu và điều kiện hợp lệ.
const LessonSchema = z.object({
  title: z.string().min(3, 'Name must be at least 3 characters'),
  type: z.string().min(1, 'type is required'),
  description: z.string().min(1, 'Description is required'),
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

  const schema = LessonSchema;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LessonFormData>({
    resolver: zodResolver(schema),
    defaultValues: data || {
      title: '',
      type: '',
      description: '',
      file: '',
    },
  });

  const submitLesson = async (formData: any) => {
    const url = type === 'create' ? '/lesson/add' : '/lesson/edit';

    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('type', formData.type);
    formDataToSend.append('description', formData.description);
    if (selectedFile) {
      formDataToSend.append('file', selectedFile);
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      toast.success(
        type === 'create'
          ? 'Lesson created successfully!'
          : 'Lesson updated successfully!'
      );
      onSuccess();
      if (setOpen) setOpen(false);
    } catch (error: any) {
      toast.error('❌ ' + error.message);
    }
  };

  const onSubmit = async (formData: LessonFormData) => {
    if (Object.keys(errors).length > 0) {
      console.error('Có lỗi validation:', errors);
      return;
    }

    try {
      const formattedData = {
        ...formData,
      };

      await submitLesson(formattedData);
    } catch (error: any) {
      toast.error('❌ Error processing form: ' + error.message);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      toast.info('✅ File selected:' + file.name);
    }
  };

  return (
    <form
      className='flex flex-col gap-8'
      onSubmit={handleSubmit(onSubmit)}
      encType='multipart/form-data'
    >
      <h1 className='text-xl font-semibold'>
        {type === 'create' ? 'Create a new Lesson' : 'Update Lesson'}
      </h1>
      <div className='flex gap-4 items-center justify-start space-x-4'>
        <span className='text-xs text-gray-400 font-medium'>
          Lesson Information
        </span>
      </div>
      <div className='flex justify-between flex-wrap gap-4'>
        <InputField
          label='Title'
          name='title'
          register={register}
          error={errors.title}
          className='min-w-full'
        />
        <InputField
          label='Lesson Type'
          name='type'
          register={register}
          error={errors.type}
        ></InputField>
        <InputField
          label='Upload file'
          type='file'
          inputProps={{ multiple: true }}
          onFileChange={handleFileChange}
          name='file'
          register={register}
          className='flex-1'
        />
        <InputField
          label='Description'
          type='textarea'
          name='description'
          register={register}
          error={errors.description}
          inputProps={{ placeholder: 'Nhập ghi chú...', rows: 5 }}
          className='min-w-full'
        />
      </div>
      <button className='bg-blue-400 text-white p-2 rounded-md'>
        {type === 'create' ? 'Create' : 'Update'}
      </button>
    </form>
  );
};

export default LessonForm;
