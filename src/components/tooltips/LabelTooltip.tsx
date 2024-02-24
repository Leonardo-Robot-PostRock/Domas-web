import { Tooltip, WrapItem } from '@chakra-ui/react';
import type { ReactNode } from 'react';
import { BsInfoCircle } from 'react-icons/bs';

export const LabelTooltip = ({ label }: { label: string }): ReactNode => {
  return (
    <Tooltip label={label}>
      <WrapItem>
        <BsInfoCircle />
      </WrapItem>
    </Tooltip>
  );
};
