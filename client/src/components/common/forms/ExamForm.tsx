import { useForm } from 'react-hook-form';
import { z } from 'zod'; // !validation schema
import { zodResolver } from '@hookform/resolvers/zod';
import InputField from '../InputField';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import useFetchClasses from 'hooks/useFetchClasses';
import { toast } from 'react-toastify';

//* Định nghĩa schema bằng cách sử dụng z.object() để mô tả cấu trúc dữ liệu và điều kiện hợp lệ.
const ExamSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  classID: z.string().min(1, 'Class is required'),
  file: z.any().optional(),
});

// *Tạo TypeScript type từ schema Zod, giúp đồng bộ schema và type
type ExamFormData = z.infer<typeof ExamSchema>;

const ExamForm = ({
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
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ExamFormData>({
    // *Khi submit form, Zod sẽ tự động kiểm tra dữ liệu dựa trên ExamSchema.
    resolver: zodResolver(ExamSchema),
    defaultValues: data || {
      // *defaultValues: Đặt giá trị mặc định cho các input trên form.
      title: '',
      classID: '',
      file: '',
    },
  });
  const { classes } = useFetchClasses();

  const submitLesson = async (formData: any) => {
    const url = type === 'create' ? '/exam/add' : '/exam/edit';

    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('classID', formData.classID);
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
          ? 'Exam created successfully!'
          : 'Exam updated successfully!'
      );
      onSuccess();
      if (setOpen) setOpen(false);
    } catch (error: any) {
      toast.error('❌ ' + error.message);
    }
  };

  const onSubmit = async (formData: ExamFormData) => {
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
      alert('Error processing form' + error.message);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      toast.info('✅ File selected:' + file.name);
    }
  };

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  return (
    <form
      className='flex flex-col gap-8'
      onSubmit={handleSubmit(onSubmit)}
      encType='multipart/form-data'
    >
      <h1 className='text-xl font-semibold'>
        {type === 'create' ? 'Create a new Exam' : 'Update Exam'}
      </h1>
      <div className='flex justify-between flex-wrap gap-4'>
        <InputField
          label='Exam name'
          name='title'
          register={register}
          error={errors.title}
          className='min-w-full'
        />

        <InputField
          label='Class'
          name='classID'
          register={register}
          error={errors.classID}
        >
          <option value=''>{t('form.placeholders.select')}</option>
          {classes.map((classItem) => (
            <option key={classItem.id} value={classItem.id}>
              {classItem.name}
            </option>
          ))}
        </InputField>

        <InputField
          label='Upload file'
          type='file'
          inputProps={{ multiple: true }}
          onFileChange={handleFileChange}
          name='file'
          register={register}
          className='flex-1'
        />
      </div>
      <button className='bg-blue-400 text-white p-2 rounded-md'>
        {type === 'create' ? 'Create' : 'Update'}
      </button>
    </form>
  );
};

export default ExamForm;
