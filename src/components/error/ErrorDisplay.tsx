import type { ReactNode } from 'react';
import { FormErrorMessage } from '@chakra-ui/react';
import type { FieldError } from 'react-hook-form';

interface ErrorDisplayProps {
  errors: FieldError | string | undefined;
  message?: string;
}

export const ErrorDisplay = ({ errors, message }: ErrorDisplayProps): ReactNode => {
  return <>{errors && <FormErrorMessage>{message}</FormErrorMessage>}</>;
};
