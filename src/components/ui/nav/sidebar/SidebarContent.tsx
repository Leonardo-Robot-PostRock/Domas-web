import { useRouter } from 'next/navigation';
import Link from 'next/link';

import {
  Avatar,
  Box,
  BoxProps,
  Button,
  Flex,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react';

import { RiFlashlightFill } from 'react-icons/ri';

import Cookies from 'js-cookie';
import { useNavItems } from '@/hooks/useNavItems';
import { NavItems } from '../navItems/NavItems';

export const SidebarContent = ({ ...props }: BoxProps) => {
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
      h="full"
      overflowX="hidden"
      overflowY="auto"
      bg={useColorModeValue('white', 'gray.800')}
      borderColor={useColorModeValue('inherit', 'gray.700')}
      borderRightWidth="1px"
      w="60"
      {...props}
    >
      <VStack h="full" w="full" alignItems="flex-start" justifyContent="space-between">
        <Box w="full">
          <Flex px="4" py="5" align="center">
            <Icon as={RiFlashlightFill} h={8} w={8} />
            <Text fontSize="2xl" ml="2" color={useColorModeValue('brand.500', 'white')} fontWeight="semibold">
              POS
            </Text>
          </Flex>
          <Flex direction="column" as="nav" fontSize="md" color="gray.600" aria-label="Main Navigation">
            <NavItems Links={Links} />
          </Flex>
        </Box>

        <Flex px="4" py="5" mt={10} justifyContent="center" alignItems="center">
          <Menu>
            <MenuButton
              as={Button}
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
