import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Menu from '@components/dashboard/Menu';
import Navbar from '@components/dashboard/NavBar';
import { useIsMobile } from 'hooks/useIsMobile';
import HamBurgerBtn from '@components/dashboard/components/HamBurgerBtn';

const basePath: Record<string, string> = {
  admin: '/admin',
  teacher: '/teacher',
  student: '/student',
};

const role = 'admin'; // replace with authenticated user role

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <div className='h-screen flex relative'>
      {/* Sidebar for desktop, and overlay for mobile */}
      <div>
        {/* Overlay for mobile when sidebar is open */}
        {sidebarOpen && (
          <div
            className='fixed inset-0 bg-black bg-opacity-40 z-20 md:hidden'
            onClick={() => setSidebarOpen(false)}
          />
        )}
        <div
          className={`
            bg-primary-light
            h-full
            z-30
            transition-transform duration-200
            fixed top-0 left-0
            w-64
            md:w-[8%] lg:w-[16%] xl:w-[14%]
            p-4
            md:static md:translate-x-0
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
            md:block
          `}
          style={{ minWidth: '200px', maxWidth: '320px' }}
        >
          <Link
            to={`${basePath[role]}`}
            className='flex items-center justify-center gap-2 mb-4'
          >
            <img src='/logo.png' alt='logo' width={85} height={85} />
          </Link>
          <Menu />
        </div>
      </div>

      {/* Main content area */}
      <div className='flex-1 bg-[#F7F8FA] overflow-scroll flex flex-col relative'>
        {/* Draggable Hamburger button: only show on mobile and when sidebar is closed */}
        <HamBurgerBtn
          onClick={() => setSidebarOpen(true)}
          visible={isMobile && !sidebarOpen}
        />

        {/* Navbar and content */}
        <Navbar />
        <div className='flex-1'>{children}</div>
      </div>
    </div>
  );
};

export default DashboardLayout;
