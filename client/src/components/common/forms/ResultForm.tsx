import { useForm } from 'react-hook-form';
import { z } from 'zod'; // !validation schema
import { zodResolver } from '@hookform/resolvers/zod';
import InputField from '../InputField';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

//* Định nghĩa schema bằng cách sử dụng z.object() để mô tả cấu trúc dữ liệu và điều kiện hợp lệ.
const ResultSchema = z.object({
  id: z.number(),
  student: z.object({
    studentName: z.string(),
    dateOfBirth: z.string(),
    email: z.string(),
  }),
  MT: z.coerce
    .number()
    .min(0, 'MT have at least 0')
    .max(100, 'MT have at most 100'),
  FT: z.coerce
    .number()
    .min(0, 'MT have at least 0')
    .max(100, 'MT have at most 100'),
});

// *Tạo TypeScript type từ schema Zod, giúp đồng bộ schema và type
type ResultFormData = z.infer<typeof ResultSchema>;
const ResultForm = ({
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
    trigger,
    formState: { errors },
  } = useForm<ResultFormData>({
    // *Khi submit form, Zod sẽ tự động kiểm tra dữ liệu dựa trên ResultSchema.
    resolver: zodResolver(ResultSchema),
    defaultValues: data || {
      // *defaultValues: Đặt giá trị mặc định cho các input trên form.
      student: {
        studentName: '',
        dateOfBirth: '',
        email: '',
      },
      MT: '',
      FT: '',
    },
  });

  const submitResult = async (formattedData: any) => {
    const url = type === 'create' ? '/result/add' : '/result/edit';
    console.log('🔴 API Sending:', formattedData);
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      toast.success(
        type === 'create'
          ? 'Result created successfully!'
          : 'Result updated successfully!'
      );
      onSuccess();
      if (setOpen) setOpen(false);
    } catch (error: any) {
      toast.error('❌ ' + error.message);
    }
  };

  const onSubmit = async (formData: ResultFormData) => {
    const isValid = await trigger();
    if (!isValid) {
      toast.error('Validation errors:' + errors);
      return;
    }

    try {
      if (type === 'update' && data?.id) {
        formData.id = data.id;
      }

      // Tạo object dữ liệu để gửi đi
      const dataToSubmit = { ...formData };

      console.log('🚀 Raw Form Data:', dataToSubmit);

      await submitResult(dataToSubmit);
    } catch (error: any) {
      toast.error('Error processing form' + error.message);
    }
  };

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
            label='Student name'
            name='student.studentName'
            register={register}
            error={errors.student?.studentName}
            inputProps={{ readOnly: true, disabled: true }}
            className='flex-1 '
          />
          <InputField
            label='Date of Birth'
            name='student.dateOfBirth'
            type='date'
            register={register}
            error={errors.student?.dateOfBirth}
            inputProps={{
              readOnly: type === 'update',
              disabled: type === 'update',
            }}
            className='flex-1'
          />
        </div>
        <InputField
          label={t('form.teacher.email')}
          name='student.email'
          register={register}
          error={errors.student?.email}
          inputProps={{ readOnly: true, disabled: true }}
          className='min-w-full'
        />
      </div>
      <div className='flex gap-4 items-center justify-start space-x-4'>
        <span className='text-xs text-gray-400 font-medium'>Field Score</span>
      </div>
      <div className='flex justify-between flex-wrap gap-4'>
        <div className='flex justify-between items-center flex-1 gap-8'>
          <InputField
            label={'Middle Score (MT)'}
            name='MT'
            register={register}
            error={errors.MT}
            className='flex-1'
          />
          <InputField
            label={'Final Score (FT)'}
            name='FT'
            register={register}
            error={errors.FT}
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

export default ResultForm;
