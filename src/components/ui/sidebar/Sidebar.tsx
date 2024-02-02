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
import Link from 'next/link';
import { AiOutlineHome, AiOutlineTeam } from 'react-icons/ai';
import { BsCalendarCheck, BsFolder2 } from 'react-icons/bs';
import { RiFlashlightFill } from 'react-icons/ri';
import { NavItem } from '../navItems/NavItems';
import Cookies from 'js-cookie';
import { redirect } from 'next/navigation';

export const SidebarContent = ({ ...props }: BoxProps) => {
  function singOut() {
    localStorage.clear();
    Cookies.remove('auth_service');
    redirect('/');
  }

  return (
    <Box
      as="nav"
      pos="fixed"
      top="0"
      left="0"
      zIndex="sticky"
      h="full"
      // pb="10"
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
            <NavItem icon={AiOutlineHome}>Dashboard</NavItem>
            <NavItem icon={AiOutlineTeam}>Team</NavItem>
            <NavItem icon={BsFolder2}>Projects</NavItem>
            <NavItem icon={BsCalendarCheck}>Calendar</NavItem>
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
              <MenuItem as={Link} href="#">
                My profile
              </MenuItem>
              <MenuItem as={Link} href="#">
                Change password
              </MenuItem>
              <MenuItem onClick={() => singOut}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </VStack>
    </Box>
  );
};
