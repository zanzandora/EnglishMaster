import React from 'react';

interface HamburgerBtnProps {
  onClick: () => void;
  visible: boolean;
}

const HamburgerBtn: React.FC<HamburgerBtnProps> = ({ onClick, visible }) => {
  if (!visible) return null;

  return (
    <button
      aria-label='Open sidebar'
      onClick={onClick}
      className='fixed top-4 left-4 md:hidden z-30 bg-white shadow-md rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
    >
      <svg
        className='w-7 h-7'
        fill='none'
        stroke='currentColor'
        viewBox='0 0 24 24'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M4 6h16M4 12h16M4 18h16'
        />
      </svg>
    </button>
  );
};

export default HamburgerBtn;
