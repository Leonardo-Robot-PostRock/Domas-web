import { useState } from 'react';
import { Accordion, AccordionItem, AccordionButton, AccordionPanel, Box, Text, AccordionIcon } from '@chakra-ui/react';
import { AccordionItems } from '../intex';
import { SubLink } from '@/types/NavMenuItemProps/linksAndSublink';

interface Props {
  subLinks: SubLink[];
  title: string;
}

export const Submenu = ({ subLinks, title }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleMenuToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Box style={{ zIndex: 20 }}>
      <Accordion allowToggle>
        <AccordionItem>
          <AccordionButton color={'black'} ml={2} display={'flex'}>
            <Text flex="1">{title}</Text>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel>
            {subLinks.map((item, index) => (item.allow ? <AccordionItems key={index} {...item} /> : null))}
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Box>
  );
};
