import { FieldError, Merge, FieldErrorsImpl } from 'react-hook-form';
import { FC, ReactNode } from 'react';
type InputFieldProps = {
  label: string;
  type?: string;
  register: any;
  name: string;
  value?: string;
  defaultValue?: string;
  error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | string;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement> &
    React.SelectHTMLAttributes<HTMLSelectElement> &
    React.TextareaHTMLAttributes<HTMLTextAreaElement>;
  className?: string;
  children?: ReactNode;
  onFileChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const InputField: FC<InputFieldProps> = ({
  label,
  type = 'text',
  register,
  name,
  value,
  defaultValue,
  error,
  inputProps,
  className = '',
  children,
  onFileChange,
}: InputFieldProps) => {
  const InputComponents: Record<string, JSX.Element> = {
    file: (
      <input
        type='file'
        {...inputProps}
        className='ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full'
        onChange={(e) => onFileChange && e.target.files && onFileChange(e)}
      />
    ),
    textarea: (
      <textarea
        {...register(name)}
        {...(inputProps as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
        className='ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full resize-none'
        value={value !== undefined ? value : defaultValue}
      />
    ),
    select: (
      <select
        {...register(name)}
        {...(inputProps as React.SelectHTMLAttributes<HTMLSelectElement>)}
        defaultValue={defaultValue}
        className='ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full'
      >
        {children}
      </select>
    ),
    default: (
      <input
        type={type}
        {...register(name)}
        {...(inputProps as React.InputHTMLAttributes<HTMLInputElement>)}
        className='ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full'
        defaultValue={defaultValue}
      />
    ),
  };

  return (
    <div
      className={`relative flex flex-col gap-2 w-full my-1 md:w-1/4 ${className}`}
    >
      <label className='text-xs text-gray-500'>{label ? label : ''}</label>

      {/* Render input tương ứng dựa trên type */}
      {type === 'file'
        ? InputComponents.file
        : type === 'textarea'
        ? InputComponents.textarea
        : children
        ? InputComponents.select
        : InputComponents.default}

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
