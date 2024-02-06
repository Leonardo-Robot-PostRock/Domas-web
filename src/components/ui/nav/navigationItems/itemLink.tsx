import Link from 'next/link';
import { Box, Flex, Text } from '@chakra-ui/react';

import { LinkItem } from '@/types/NavMenuItemProps/linksAndSublink';

export const ItemLink = ({ link, selected, icon, title }: LinkItem) => {
  return (
    <Box w={'100%'}>
      <Link href={link} passHref>
        <Flex
          alignItems={'center'}
          bg={selected ? 'cyan.400' : 'white'}
          color={selected ? 'white' : '#2F3A44'}
          cursor={'pointer'}
          gap={2}
          py={2}
          px={4}
          _hover={{
            bg: 'cyan.100',
            color: 'black',
          }}
        >
          {icon ? icon : null}
          <Text>{title}</Text>
        </Flex>
      </Link>
    </Box>
  );
};
