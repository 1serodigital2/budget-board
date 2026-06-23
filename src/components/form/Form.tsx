import { ReactNode, ComponentProps } from "react";

interface FormProps extends ComponentProps<"form"> {
  children: ReactNode;
}

const MyForm = ({ children, ...props }: FormProps) => {
  return (
    <form
      {...props}
      className="flex items-center gap-3 max-w-md bg-white rounded-lg border mb-3 px-3"
    >
      {children}
    </form>
  );
};

export default MyForm;
