import { useState, lazy, Suspense, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

// Lazy load các form
const TeacherForm = lazy(() => import('./forms/TeacherForm'));
const StudentForm = lazy(() => import('./forms/StudentForm'));
const CourseForm = lazy(() => import('./forms/CourseForm'));
const ClassForm = lazy(() => import('./forms/ClassForm'));
const LessonForm = lazy(() => import('./forms/LessonForm'));
const ExamForm = lazy(() => import('./forms/ExamForm'));
const ResultForm = lazy(() => import('./forms/ResultForm'));
const ScheduleForm = lazy(() => import('./forms/EventForm'));
const ShiftForm = lazy(() => import('./forms/ShiftForm'));

const StudentsList = lazy(() => import('./forms/StudentsList'));
const AttendanceList = lazy(() => import('./forms/AttendanceList'));

const forms: {
  [key: string]: (
    type: 'create' | 'update',
    data?: any,
    handleSubmit?: (data: any) => void,
    onSuccess?: () => void,
    setOpen?: (open: boolean) => void
  ) => JSX.Element;
} = {
  teacher: (type, data, _, onSuccess, setOpen) => (
    <TeacherForm
      type={type}
      data={data}
      onSuccess={onSuccess}
      setOpen={setOpen}
    />
  ),
  student: (type, data, _, onSuccess, setOpen) => (
    <StudentForm
      type={type}
      data={data}
      onSuccess={onSuccess}
      setOpen={setOpen}
    />
  ),
  course: (type, data, _, onSuccess, setOpen) => (
    <CourseForm
      type={type}
      data={data}
      onSuccess={onSuccess}
      setOpen={setOpen}
    />
  ),
  class: (type, data, _, onSuccess, setOpen) => (
    <ClassForm
      type={type}
      data={data}
      onSuccess={onSuccess}
      setOpen={setOpen}
    />
  ),
  lesson: (type, data, _, onSuccess, setOpen) => (
    <LessonForm
      type={type}
      data={data}
      onSuccess={onSuccess}
      setOpen={setOpen}
    />
  ),
  exam: (type, data, _, onSuccess, setOpen) => (
    <ExamForm type={type} data={data} onSuccess={onSuccess} setOpen={setOpen} />
  ),
  result: (type, data, _, onSuccess, setOpen) => (
    <ResultForm
      type={type}
      data={data}
      onSuccess={onSuccess}
      setOpen={setOpen}
    />
  ),
  schedule: (type, data, _, onSuccess, setOpen) => (
    <ScheduleForm
      type={type}
      data={data}
      onSuccess={onSuccess}
      setOpen={setOpen}
    />
  ),
  shift: (type, data, handleSubmit) => (
    <ShiftForm type={type} data={data} handleSubmit={handleSubmit} />
  ),
};

const FormModal = ({
  table,
  type,
  data,
  id,
  userID,
  onShiftChange,
  onSuccess,
  onError,
  hideTrigger,
  openTrigger,
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
    | 'schedule'
    | 'shift'
    | 'announcement'
    | 'students'
    | 'attendances';
  type: 'list' | 'create' | 'update' | 'delete';
  data?: any;
  id?: number;
  userID?: number;
  onShiftChange?: (shift: { value: string; label: string }) => void;
  onSuccess?: () => void;
  onError?: (error: any) => void;
  hideTrigger?: boolean;
  openTrigger?: number;
}) => {
  const { t } = useTranslation();
  const size = type === 'create' ? 'w-8 h-8' : 'w-7 h-7';
  const bgColor =
    type === 'create'
      ? 'bg-tables-actions-bgCreateIcon'
      : type === 'update'
      ? 'bg-tables-actions-bgEditIcon'
      : type === 'list'
      ? 'bg-tables-actions-bgViewIcon'
      : 'bg-tables-actions-bgDeleteIcon';

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (openTrigger) {
      setOpen(true);
    }
  }, [openTrigger]);

  const [isDeleting, setIsDeleting] = useState(false);

  const handleSubmit = (newShift: { value: string; label: string }) => {
    if (onShiftChange) {
      onShiftChange(newShift); // Gửi shift mới về EventForm
    }
    if (onSuccess) {
      onSuccess(); // Gọi lại danh sách sau khi form thành công
    }
    setOpen(false); // Đóng modal
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    const deleteId = userID || id;
    if (!id) {
      toast.error('ID không hợp lệ');
      return;
    }

    setIsDeleting(true);
    const endpoint = `/${table}/delete/${deleteId}`;

    try {
      const response = await fetch(endpoint, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      toast.success(
        t('orther.toast.delete', { tableNameDefault: t(`form.table.${table}`) })
      );
      setOpen(false);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      toast.error('Lỗi khi xóa: ' + error.message);
      if (onError) {
        onError(error);
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const Form = () => {
    return type === 'delete' && (id || userID) ? (
      <form className='p-4 flex flex-col gap-4'>
        <span className='text-center font-medium'>
          {t('form.actions.message')} {t(`form.table.${table}`)}?
        </span>
        <button
          type='button'
          disabled={isDeleting}
          onClick={handleDelete}
          className='bg-primary text-white py-2 px-4 rounded-md border-none w-max self-center'
        >
          {isDeleting ? 'Deleting...' : t('form.actions.delete')}
        </button>
      </form>
    ) : type === 'create' || type === 'update' ? (
      forms[table](type, data, handleSubmit, onSuccess, setOpen)
    ) : table === 'students' && type === 'list' ? (
      <StudentsList classID={id?.toString()} />
    ) : table === 'attendances' && type === 'list' ? (
      <AttendanceList studentID={id?.toString()} />
    ) : (
      'Form not found!'
    );
  };

  return (
    <>
      {!hideTrigger && (
        <button
          className={`${size} flex items-center justify-center rounded-full ${bgColor}`}
          onClick={() => setOpen(true)}
        >
          <img src={`/${type}.png`} alt='' width={16} height={16} />
        </button>
      )}
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
