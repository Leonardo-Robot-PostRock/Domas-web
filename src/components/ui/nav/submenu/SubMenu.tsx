import { useState } from 'react';
import { Accordion, AccordionItem, AccordionButton, AccordionPanel, Box, Text, AccordionIcon } from '@chakra-ui/react';
import { ItemLink } from '../intex';

import { AddIcon, MinusIcon } from '@chakra-ui/icons'; // Importa los íconos de Chakra UI

export const Submenu = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleMenuToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Box style={{ zIndex: 20 }}>
      <Accordion allowToggle>
        <AccordionItem>
          <AccordionButton color={'black'} ml={2} display={'flex'} border={'none'} width={'100%'}>
            {children.icon ? children.icon : null}
            <Text flex="1">{children.title}</Text>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel>
            {children.subLinks.map((child, index) => (child.allow ? <ItemLink key={index} child={child} /> : null))}
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Box>
  );
};
