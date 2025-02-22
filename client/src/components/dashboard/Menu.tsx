import MenuList from './components/menu/MenuList';

const basePath = {
  admin: '/admin',
  teacher: '/teacher',
  student: '/student',
};
const role = 'admin';
const menuItems = [
  {
    items: [
      {
        icon: '/home.png',
        label: 'Home',
        href: `${basePath[role]}`,
        visible: ['admin', 'teacher', 'student', 'parent'],
      },
      {
        icon: '/teacher.png',
        label: 'Teachers',
        href: `${basePath[role]}/list/teachers`,
        visible: ['admin', 'teacher'],
      },
      {
        icon: '/student.png',
        label: 'Students',
        href: `${basePath[role]}/list/students`,
        visible: ['admin', 'teacher'],
      },
      {
        icon: '/subject.png',
        label: 'Courses',
        href: `${basePath[role]}/list/subjects`,
        visible: ['admin'],
      },
      {
        icon: '/class.png',
        label: 'Classes',
        href: `${basePath[role]}/list/classes`,
        visible: ['admin', 'teacher'],
      },
      {
        icon: '/lesson.png',
        label: 'Lessons',
        href: `${basePath[role]}/list/lessons`,
        visible: ['admin', 'teacher'],
      },
      {
        icon: '/exam.png',
        label: 'Exams',
        href: `${basePath[role]}/list/exams`,
        visible: ['admin', 'teacher', 'student', 'parent'],
      },
      {
        icon: '/assignment.png',
        label: 'Assignments',
        href: `${basePath[role]}/list/assignments`,
        visible: ['admin', 'teacher', 'student', 'parent'],
      },
      {
        icon: '/result.png',
        label: 'Results',
        href: `${basePath[role]}/list/results`,
        visible: ['admin', 'teacher', 'student', 'parent'],
      },
      {
        icon: '/attendance.png',
        label: 'Attendance',
        href: `${basePath[role]}/list/attendance`,
        visible: ['admin', 'teacher', 'student', 'parent'],
      },
      {
        icon: '/calendar.png',
        label: 'Schedule',
        href: `${basePath[role]}/list/schedule`,
        visible: ['admin', 'teacher', 'student', 'parent'],
      },
      {
        icon: '/report.png',
        label: 'Report',
        href: `${basePath[role]}/list/reports`,
        visible: ['admin', 'teacher', 'student', 'parent'],
      },
      {
        icon: '/announcement.png',
        label: 'Announcements',
        href: `${basePath[role]}/list/announcements`,
        visible: ['admin', 'teacher', 'student', 'parent'],
      },
    ],
  },
];

const Menu = () => {
  return (
    <div className='mt-4 text-sm '>
      {menuItems.map((menu, index) => (
        <MenuList key={index} items={menu.items} role={role} />
      ))}
    </div>
  );
};

export default Menu;
