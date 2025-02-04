import { Link } from 'react-router-dom';

const menuItems = [
  {
    title: 'MENU',
    items: [
      {
        icon: '/home.png',
        label: 'Home',
        href: '/admin',
        visible: ['admin', 'teacher', 'student', 'parent'],
      },
      {
        icon: '/teacher.png',
        label: 'Teachers',
        href: '/admin/list/teachers',
        visible: ['admin', 'teacher'],
      },
      {
        icon: '/student.png',
        label: 'Students',
        href: '/admin/list/students',
        visible: ['admin', 'teacher'],
      },
      // {
      //   icon: '/parent.png',
      //   label: 'Parents',
      //   href: '/admin/list/parents',
      //   visible: ['admin', 'teacher'],
      // },
      {
        icon: '/subject.png',
        label: 'Subjects',
        href: '/admin/list/subjects',
        visible: ['admin'],
      },
      {
        icon: '/class.png',
        label: 'Classes',
        href: '/admin/list/classes',
        visible: ['admin', 'teacher'],
      },
      {
        icon: '/lesson.png',
        label: 'Lessons',
        href: '/admin/list/lessons',
        visible: ['admin', 'teacher'],
      },
      {
        icon: '/exam.png',
        label: 'Exams',
        href: '/admin/list/exams',
        visible: ['admin', 'teacher', 'student', 'parent'],
      },
      {
        icon: '/assignment.png',
        label: 'Assignments',
        href: '/admin/list/assignments',
        visible: ['admin', 'teacher', 'student', 'parent'],
      },
      {
        icon: '/result.png',
        label: 'Results',
        href: '/admin/list/results',
        visible: ['admin', 'teacher', 'student', 'parent'],
      },
      {
        icon: '/attendance.png',
        label: 'Attendance',
        href: '/admin/list/attendance',
        visible: ['admin', 'teacher', 'student', 'parent'],
      },
      {
        icon: '/calendar.png',
        label: 'Events',
        href: '/admin/list/events',
        visible: ['admin', 'teacher', 'student', 'parent'],
      },
      {
        icon: '/message.png',
        label: 'Messages',
        href: '/admin/list/messages',
        visible: ['admin', 'teacher', 'student', 'parent'],
      },
      {
        icon: '/announcement.png',
        label: 'Announcements',
        href: '/admin/list/announcements',
        visible: ['admin', 'teacher', 'student', 'parent'],
      },
    ],
  },
  // {
  //   title: 'OTHER',
  //   items: [
  //     {
  //       icon: '/profile.png',
  //       label: 'Profile',
  //       href: '/profile',
  //       visible: ['admin', 'teacher', 'student', 'parent'],
  //     },
  //     {
  //       icon: '/setting.png',
  //       label: 'Settings',
  //       href: '/settings',
  //       visible: ['admin', 'teacher', 'student', 'parent'],
  //     },
  //     {
  //       icon: '/logout.png',
  //       label: 'Logout',
  //       href: '/logout',
  //       visible: ['admin', 'teacher', 'student', 'parent'],
  //     },
  //   ],
  // },
];

const Menu = () => {
  return (
    <div className='mt-4 text-sm '>
      {menuItems.map((i) => (
        <div className='flex flex-col gap-2 ' key={i.title}>
          <span className='hidden lg:block text-gray-400 font-light my-4 '>
            {i.title}
          </span>
          {i.items.map((item) => {
            if (item.visible.includes('admin')) {
              return (
                <Link
                  to={item.href}
                  key={item.label}
                  className='flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-primary-menuBtnHover'
                >
                  <img
                    src={item.icon}
                    alt={item.label}
                    width={20}
                    height={20}
                  />
                  <span className='hidden lg:block'>{item.label}</span>
                </Link>
              );
            }
          })}
        </div>
      ))}
    </div>
  );
};

export default Menu;
