import { Flex, useColorModeValue } from '@chakra-ui/react';
import { Submenu } from '../submenu/SubMenu';

import { LinkItem } from '@/types/NavMenuItemProps/linksAndSublink';
import { ItemLink } from '../intex';

interface Props {
  Links: LinkItem[];
}

export const NavItems = ({ Links }: Props) => {
  const color = useColorModeValue('cyan.600', 'cyan.300');

  return (
    <Flex
      align="center"
      my="3"
      w={'full'}
      flexDirection={'column'}
      cursor="pointer"
      role="group"
      fontWeight="semibold"
      transition=".15s ease"
      color={useColorModeValue('inherit', 'gray.400')}
    >
      {Links.map((item, index) => {
        return item.allow && item.subLinks ? (
          <Submenu key={index} subLinks={item.subLinks} title={item.title} icon={item.icon} />
        ) : item.allow ? (
          <ItemLink key={index} {...item} />
        ) : null;
      })}
    </Flex>
  );
};
