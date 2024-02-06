import { Flex, Text } from '@chakra-ui/react';
import Link from 'next/link';

export const ItemLink = ({ child }) => {
  return (
    <Link href={child.link} passHref>
      <Flex
        alignItems={'end'}
        bg={child.selected ? '#2F3A44' : 'white'}
        color={child.selected ? 'white' : '#2F3A44'}
        cursor={'pointer'}
        gap={2}
        p={2}
        _hover={{
          bg: '#2F3A44',
          color: 'white',
        }}
      >
        {child.icon ? child.icon : null}
        <Text>{child.title}</Text>
      </Flex>
    </Link>
  );
};
