import type { Control, FieldError, Message, UseFormRegister, ValidationRule } from 'react-hook-form';
import type { FormData } from './teamEdit';

export interface FormFieldProps {
  [key: string]: any;
  errors: Record<string, FieldError>;
  label: string;
  name: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  register: UseFormRegister<FormData>;
  validation?: Message | ValidationRule<boolean>;
}

export interface DynamicLabel {
  minTicketsTodo: string;
  maxTicketsTodo: string;
}

export interface DynamicHelperText {
  minTodoHelperText: string;
  maxTodoHelperText: string;
}

export interface Props {
  control: Control<FormData>;
  errors: Record<string, FieldError> | undefined;
}
