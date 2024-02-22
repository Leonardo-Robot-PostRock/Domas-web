import type { ReactNode } from 'react';
import Link from 'next/link';
import { Box, Flex, Text } from '@chakra-ui/react';

import type { SubLink } from '@/types/NavMenuItemProps/linksAndSublink';

export const AccordionItems = ({ link, selected, icon, title }: SubLink): ReactNode => {
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
            color: 'black'
          }}
        >
          {icon ?? null}
          <Text>{title}</Text>
        </Flex>
      </Link>
    </Box>
  );
};
