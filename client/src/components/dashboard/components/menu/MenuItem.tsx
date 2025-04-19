import { Link, useLocation } from 'react-router-dom';
import { MenuItemProps } from '@interfaces';
import { useMemo } from 'react';
import { useIsMobile } from 'hooks/useIsMobile';

const MenuItem = ({ icon, label, href }: MenuItemProps) => {
  const location = useLocation();
  const isMobile = useIsMobile();
  // Tối ưu tính toán isActive với useMemo()
  const isActive = useMemo(() => {
    const { pathname } = location;
    const isBaseRoute = ['/admin', '/teacher'].includes(href);
    return (
      pathname === href || (pathname.startsWith(href + '/') && !isBaseRoute)
    );
  }, [location, href]);

  return (
    <Link
      to={href}
      className={`flex items-center justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-primary-menuBtnHover ${
        isActive ? 'bg-primary-menuBtnHover' : ''
      }`}
    >
      <img src={icon} alt={label} width={20} height={20} />
      <span className={`${isMobile ? 'text-xl' : ''}`}>{label}</span>
    </Link>
  );
};

export default MenuItem;
