import { Flex, useColorModeValue } from '@chakra-ui/react';
import { Submenu } from '../submenu/SubMenu';

import { SubLink } from '@/types/NavMenuItemProps/linksAndSublink';

interface Props {
  children: {
    allow: boolean;
    subLinks: SubLink[];
  };
}

export const NavItems = ({ children }: Props) => {
  const color = useColorModeValue('cyan.600', 'cyan.300');

  const { allow, subLinks } = children;

  return (
    <Flex
      align="center"
      px="6"
      py="3"
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
      {allow && subLinks ? <Submenu children={children} /> : ''}
    </Flex>
  );
};
