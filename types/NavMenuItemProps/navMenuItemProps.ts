export interface NavMenuItemProps {
  children: {
    link: string;
    selected?: boolean;
    icon?: React.ReactNode;
    title: string;
  };
}
