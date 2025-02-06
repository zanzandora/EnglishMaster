import MenuItem from './MenuItem';

interface MenuListProps {
  title: string;
  items: {
    icon: string;
    label: string;
    href: string;
    visible: string[];
  }[];
  role: string;
}

const MenuList = ({ title, items, role }: MenuListProps) => {
  return (
    <div className='flex flex-col gap-2'>
      <span className='hidden lg:block text-gray-400 font-light my-4'>
        {title}
      </span>
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
