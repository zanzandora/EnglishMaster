import { useEffect, useState } from 'react';

const MOBILE_MAX_WIDTH = 640; // px, tương ứng với breakpoint 'sm' của Tailwind

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined'
      ? window.innerWidth < MOBILE_MAX_WIDTH
      : false
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < MOBILE_MAX_WIDTH);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile;
}