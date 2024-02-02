import { Button } from '@chakra-ui/react';
import { colord } from 'colord';
import { useGradientOfTheDay } from '@/hooks/useGradientOfTheDay';

interface Props {
  onSubmit: () => void;
  isLoading: boolean;
}

export const SubmitButton = ({ onSubmit, isLoading }: Props) => {
  const { gradientOfTheDay } = useGradientOfTheDay();

  return (
    <Button
      bg={gradientOfTheDay.split(',')[0]}
      color={'white'}
      onClick={onSubmit}
      isLoading={isLoading}
      _hover={{
        bg: colord(gradientOfTheDay.split(',')[0]).darken(0.05).toHex(),
      }}
    >
      Ingresar a DO+
    </Button>
  );
};
