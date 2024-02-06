import Link from 'next/link';
import { Flex, Text } from '@chakra-ui/react';

import { LinkItem } from '@/types/NavMenuItemProps/linksAndSublink';

export const ItemLink = ({ link, selected, icon, title }: LinkItem) => {
  console.log('ItemLink', { link, selected, icon, title });

  return (
    <Link href={link} passHref>
      <Flex
        alignItems={'end'}
        bg={selected ? '#2F3A44' : 'white'}
        color={selected ? 'white' : '#2F3A44'}
        cursor={'pointer'}
        gap={2}
        p={2}
        _hover={{
          bg: '#2F3A44',
          color: 'white',
        }}
      >
        {icon ? icon : null}
        <Text>{title}</Text>
      </Flex>
    </Link>
  );
};
