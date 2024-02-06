import { SubLink } from '@/types/NavMenuItemProps/linksAndSublink';
import { Flex, Text } from '@chakra-ui/react';
import Link from 'next/link';

export const AccordionItems = ({ link, selected, icon, title }: SubLink) => {
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
