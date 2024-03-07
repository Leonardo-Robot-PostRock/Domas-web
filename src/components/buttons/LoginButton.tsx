import { colord } from 'colord';
import { useGradientOfTheDay } from '@/hooks/useGradientOfTheDay';
import type { ReactNode } from 'react';
import { ChakraButton } from './ChakraButton';

interface Props {
  onSubmit: () => void;
  isLoading: boolean;
}

export const LoginButton = ({ onSubmit, isLoading }: Props): ReactNode => {
  const { gradientOfTheDay } = useGradientOfTheDay();

  return (
    <ChakraButton
      bg={gradientOfTheDay.split(',')[0]}
      color={'white'}
      onClick={onSubmit}
      isLoading={isLoading}
      _hover={{
        bg: colord(gradientOfTheDay.split(',')[0]).darken(0.05).toHex()
      }}
    >
      Ingresar a DO+
    </ChakraButton>
  );
};
