import { useState, useRef, useEffect } from 'react';

const LanguagePopover = () => {
  const [open, setOpen] = useState(false);
  const [language, setLanguage] = useState('English');
  const popoverRef = useRef(null);

  // *Đóng popover khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !(popoverRef.current as HTMLElement).contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [popoverRef]);

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    setOpen(false);
  };

  return (
    <div className='relative' ref={popoverRef}>
      <button
        onClick={() => setOpen(!open)}
        className='relative p-2 bg-white rounded-full hover:bg-gray-200'
      >
        <img
          src={
            language === 'English'
              ? '/united_kingdom_flag.png'
              : '/vietnam_flag.png'
          }
          alt={language === 'English' ? 'United Kingdom flag' : 'Vietnam flag'}
          className='rounded-full'
          width={30}
          height={30}
        />
      </button>

      {/* Popover Content */}
      {open && (
        <div className='absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-50'>
          <div className=''>
            <button
              onClick={() => handleLanguageChange('Vietnam')}
              className='w-full flex items-center gap-2 justify-start px-4 py-2 text-sm hover:bg-gray-100'
            >
              <img
                src='/vietnam_flag.png'
                alt='Vietnam flag'
                className='rounded-full'
                width={30}
                height={30}
              />
              <span>VietNam</span>
            </button>
            <button
              onClick={() => handleLanguageChange('English')}
              className='w-full flex gap-2 items-center justify-start px-4 py-2 text-sm hover:bg-gray-100'
            >
              <img
                src='/united_kingdom_flag.png'
                alt='United Kingdom flag'
                className='rounded-full'
                width={30}
                height={30}
              />
              <span>English</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguagePopover;
