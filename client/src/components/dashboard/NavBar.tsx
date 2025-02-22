import { useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AccountPopover from './components/navBar/AccountPopover';
import NotificationsPopover from './components/navBar/NotificationsPopover';
import LanguagePopover from '@components/dashboard/components/navBar/LanguagePopover';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const goToFAQ = useCallback(() => {
    if (location.pathname !== '/faq') navigate('/faq');
  }, [location.pathname, navigate]);

  return (
    <div className='flex items-center justify-between p-4'>
      {/* SEARCH BAR */}
      <div className='hidden md:flex items-center gap-2 text-xs rounded-full ring-1.5 ring-gray-300 px-2'>
        <img src='/search.png' alt='Search Icon' width={14} height={14} />
        <input
          type='text'
          placeholder='Search...'
          className='w-[200px] p-2 bg-transparent outline-none'
        />
      </div>

      {/* ICONS AND USER */}
      <div className='flex items-center gap-6 justify-end w-full'>
        <button
          className='p-2 bg-white rounded-full hover:bg-gray-200'
          onClick={goToFAQ}
        >
          <img src='/question.png' alt='FAQ' width={30} height={30} />
        </button>

        <LanguagePopover />
        <NotificationsPopover />

        <div className='flex flex-col text-right'>
          <span className='text-xs font-medium'>Mai Minh Tu</span>
          <span className='text-[10px] text-gray-500'>Admin</span>
        </div>

        <AccountPopover />
      </div>
    </div>
  );
};

export default Navbar;
