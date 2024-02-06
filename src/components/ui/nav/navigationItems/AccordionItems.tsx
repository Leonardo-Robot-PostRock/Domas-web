import { SubLink } from '@/types/NavMenuItemProps/linksAndSublink';
import { Box, Flex, Text } from '@chakra-ui/react';
import Link from 'next/link';

export const AccordionItems = ({ link, selected, icon, title }: SubLink) => {
  return (
    <Box w={'100%'}>
      <Link href={link} passHref>
        <Flex
          alignItems={'center'}
          bg={selected ? 'cyan.400' : 'white'}
          color={selected ? 'white' : '#'}
          cursor={'pointer'}
          gap={2}
          p={2}
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
