import { Link } from 'react-router-dom';
import { MenuItemProps } from '@interfaces';

const MenuItem = ({ icon, label, href }: MenuItemProps) => {
  return (
    <Link
      to={href}
      className='flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-primary-menuBtnHover'
    >
      <img src={icon} alt={label} width={20} height={20} />
      <span className='hidden lg:block'>{label}</span>
    </Link>
  );
};

export default MenuItem;
