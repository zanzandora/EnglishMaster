import { useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AccountPopover from './components/navBar/AccountPopover';
import NotificationsPopover from './components/navBar/NotificationsPopover';
import LanguagePopover from '@components/dashboard/components/navBar/LanguagePopover';
import { decodeToken } from '@utils/decodeToken ';
import ErrorPage from 'features/error/error';
import { useAuth } from 'hooks/useAuth';
import TableSearchGlobal from '@components/common/table/searchs/TableSearchGlobal';

const Navbar = () => {
  const { token } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const goToFAQ = useCallback(() => {
    if (location.pathname !== '/faq') navigate('/faq');
  }, [location.pathname, navigate]);

  if (!token) {
    return <ErrorPage />;
  }

  const decoded = decodeToken(token);
  const userName = decoded?.username || ' Guest';
  const role = decoded?.role;

  return (
    <nav className='w-full  '>
      <div className='flex flex-col md:flex-row md:items-center md:justify-between px-2 py-2 md:p-4 gap-2 md:gap-0'>
        {/* SEARCH BAR */}
        <div className='order-2 md:order-1 w-full '>
          <TableSearchGlobal />
        </div>

        {/* ICONS AND USER */}
        <div className='order-1 md:order-2 flex items-center justify-between md:justify-end w-full gap-2 md:gap-6'>
          {/* Left group: FAQ, Language, Notifications */}
          <div className='flex items-center gap-2 md:gap-4'>
            <button
              className='p-2 bg-white rounded-full hover:bg-gray-200'
              onClick={goToFAQ}
            >
              <img
                src='/question.png'
                alt='FAQ'
                width={24}
                height={24}
                className='md:w-[30px] md:h-[30px]'
              />
            </button>
            <LanguagePopover />
            {role === 'teacher' && <NotificationsPopover />}
          </div>

          {/* User info & Account */}
          <div className='flex items-center gap-2 md:gap-4'>
            <div className='flex flex-col text-right'>
              <span className='text-xs md:text-sm font-medium'>{userName}</span>
              <span className='text-[10px] md:text-xs text-gray-500'>
                {role}
              </span>
            </div>
            <AccountPopover />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
