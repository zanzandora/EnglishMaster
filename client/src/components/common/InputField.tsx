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
}: InputFieldProps) => {
  return (
    <div className={`flex flex-col gap-2 w-full md:w-1/4 ${className}`}>
      <label className='text-xs text-gray-500'>{label}</label>
      {children ? (
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
        <span className='text-xs text-red-400'>{error.message.toString()}</span>
      )}
      {typeof error === 'string' && (
        <span className='text-xs text-red-400'>{error}</span>
      )}
    </div>
  );
};

export default InputField;
