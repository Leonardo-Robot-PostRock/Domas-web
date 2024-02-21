import { Tooltip } from '@chakra-ui/react';

import { TooltipProps } from '@/types/tooltip/tooltipContent';
import { TooltipFormatter } from './TooltipFormatter';

export const TooltipComponent = ({ content }: TooltipProps) => {
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
