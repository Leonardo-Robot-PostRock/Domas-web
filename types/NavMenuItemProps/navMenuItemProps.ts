export interface NavMenuItemProps {
  children: {
    rounded: string;
    link: HTMLAnchorElement;
    selected?: boolean;
    icon?: React.ReactNode;
    title: string;
  };
}
