import { useForm } from 'react-hook-form';
import { z } from 'zod'; // !validation schema
import { zodResolver } from '@hookform/resolvers/zod';
import InputField from '../InputField';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
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
  const tableNameDefault = t('form.table.lesson');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState('lessonInformation');

  const schema = LessonSchema;

  useEffect(() => {
    if (type === 'update' && data?.file) {
      setSelectedFile(null); // Reset the selected file when editing
    }
  }, [data, type]);

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
    if (type === 'update' && formData?.id) {
      formDataToSend.append('id', formData.id);
    }
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
          ? t('orther.toast.create', { tableNameDefault })
          : t('orther.toast.update', { tableNameDefault })
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
      if (type === 'update' && data?.id) {
        formData.id = data.id;
      }
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
        {type === 'create'
          ? t('form.titles.add', { tableNameDefault })
          : t('form.titles.edit', { tableNameDefault })}
      </h1>
      <div className='flex justify-between flex-wrap gap-4'>
        <InputField
          label={t('form.lesson.title')}
          name='title'
          register={register}
          error={errors.title}
          className='min-w-full'
        />
        <InputField
          label={t('form.lesson.type')}
          name='type'
          register={register}
          error={errors.type}
        ></InputField>
        {type === 'create' && (
          <InputField
            label={t('form.lesson.file')}
            type='file'
            inputProps={{ multiple: true }}
            onFileChange={handleFileChange}
            name='file'
            register={register}
            className='flex-1'
          />
        )}
        <InputField
          label={t('form.lesson.description')}
          type='textarea'
          name='description'
          register={register}
          error={errors.description}
          inputProps={{
            placeholder: t('form.placeholders.description'),
            rows: 5,
          }}
          className='min-w-full'
        />
      </div>
      <button className='bg-blue-400 text-white p-2 rounded-md'>
        {type === 'create'
          ? t('form.actions.create')
          : t('form.actions.update')}
      </button>
    </form>
  );
};

export default LessonForm;
