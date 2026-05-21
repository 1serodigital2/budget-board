import { HandleInputChangeProps } from "./FormTypes";

export interface LoginFormType extends HandleInputChangeProps{
  loading: boolean;
  handleFormSubmit: (e: React.SubmitEvent) => void;
}