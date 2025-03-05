import { useState, lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';

// Lazy load các form
const TeacherForm = lazy(() => import('./forms/TeacherForm'));
const StudentForm = lazy(() => import('./forms/StudentForm'));
const CourseForm = lazy(() => import('./forms/CourseForm'));
const ClassForm = lazy(() => import('./forms/ClassForm'));
const LessonForm = lazy(() => import('./forms/LessonForm'));
const ExamForm = lazy(() => import('./forms/ExamForm'));
const ResultForm = lazy(() => import('./forms/ResultForm'));
const EventForm = lazy(() => import('./forms/EventForm'));
const ShiftForm = lazy(() => import('./forms/ShiftForm'));

const forms: {
  [key: string]: (
    type: 'create' | 'update',
    data?: any,
    handleSubmit?: (data: any) => void
  ) => JSX.Element;
} = {
  teacher: (type, data) => <TeacherForm type={type} data={data} />,
  student: (type, data) => <StudentForm type={type} data={data} />,
  course: (type, data) => <CourseForm type={type} data={data} />,
  class: (type, data) => <ClassForm type={type} data={data} />,
  lesson: (type, data) => <LessonForm type={type} data={data} />,
  exam: (type, data) => <ExamForm type={type} data={data} />,
  result: (type, data) => <ResultForm type={type} data={data} />,
  event: (type, data) => <EventForm type={type} data={data} />,
  shift: (type, data, handleSubmit) => (
    <ShiftForm type={type} data={data} handleSubmit={handleSubmit} />
  ),
};

const FormModal = ({
  table,
  type,
  data,
  id,
  onShiftChange,
}: {
  table:
    | 'teacher'
    | 'student'
    | 'course'
    | 'class'
    | 'lesson'
    | 'exam'
    | 'assignment'
    | 'result'
    | 'attendance'
    | 'event'
    | 'shift'
    | 'announcement';
  type: 'create' | 'update' | 'delete';
  data?: any;
  id?: number;
  onShiftChange?: (shift: { value: string; label: string }) => void;
}) => {
  const { t } = useTranslation();
  const size = type === 'create' ? 'w-8 h-8' : 'w-7 h-7';
  const bgColor =
    type === 'create'
      ? 'bg-tables-actions-bgCreateIcon'
      : type === 'update'
      ? 'bg-tables-actions-bgEditIcon'
      : 'bg-tables-actions-bgDeleteIcon';

  const [open, setOpen] = useState(false);
  const handleSubmit = (newShift: { value: string; label: string }) => {
    if (onShiftChange) {
      onShiftChange(newShift); // Gửi shift mới về EventForm
    }
    setOpen(false); // Đóng modal
  };

  const Form = () => {
    return type === 'delete' && id ? (
      <form className='p-4 flex flex-col gap-4'>
        <span className='text-center font-medium'>
          {t('form.actions.message')} {t(`form.table.${table}`)}?
        </span>
        <button className='bg-primary text-white py-2 px-4 rounded-md border-none w-max self-center'>
          {t('form.actions.delete')}
        </button>
      </form>
    ) : type === 'create' || type === 'update' ? (
      forms[table](type, data, handleSubmit)
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
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50'>
          <div className='bg-white p-6 rounded-md shadow-lg relative w-[90%] md:w-[70%] lg:w-[50%] xl:w-[40%]'>
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
