import { FieldError, Merge, FieldErrorsImpl } from 'react-hook-form';
import { FC, ReactNode } from 'react';
type InputFieldProps = {
  label: string;
  type?: string;
  register: any;
  name: string;
  defaultValue?: string;
  error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | string;
  inputProps?:
    | React.InputHTMLAttributes<HTMLInputElement>
    | React.SelectHTMLAttributes<HTMLSelectElement>;
  className?: string;
  children?: ReactNode;
  onFileChange?: (files: FileList | null) => void;
};

const InputField: FC<InputFieldProps> = ({
  label,
  type = 'text',
  register,
  name,
  defaultValue,
  error,
  inputProps,
  className = '',
  children,
  onFileChange,
}: InputFieldProps) => {
  return (
    <div
      className={` relative flex flex-col gap-2 w-full my-1 md:w-1/4 ${className}`}
    >
      <label className='text-xs text-gray-500'>{label}</label>
      {type === 'file' ? (
        <input
          type='file'
          {...inputProps}
          className='ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full
          '
          onChange={(e) => onFileChange && onFileChange(e.target.files?.[0])} // Lấy file
        />
      ) : children ? (
        // Nếu có children -> dùng select
        <select
          {...register(name)}
          {...inputProps}
          className='ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full'
        >
          {children}
        </select>
      ) : (
        <input
          type={type}
          {...register(name)}
          className='ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full'
          {...inputProps}
          defaultValue={defaultValue}
        />
      )}

      {typeof error === 'object' && error?.message && (
        <span className='absolute left-0 top-full mt-1 text-xs text-red-400'>
          {error.message.toString()}
        </span>
      )}
      {typeof error === 'string' && (
        <span className='absolute left-0 top-full mt-1 text-xs text-red-400'>
          {error}
        </span>
      )}
    </div>
  );
};

export default InputField;
