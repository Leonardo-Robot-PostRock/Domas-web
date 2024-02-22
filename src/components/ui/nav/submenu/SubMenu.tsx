import type { ReactNode } from 'react';
import { Accordion, AccordionItem, AccordionButton, AccordionPanel, Box, Text, AccordionIcon } from '@chakra-ui/react';
import { AccordionItems } from '../intex';

import type { IconObject, SubLink } from '@/types/NavMenuItemProps/linksAndSublink';

interface Props {
  subLinks: SubLink[];
  title: string;
  icon: IconObject;
}

export const Submenu = ({ subLinks, title, icon }: Props): ReactNode => {
  return (
    <Box style={{ zIndex: 20 }} w={'100%'} justifyContent={'space-around'}>
      <Accordion allowToggle>
        <AccordionItem w="full">
          <AccordionButton
            color={'black'}
            display={'flex'}
            justifyContent={'space-between'}
            _hover={{
              bg: 'cyan.100',
              color: 'black'
            }}
          >
            <Box display={'flex'} alignItems={'center'} gap={2}>
              {icon ?? null}
              <Text>{title}</Text>
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel p={0} ml={8} mb={2}>
            {subLinks.map((item, index) => (item.allow ? <AccordionItems key={index} {...item} /> : null))}
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Box>
  );
};
