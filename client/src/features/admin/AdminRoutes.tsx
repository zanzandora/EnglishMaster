import { Routes, Route } from 'react-router-dom';
import ErrorPage from 'features/error/error';
import AdminDashboard from './pages/AdminDashboard';
import StudentListPage from '@list/students';
import TeacherListPage from '@list/teachers';
import SubjectListPage from '@list/subjects';
import ClassListPage from '@list/classes';
import LessonListPage from '@list/lessons';
import ExamListPage from '@list/exams';
import AssignmentListPage from '@list/assignments';
import ResultListPage from '@list/results';
import EventListPage from '@list/events';
import AnnouncementListPage from '@list/announcements';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<AdminDashboard />} />
      <Route path='list/students' element={<StudentListPage />} />
      <Route path='list/teachers' element={<TeacherListPage />} />
      <Route path='list/subjects' element={<SubjectListPage />} />
      <Route path='list/classes' element={<ClassListPage />} />
      <Route path='list/lessons' element={<LessonListPage />} />
      <Route path='list/exams' element={<ExamListPage />} />
      <Route path='list/assignments' element={<AssignmentListPage />} />
      <Route path='list/results' element={<ResultListPage />} />
      <Route path='list/events' element={<EventListPage />} />
      <Route path='list/announcements' element={<AnnouncementListPage />} />
      <Route path='*' element={<ErrorPage />} />
    </Routes>
  );
};

export default AdminRoutes;
