import MenuList from './components/menu/MenuList';
import { useTranslation } from 'react-i18next';

const basePath = {
  admin: '/admin',
  teacher: '/teacher',
  student: '/student',
};
const role = 'admin';
const getMenuItems = (t: any) => [
  {
    items: [
      {
        icon: '/home.png',
        label: t('menu.home'),
        href: `${basePath[role]}`,
        visible: ['admin', 'teacher', 'student', 'parent'],
      },
      {
        icon: '/teacher.png',
        label: t('menu.teachers'),
        href: `${basePath[role]}/list/teachers`,
        visible: ['admin'],
      },
      {
        icon: '/student.png',
        label: t('menu.students'),
        href: `${basePath[role]}/list/students`,
        visible: ['admin', 'teacher'],
      },
      {
        icon: '/subject.png',
        label: t('menu.courses'),
        href: `${basePath[role]}/list/subjects`,
        visible: ['admin'],
      },
      {
        icon: '/class.png',
        label: t('menu.classes'),
        href: `${basePath[role]}/list/classes`,
        visible: ['admin', 'teacher'],
      },
      {
        icon: '/lesson.png',
        label: t('menu.lessons'),
        href: `${basePath[role]}/list/lessons`,
        visible: ['admin', 'teacher'],
      },
      {
        icon: '/exam.png',
        label: t('menu.exams'),
        href: `${basePath[role]}/list/exams`,
        visible: ['admin', 'teacher', 'student', 'parent'],
      },
      // {
      //   icon: '/assignment.png',
      //   label: t('menu.assignments'),
      //   href: `${basePath[role]}/list/assignments`,
      //   visible: ['admin', 'teacher', 'student', 'parent'],
      // },
      {
        icon: '/result.png',
        label: t('menu.results'),
        href: `${basePath[role]}/list/results`,
        visible: ['admin', 'teacher', 'student'],
      },
      {
        icon: '/attendance.png',
        label: t('menu.attendance'),
        href: `${basePath[role]}/list/attendance`,
        visible: ['admin', 'teacher', 'student'],
      },
      {
        icon: '/calendar.png',
        label: t('menu.schedule'),
        href: `${basePath[role]}/list/schedule`,
        visible: ['admin', 'teacher', 'student'],
      },
      {
        icon: '/report.png',
        label: t('menu.report'),
        href: `${basePath[role]}/list/reports`,
        visible: ['admin', 'teacher', 'student'],
      },
      // {
      //   icon: '/announcement.png',
      //   label: t('menu.announcements'),
      //   href: `${basePath[role]}/list/announcements`,
      //   visible: ['admin', 'teacher', 'student', 'parent'],
      // },
    ],
  },
];

const Menu = () => {
  const { t } = useTranslation();
  const menuItems = getMenuItems(t);
  return (
    <div className='mt-4 text-sm '>
      {menuItems.map((menu, index) => (
        <MenuList key={index} items={menu.items} role={role} />
      ))}
    </div>
  );
};

export default Menu;
