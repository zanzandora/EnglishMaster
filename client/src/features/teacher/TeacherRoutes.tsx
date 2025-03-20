import { Routes, Route } from 'react-router-dom';
import ErrorPage from 'features/error/error';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentListPage from '@list/students/students';
import StudentViewPage from '@list/students/viewPage';
import CoursesListPage from '@list/courses';
// import ClassListPage from '@list/classes/teacherClasses';
import LessonListPage from '@list/lessons';
import ExamListPage from '@list/exams';
import AssignmentListPage from '@list/assignments';
import ResultListPage from '@list/results';
import ScheduleListPage from '@list/schedule/schedule';
import AnnouncementListPage from '@list/announcements';
import AttendanceListPage from '@list/attendances';
import ReportListPage from '@list/reports';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<TeacherDashboard />} />

      <Route path='list/students' element={<StudentListPage />} />
      <Route path='list/students/:id' element={<StudentViewPage />} />

      <Route path='list/subjects' element={<CoursesListPage />} />

      {/* <Route path='list/classes/:userID' element={<ClassListPage />} /> */}

      <Route path='list/lessons' element={<LessonListPage />} />
      <Route path='list/exams' element={<ExamListPage />} />
      <Route path='list/assignments' element={<AssignmentListPage />} />
      <Route path='list/attendance' element={<AttendanceListPage />} />
      <Route path='list/results' element={<ResultListPage />} />
      <Route path='list/schedule' element={<ScheduleListPage />} />
      <Route path='list/reports' element={<ReportListPage />} />
      <Route path='list/announcements' element={<AnnouncementListPage />} />
      <Route path='*' element={<ErrorPage />} />
    </Routes>
  );
};

export default AdminRoutes;
