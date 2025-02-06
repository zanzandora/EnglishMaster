import AccountPopover from './components/navBar/AccountPopover';
import NotificationsPopover from './components/navBar/NotificationsPopover';

const Navbar = () => {
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
        {/* <div className='bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer'>
          <img src='/message.png' alt='' width={20} height={20} />
        </div> */}
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
