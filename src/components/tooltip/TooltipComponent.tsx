import type { ReactNode } from 'react';

import { Tooltip } from '@chakra-ui/react';

import { TooltipFormatter } from './TooltipFormatter';

import type { TooltipProps } from '@/types/tooltip/tooltipContent';

export const TooltipComponent = ({ content }: TooltipProps): ReactNode => {
  return (
    <Tooltip
      bg="blue.300"
      hasArrow
      placement="start"
      label={<TooltipFormatter content={content} />}
      aria-label="Tooltip"
      closeDelay={1000}
    >
      {content.map((item) => item.name).join(', ')}
    </Tooltip>
  );
};
