import {
  Box,
  Flex,
  Avatar,
  HStack,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  useColorModeValue,
  Stack,
  Text,
  Badge,
  Divider,
  VisuallyHidden,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useBreakpointValue,
} from '@chakra-ui/react';

import Link from 'next/link';
import Image from 'next/image';
import { cookies } from 'next/headers';

import { useAuthentication } from '@/hooks/useAuthentication';
import { useNavigationDomas } from '@/hooks/useNavigationDomas';

import CustomIconButton from './IconButton/IconButton';

// Modal para mostrar las novedades de DO+
const ModalNews = ({ isOpen, onOpen, onClose }) => {
  return (
    <>
      Novedades de DO+
      <Modal isOpen={isOpen} onClose={onClose} size={'6xl'}>
        <ModalOverlay />
        <ModalContent height={'85vh'}>
          <ModalHeader textAlign={'center'}>Novedades de DO+</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <iframe src="https://westnet.getlog.co/" height="100%" width="100%" title="Iframe Example"></iframe>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

const NavLink = ({ children, index }) => (
  <Link rounded={'md'} href={children.link} passHref>
    <Flex
      alignItems={'center'}
      bg={children.selected ? '#2F3A44' : 'white'}
      color={children.selected ? 'white' : '#2F3A44'}
      cursor={'pointer'}
      gap={2}
      m={1}
      p={2}
      borderRadius={'20vh'}
      transition={'.3s'}
      _hover={{
        bg: '#2F3A44',
        color: 'white',
      }}
    >
      {children.icon ? children.icon : null}
      <Text>{children.title}</Text>
    </Flex>
  </Link>
);

const NavSubmenu = ({ children }) => {
  const [isHover, setIsHover] = useState(false);

  const handleMouseEnter = () => {
    setIsHover(true);
  };

  const handleMouseLeave = () => {
    setIsHover(false);
  };

  return (
    <Box onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} style={{ zIndex: 20 }}>
      <Box
        display={'flex'}
        flexDirection={'row'}
        alignItems={'center'}
        gap={2}
        bg={isHover ? '#2F3A44' : children.selected ? '#2F3A44' : null}
        color={isHover ? 'white' : children.selected ? 'white' : '#2F3A44'}
        rounded={'20vh'}
        cursor={'pointer'}
        py={2}
        px={2}
      >
        {children.icon ? children.icon : null}
        <Text>{children.title}</Text>
      </Box>

      <Menu isOpen={isHover} offset={[0, -30]}>
        <VisuallyHidden>
          <MenuButton as={Button}>{children.title}</MenuButton>
        </VisuallyHidden>

        <MenuList minWidth="100px">
          {children.subLinks.map((child, index) =>
            child.allow ? (
              <MenuItem key={index}>
                <NavLink>{child}</NavLink>
              </MenuItem>
            ) : null
          )}
        </MenuList>
      </Menu>
    </Box>
  );
};

export default function NavBar() {
  const { userInfo, userRoles } = useAuthentication();

  const { Links } = useNavigationDomas();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const isDesktop = useBreakpointValue({ base: false, md: true });
  const { isOpen: isOpenNews, onOpen: onOpenNews, onClose: onCloseNews } = useDisclosure();

  function signOut() {
    localStorage.clear('user');
    cookies().delete('auth_service');
    router.push('/login');
  }

  if (isDesktop) {
    return (
      <Box mt={5} px={4}>
        <Flex justifyContent={'space-between'}>
          {isDesktop && <Image alt="logo DUMAS" src={'/logo_hor.svg'} height={35} width={80} priority={'false'} />}
          <Flex bg={useColorModeValue('white', '#191d32')} shadow={'sm'} borderRadius={'20vh'} ml={2} p={1}>
            <Flex alignItems={'center'} justifyContent={'space-between'}>
              <CustomIconButton
                isOpen={isOpen}
                onOpen={onOpen}
                onClose={onClose}
                colorScheme={'blackAlpha'}
                variant={'outline'}
              />

              <Flex flexDir={'row'} gap={'3vh'}>
                <HStack
                  as={'nav'}
                  spacing={6}
                  display={{ base: 'none', lg: 'flex' }}
                  flexWrap={'wrap'}
                  justifyContent={'center'}
                >
                  {Links.map((item, i) =>
                    item.allow && item.subLinks ? (
                      <NavSubmenu key={item.id}>{item}</NavSubmenu>
                    ) : item.allow ? (
                      <NavLink key={item.id}>{item}</NavLink>
                    ) : null
                  )}
                </HStack>

                {!isDesktop && (
                  <Image alt="logo DUMAS" src={'/logo_hor.svg'} height={35} width={80} priority={'false'} />
                )}
              </Flex>
            </Flex>

            {isOpen ? (
              <Box pb={4} display={{ lg: 'none' }}>
                <Stack as={'nav'} spacing={4}>
                  {Links.map((item) =>
                    item.allow && item.subLinks ? (
                      <NavSubmenu key={item.id}>{item}</NavSubmenu>
                    ) : item.allow ? (
                      <NavLink key={item.id}>{item}</NavLink>
                    ) : null
                  )}
                </Stack>
              </Box>
            ) : null}
          </Flex>

          <Menu>
            <MenuButton
              as={Button}
              ml={2}
              rounded={'full'}
              variant={'link'}
              cursor={'pointer'}
              leftIcon={
                <Avatar border={'2px solid #5A646D'} name={userInfo?.name} src={userInfo?.profile_pic} size={'sm'} />
              }
            ></MenuButton>
            <MenuList alignItems={'center'} zIndex={99}>
              <Text m={3} fontWeight={'bold'} textAlign={'center'} color={'blackAlpha.800'}>
                {userInfo?.name}
              </Text>

              {userRoles.includes('ADMINISTRADOR') && (
                <MenuItem onClick={() => router.push('/users')} mb={3}>
                  Administrar Usuarios
                </MenuItem>
              )}
              <MenuItem onClick={() => signOut()} mb={3}>
                Cerrar sesión
              </MenuItem>
              <Divider />
              <MenuItem mt={3} fontSize={'14px'} onClick={onOpenNews}>
                <ModalNews isOpen={isOpenNews} onClose={onCloseNews} />{' '}
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Box>
    );
  }

  return (
    <>
      <Box bg={useColorModeValue('white', '#191d32')} px={4} shadow={'sm'}>
        <Flex flexDir={'column'}>
          <Box>
            <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
              <Flex flexDir={'row'} gap={'3vh'} w={'60%'} justifyContent={'space-between'}>
                {isDesktop && (
                  <Image alt="logo DUMAS" src={'/logo_hor.svg'} height={35} width={80} priority={'false'} />
                )}
                <CustomIconButton
                  isOpen={isOpen}
                  onOpen={onOpen}
                  aria-label={'Open Menu'}
                  display={{ lg: 'none' }}
                  onClose={onClose}
                  variant={'outline'}
                />
                <HStack spacing={8} alignItems={'center'}>
                  <HStack as={'nav'} spacing={4} display={{ base: 'none', lg: 'flex' }}>
                    {Links.map((item) =>
                      item.allow && item.subLinks ? (
                        <NavSubmenu key={item.id}>{item}</NavSubmenu>
                      ) : item.allow ? (
                        <NavLink key={item.id}>{item}</NavLink>
                      ) : null
                    )}
                  </HStack>
                </HStack>

                {!isDesktop && (
                  <Image alt="logo DUMAS" src={'/logo_hor.svg'} height={35} width={80} priority={'false'} />
                )}
              </Flex>

              <Flex justifyContent={'end'} w={'40%'}>
                {isDesktop && (
                  <Badge mr={5} p={1} colorScheme={'blackAlpha'}>
                    {`${userInfo?.name} - ${userRoles.join(', ')}`}
                  </Badge>
                )}

                <Menu>
                  <MenuButton
                    as={Button}
                    rounded={'full'}
                    variant={'link'}
                    cursor={'pointer'}
                    minW={0}
                    p={2}
                    leftIcon={<Avatar name={userInfo?.name} src={userInfo?.profile_pic} size={'md'} />}
                  ></MenuButton>
                  <MenuList alignItems={'center'} zIndex={99}>
                    <Text m={3} fontWeight={'bold'} textAlign={'center'} color={'blackAlpha.800'}>
                      {userInfo?.name}
                    </Text>

                    {userRoles.includes('ADMINISTRADOR') && (
                      <MenuItem onClick={() => router.push('/users')} mb={3}>
                        Administrar Usuarios
                      </MenuItem>
                    )}
                    <MenuItem onClick={() => signOut()} mb={3}>
                      Cerrar sesión
                    </MenuItem>
                    <Divider />
                    <MenuItem mt={3} fontSize={'14px'} onClick={onOpenNews}>
                      <ModalNews isOpen={isOpenNews} onClose={onCloseNews} />{' '}
                    </MenuItem>
                  </MenuList>
                </Menu>
              </Flex>
            </Flex>

            {isOpen ? (
              <Box pb={4} display={{ md: 'none' }}>
                <Stack as={'nav'} spacing={4} z-index={2}>
                  {Links.map((item) =>
                    item.allow && item.subLinks ? (
                      <NavSubmenu key={item.id}>{item}</NavSubmenu>
                    ) : item.allow ? (
                      <NavLink key={item.id}>{item}</NavLink>
                    ) : null
                  )}
                </Stack>
              </Box>
            ) : null}
          </Box>
        </Flex>
      </Box>
    </>
  );
}
