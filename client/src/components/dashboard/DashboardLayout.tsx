import React from 'react';
import { Link } from 'react-router-dom';
import Menu from '@components/dashboard/Menu';
import Navbar from '@components/dashboard/NavBar';

const basePath = {
  admin: '/admin',
  teacher: '/teacher',
  student: '/student',
};

const role = 'admin'; // replace with authenticated user role
const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className='h-screen flex '>
        {/* LEFT */}
        <div className='w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%] p-4 bg-primary-light'>
          <Link
            to={`${basePath[role]}`}
            className='flex items-centerr lg:justify-center gap-2'
          >
            <img src='/logo.png' alt='logo' width={85} height={85} />
          </Link>
          <Menu />
        </div>
        {/* RIGHT */}
        <div className='w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] bg-[#F7F8FA] overflow-scroll flex flex-col'>
          <Navbar />
          {children}
        </div>
      </div>
    </>
  );
};

export default DashboardLayout;
