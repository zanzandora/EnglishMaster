export interface MenuListProps {
  items: {
    icon: string;
    label: string;
    href: string;
    visible: string[];
  }[];
  role: string;
}
