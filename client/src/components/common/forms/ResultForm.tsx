import { useForm } from 'react-hook-form';
import { z } from 'zod'; // !validation schema
import { zodResolver } from '@hookform/resolvers/zod';
import InputField from '../InputField';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import FileUploadModal from '../FileUploadModal';

//* Định nghĩa schema bằng cách sử dụng z.object() để mô tả cấu trúc dữ liệu và điều kiện hợp lệ.
const ResultSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(10, 'Title must be at most 10 characters'),
  class: z.string().min(1, 'Class is required'),
  teacher: z.string().min(1, 'Teacher is required'),
  course: z.string().min(1, 'Course is required'),
  Result_date: z.string().min(1, 'Result date is required'),
});

// *Tạo TypeScript type từ schema Zod, giúp đồng bộ schema và type
type ResultFormData = z.infer<typeof ResultSchema>;

const ResultForm = ({
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
  } = useForm<ResultFormData>({
    // *Khi submit form, Zod sẽ tự động kiểm tra dữ liệu dựa trên ResultSchema.
    resolver: zodResolver(ResultSchema),
    defaultValues: data || {
      // *defaultValues: Đặt giá trị mặc định cho các input trên form.
      title: '',
      Result_date: '',
      class: '',
      teacher: '',
      course: '',
    },
  });

  const onSubmit = (formData: ResultFormData) => {
    console.log('Submitted Data:', formData);
    alert(type === 'create' ? 'Result Created!' : 'Result Updated!');
  };

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  return (
    <form className='flex flex-col gap-8' onSubmit={handleSubmit(onSubmit)}>
      <h1 className='text-xl font-semibold'>
        {type === 'create' ? 'Create a new Result' : 'Update Result'}
      </h1>
      <div className='flex justify-between flex-wrap gap-4'>
        <InputField
          label='Result name'
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
          <option value='female'>Teacher B</option>
        </InputField>
        <InputField
          label='Class'
          name='class'
          register={register}
          error={errors.teacher}
        >
          <option value=''>{t('form.placeholders.select')}</option>
          <option value='TeacherA'>CLass A</option>
          <option value='female'>Class B</option>
        </InputField>
        <InputField
          label='Course'
          name='course'
          register={register}
          error={errors.teacher}
        >
          <option value=''>{t('form.placeholders.select')}</option>
          <option value='TeacherA'>Course A</option>
          <option value='female'>Course B</option>
        </InputField>
        <InputField
          label='Result date'
          name='ResultDate'
          type='date'
          register={register}
          error={errors.Result_date}
        />
        {type === 'create' && (
          <InputField
            label='Upload source'
            type='file'
            inputProps={{ multiple: true }}
            onFileChange={(file) => setSelectedFile(file)} // Cập nhật state
            name='file'
            register={register}
            className='flex-1'
          />
        )}
      </div>
      <button className='bg-blue-400 text-white p-2 rounded-md'>
        {type === 'create' ? 'Create' : 'Update'}
      </button>
    </form>
  );
};

export default ResultForm;
