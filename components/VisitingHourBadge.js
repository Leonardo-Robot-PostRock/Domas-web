import { Badge } from '@chakra-ui/react';

export function VisitingHourBadge({ visiting_hours }) {
  const TurnColorSchema = visiting_hours == 'afternoon' ? 'pink' : visiting_hours == 'morning' ? 'blue' : 'purple';
  const TurnLabel =
    visiting_hours == 'afternoon' ? 'De 13 a 17hs.' : visiting_hours == 'morning' ? 'De 9 a 13hs.' : 'Todo el dia';

  return (
    <Badge colorScheme={TurnColorSchema} mt={2} fontSize={'12px'} placeItems={'center'}>
      {TurnLabel}
    </Badge>
  );
}
