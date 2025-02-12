import { useState, lazy, Suspense } from 'react';

// Lazy load các form
const TeacherForm = lazy(() => import('./forms/TeacherForm'));
const StudentForm = lazy(() => import('./forms/StudentForm'));

const forms: {
  [key: string]: (type: 'create' | 'update', data?: any) => JSX.Element;
} = {
  teacher: (type, data) => <TeacherForm type={type} data={data} />,
  student: (type, data) => <StudentForm type={type} data={data} />,
};

const FormModal = ({
  table,
  type,
  data,
  id,
}: {
  table:
    | 'teacher'
    | 'student'
    | 'subject'
    | 'class'
    | 'lesson'
    | 'exam'
    | 'assignment'
    | 'result'
    | 'attendance'
    | 'event'
    | 'announcement';
  type: 'create' | 'update' | 'delete';
  data?: any;
  id?: number;
}) => {
  const size = type === 'create' ? 'w-8 h-8' : 'w-7 h-7';
  const bgColor =
    type === 'create'
      ? 'bg-tables-actions-bgCreateIcon'
      : type === 'update'
      ? 'bg-tables-actions-bgEditIcon'
      : 'bg-tables-actions-bgDeleteIcon';

  const [open, setOpen] = useState(false);

  const Form = () => {
    return type === 'delete' && id ? (
      <form className='p-4 flex flex-col gap-4'>
        <span className='text-center font-medium'>
          All data will be lost. Are you sure you want to delete this {table}?
        </span>
        <button className='bg-primary text-white py-2 px-4 rounded-md border-none w-max self-center'>
          Delete
        </button>
      </form>
    ) : type === 'create' || type === 'update' ? (
      forms[table](type, data)
    ) : (
      'Form not found!'
    );
  };

  return (
    <>
      <button
        className={`${size} flex items-center justify-center rounded-full ${bgColor}`}
        onClick={() => setOpen(true)}
      >
        <img src={`/${type}.png`} alt='' width={16} height={16} />
      </button>
      {open && (
        <div className='w-screen h-screen absolute left-0 top-0 bg-black bg-opacity-60 z-50 flex items-center justify-center'>
          <div className='bg-white p-4 rounded-md relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]'>
            <Suspense fallback={<h1>Loading...</h1>}>
              <Form />
            </Suspense>
            <div
              className='absolute top-4 right-4 cursor-pointer'
              onClick={() => setOpen(false)}
            >
              <img src='/close.png' alt='Close' width={14} height={14} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FormModal;
