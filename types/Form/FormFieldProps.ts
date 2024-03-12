import type { Control, FieldError, Message, UseFormRegister } from 'react-hook-form';
import type { FormData } from './teamEdit';

export interface FormFieldProps {
  id?: string;
  [key: string]: any;
  errors: Record<string, FieldError>;
  label?: string;
  name: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  register: UseFormRegister<FormData>;
  validation?: Message | undefined;
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

export interface FieldData {
  value: number | null | string;
  label: string | undefined;
}
