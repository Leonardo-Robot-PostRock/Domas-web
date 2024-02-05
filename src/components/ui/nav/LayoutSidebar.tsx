'use client';

import {
  Box,
  Flex,
  Icon,
  Drawer,
  DrawerContent,
  IconButton,
  useDisclosure,
  DrawerOverlay,
  useColorModeValue,
} from '@chakra-ui/react';

import { FiMenu } from 'react-icons/fi';
import { RiFlashlightFill } from 'react-icons/ri';

import { SidebarContent } from './sidebar/SidebarContent';

interface Props {
  children: React.ReactNode;
}

export default function LayoutSidebar({ children }: Props) {
  const { isOpen, onClose, onOpen } = useDisclosure();

  return (
    <Box as="section" bg={useColorModeValue('gray.50', 'gray.700')} minH="100vh">
      <SidebarContent display={{ base: 'none', md: 'unset' }} />
      <Drawer isOpen={isOpen} onClose={onClose} placement="left">
        <DrawerOverlay />
        <DrawerContent>
          <SidebarContent w="full" borderRight="none" />
        </DrawerContent>
      </Drawer>
      <Box ml={{ base: 0, md: 60 }} transition=".3s ease">
        <Flex
          as="header"
          align="center"
          w="full"
          px="4"
          display={{ base: 'flex', md: 'none' }}
          borderBottomWidth="1px"
          borderColor={useColorModeValue('inherit', 'gray.700')}
          bg={useColorModeValue('white', 'gray.800')}
          justifyContent={{ base: 'space-between', md: 'flex-end' }}
          boxShadow="lg"
          h="14"
        >
          <IconButton
            aria-label="Menu"
            display={{ base: 'inline-flex', md: 'none' }}
            onClick={onOpen}
            icon={<FiMenu />}
            size="md"
          />

          <Flex align="center">
            <Icon as={RiFlashlightFill} h={8} w={8} />
          </Flex>
        </Flex>

        <Box as="main" p={14} bg={useColorModeValue('auto', 'gray.800')}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
