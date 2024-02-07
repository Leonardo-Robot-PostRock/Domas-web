import { useRouter } from 'next/navigation';

import {
  Avatar,
  Box,
  BoxProps,
  Button,
  DrawerCloseButton,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  VStack,
} from '@chakra-ui/react';

import Cookies from 'js-cookie';
import { GoSidebarExpand } from 'react-icons/go';

import { NavItems } from '../navItems/NavItems';
import { NavIconLogo } from '@/components/IconButton/NavIconLogo';
import { useNavItems } from '@/hooks/useNavItems';

interface Props {
  onClose?: () => void;
  props?: BoxProps;
}

export const SidebarContent = ({ onClose, ...props }: Props) => {
  const router = useRouter();
  const { Links } = useNavItems();

  function singOut() {
    localStorage.clear();
    Cookies.remove('auth_service');
    router.push('/');
  }

  return (
    <Box
      as="nav"
      pos="fixed"
      top="0"
      left="0"
      zIndex="sticky"
      px={4}
      h="full"
      overflowX="hidden"
      overflowY="auto"
      borderRightWidth="1px"
      w={{ base: '100%', md: '100%' }}
      {...props}
    >
      <VStack h="full" w="full" alignItems="flex-start" justifyContent="space-between">
        <Box w="full">
          <Flex py="5" justifyContent={'space-between'} alignContent={'center'} position={'relative'}>
            <NavIconLogo />
            <DrawerCloseButton top={8} color={'red.500'}>
              <GoSidebarExpand size={25} />
            </DrawerCloseButton>
          </Flex>
          <Flex direction="column" as="nav" fontSize="md" color="gray.600" aria-label="Main Navigation">
            <NavItems Links={Links} />
          </Flex>
        </Box>

        <Flex px="4" py="5" mt={10} justifyContent="center" alignItems="center">
          <Menu>
            <MenuButton
              as={Button}
              marginRight={5}
              size={'sm'}
              rounded={'full'}
              variant={'link'}
              cursor={'pointer'}
              _hover={{ textDecoration: 'none' }}
            >
              <Avatar size={'sm'} name="Ahmad" src="https://avatars2.githubusercontent.com/u/37842853?v=4" />
            </MenuButton>
            <MenuList fontSize={17} zIndex={5555}>
              <MenuItem onClick={() => singOut()}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </VStack>
    </Box>
  );
};
