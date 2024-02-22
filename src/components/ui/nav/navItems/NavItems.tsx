import { Flex, useColorModeValue } from '@chakra-ui/react';
import { Submenu } from '../submenu/SubMenu';

import type { LinkItem } from '@/types/NavMenuItemProps/linksAndSublink';
import { ItemLink } from '../intex';
import type { ReactNode } from 'react';

interface Props {
  links: LinkItem[];
}

export const NavItems = ({ links }: Props): ReactNode => {
  return (
    <Flex
      align="center"
      my="3"
      w="full"
      flexDirection="column"
      cursor="pointer"
      role="group"
      fontWeight="semibold"
      transition=".15s ease"
      color={useColorModeValue('inherit', 'gray.400')}
    >
      {links.map((item, index) => {
        return item.allow && item.subLinks ? (
          <Submenu key={index} subLinks={item.subLinks} title={item.title} icon={item.icon} />
        ) : item.allow ? (
          <ItemLink key={index} {...item} />
        ) : null;
      })}
    </Flex>
  );
};
