import { FormData } from "./inputs";

export interface IOnSubmit {
  data: FormData;
  setSubmitIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}
