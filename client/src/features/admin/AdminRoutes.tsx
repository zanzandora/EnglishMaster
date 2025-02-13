import { Routes, Route } from 'react-router-dom';
import ErrorPage from 'features/error/error';
import AdminDashboard from './pages/AdminDashboard';
import StudentListPage from '@list/students/students';
import TeacherViewPage from '@list/teachers/viewPage';
import TeacherListPage from '@list/teachers/teachers';
import CoursesListPage from '@list/courses';
import ClassListPage from '@list/classes';
import LessonListPage from '@list/lessons';
import ExamListPage from '@list/exams';
import AssignmentListPage from '@list/assignments';
import ResultListPage from '@list/results';
import ScheduleListPage from '@list/schedule/schedule';
import AnnouncementListPage from '@list/announcements';
import AttendanceListPage from '@list/attendance';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<AdminDashboard />} />

      <Route path='list/students' element={<StudentListPage />} />

      <Route path='list/teachers' element={<TeacherListPage />} />
      <Route path='list/teachers/:id' element={<TeacherViewPage />} />

      <Route path='list/subjects' element={<CoursesListPage />} />
      <Route path='list/classes' element={<ClassListPage />} />
      <Route path='list/lessons' element={<LessonListPage />} />
      <Route path='list/exams' element={<ExamListPage />} />
      <Route path='list/assignments' element={<AssignmentListPage />} />
      <Route path='list/attendance' element={<AttendanceListPage />} />
      <Route path='list/results' element={<ResultListPage />} />
      <Route path='list/schedule' element={<ScheduleListPage />} />
      <Route path='list/announcements' element={<AnnouncementListPage />} />
      <Route path='*' element={<ErrorPage />} />
    </Routes>
  );
};

export default AdminRoutes;
