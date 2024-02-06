import { Flex, useColorModeValue } from '@chakra-ui/react';
import { Submenu } from '../submenu/SubMenu';

import { LinkItem } from '@/types/NavMenuItemProps/linksAndSublink';
import { ItemLink } from '../intex';

interface Props {
  Links: LinkItem[];
}

export const NavItems = ({ Links }: Props) => {
  const color = useColorModeValue('cyan.600', 'cyan.300');

  console.log('Links: ', Links);

  return (
    <Flex
      align="center"
      px="6"
      py="3"
      flexDirection={'column'}
      cursor="pointer"
      role="group"
      fontWeight="semibold"
      transition=".15s ease"
      color={useColorModeValue('inherit', 'gray.400')}
      _hover={{
        bg: useColorModeValue('gray.100', 'gray.900'),
        color: useColorModeValue('gray.900a', 'gray.200'),
      }}
    >
      {Links.map((item, index) => {
        return item.allow && item.subLinks ? (
          <Submenu key={index} subLinks={item.subLinks} title={item.title} />
        ) : item.allow ? (
          <ItemLink key={index} {...item} />
        ) : null;
      })}
    </Flex>
  );
};
