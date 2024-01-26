import { Inputs } from './inputs';

export interface IOnSubmit {
  data: Inputs;
  setSubmitIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}
