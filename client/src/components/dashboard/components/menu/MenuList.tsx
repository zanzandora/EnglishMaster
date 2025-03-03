import MenuItem from './MenuItem';
import { MenuListProps } from '@interfaces';

const MenuList = ({ items, role }: MenuListProps) => {
  return (
    <div className='flex flex-col gap-2 mt-6'>
      {items.map(
        (item) =>
          item.visible.includes(role) && (
            <MenuItem
              key={item.label}
              icon={item.icon}
              label={item.label}
              href={item.href}
            />
          )
      )}
    </div>
  );
};

export default MenuList;
