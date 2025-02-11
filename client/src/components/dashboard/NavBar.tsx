import { useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AccountPopover from './components/navBar/AccountPopover';
import NotificationsPopover from './components/navBar/NotificationsPopover';

const Navbar = () => {
  const isNavigating = useRef(false);
  const navigate = useNavigate();
  const location = useLocation();

  const goToFAQ = () => {
    if (isNavigating.current || location.pathname === '/faq') return;

    isNavigating.current = true;
    navigate('/faq');

    // Sau 1s mới cho phép bấm lại
    setTimeout(() => {
      isNavigating.current = false;
    }, 1000);
  };

  // Reset `isNavigating` khi URL thay đổi
  useEffect(() => {
    isNavigating.current = false;
  }, [location.pathname]);

  return (
    <div className='flex items-center justify-between p-4'>
      {/* SEARCH BAR */}
      <div className='hidden md:flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2'>
        <img src='/search.png' alt='' width={14} height={14} />
        <input
          type='text'
          placeholder='Search...'
          className='w-[200px] p-2 bg-transparent outline-none'
        />
      </div>
      {/* ICONS AND USER */}
      <div className='flex items-center gap-6 justify-end w-full'>
        <div className='bg-white rounded-full h-7 flex items-center justify-center cursor-pointer relative'>
          <button
            className='relative p-2 bg-white rounded-full hover:bg-gray-200 '
            onClick={goToFAQ}
          >
            <img src='/question.png' alt='' width={30} height={30} />
          </button>
        </div>
        <NotificationsPopover />
        <div className='flex flex-col'>
          <span className='text-xs leading-3 font-medium'>Mai Minh Tu</span>
          <span className='text-[10px] text-gray-500 text-right'>Admin</span>
        </div>
        <AccountPopover />
      </div>
    </div>
  );
};

export default Navbar;
