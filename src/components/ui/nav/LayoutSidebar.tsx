'use client';
import Image from 'next/image';
import {
  Box,
  Flex,
  Drawer,
  DrawerContent,
  IconButton,
  useDisclosure,
  DrawerOverlay,
  useColorModeValue,
} from '@chakra-ui/react';
import { FiMenu } from 'react-icons/fi';
import { IoMdArrowDropright } from 'react-icons/io';

import { SidebarContent } from './sidebar/SidebarContent';
import { useRef } from 'react';

interface Props {
  children: React.ReactNode;
}

export default function LayoutSidebar({ children }: Props) {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const divRef = useRef<HTMLDivElement>(null);

  return (
    <Box as="section" bg={useColorModeValue('gray.50', 'gray.700')} minH="100vh">
      <Box
        aria-label="Open Sidebar"
        ref={divRef}
        onClick={onOpen}
        cursor={'pointer'}
        h={'100vh'}
        w={'15px'}
        color={'white'}
        rounded={'inherit'}
        bg={'blue.400'}
        _hover={{ bg: 'blue.300' }}
        position={'absolute'}
        justifyContent={'center'}
        alignItems={'center'}
        display={{ base: 'none', md: 'flex' }}
      >
        <IoMdArrowDropright size={30} />
      </Box>
      <Drawer isOpen={isOpen} onClose={onClose} placement="left" finalFocusRef={divRef} size={'xs'}>
        <DrawerOverlay />
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      <Box ml={{ base: 0, md: 100 }} transition=".3s ease">
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
          <Image src="/logo.svg" width={60} height={60} alt="Do+ logo" priority={true} />
        </Flex>
        <Box as="main" p={2} bg={useColorModeValue('auto', 'gray.800')}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
