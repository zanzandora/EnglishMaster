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
    return <ErrorPage />; // Hoặc xử lý khi không có token
  }

  const decoded = decodeToken(token);
  const userName = decoded?.username || ' Guest';
  const role = decoded?.role;

  return (
    <div className='flex items-center justify-between p-4'>
      {/* SEARCH BAR */}
      <TableSearchGlobal />

      {/* ICONS AND USER */}
      <div className='flex items-center gap-6 justify-end w-full'>
        <button
          className='p-2 bg-white rounded-full hover:bg-gray-200'
          onClick={goToFAQ}
        >
          <img src='/question.png' alt='FAQ' width={30} height={30} />
        </button>

        <LanguagePopover />
        {role === 'teacher' && <NotificationsPopover />}

        <div className='flex flex-col text-right'>
          <span className='text-xs font-medium'>{userName}</span>
          <span className='text-[10px] text-gray-500'>{role}</span>
        </div>

        <AccountPopover />
      </div>
    </div>
  );
};

export default Navbar;
