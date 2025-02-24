import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const LanguagePopover = () => {
  const [open, setOpen] = useState(false);
  const [flag, setFlag] = useState('English');
  const popoverRef = useRef(null);

  const { i18n } = useTranslation();

  // *Truy xuất ngôn ngữ đã chọn từ local storage
  useEffect(() => {
    const storedLanguage = localStorage.getItem('language');
    if (storedLanguage) {
      setFlag(storedLanguage);
      i18n.changeLanguage(storedLanguage.substring(0, 2).toLowerCase());
    }
  }, [i18n]);

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
    setFlag(lang);
    i18n.changeLanguage(lang.substring(0, 2).toLowerCase());
    setOpen(false);
    localStorage.setItem('language', lang);
  };

  return (
    <div className='relative' ref={popoverRef}>
      <button
        onClick={() => setOpen(!open)}
        className='relative p-2 bg-white rounded-full hover:bg-gray-200'
      >
        <img
          src={
            flag === 'English'
              ? '/united_kingdom_flag.png'
              : '/vietnamese_flag.png'
          }
          alt={flag === 'English' ? 'United Kingdom flag' : 'Vietnamese flag'}
          className='rounded-full'
          width={30}
          height={30}
        />
      </button>

      {/* Popover Content */}
      {open && (
        <div className='absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50'>
          <div className=''>
            <button
              onClick={() => handleLanguageChange('Vietnamese')}
              className='w-full flex items-center gap-2 justify-start px-4 py-2 text-sm hover:bg-gray-100'
            >
              <img
                src='/vietnamese_flag.png'
                alt='Vietnamese flag'
                className='rounded-full'
                width={30}
                height={30}
              />
              <span>Tiếng Việt</span>
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
