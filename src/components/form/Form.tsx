import { ReactNode, ComponentProps } from "react";

interface FormProps extends ComponentProps<"form"> {
  children: ReactNode;
}

const MyForm = ({ children, ...props }: FormProps) => {
  return (
    <form
      {...props}
      className="flex items-center gap-3 md:max-w-max bg-white rounded-lg border mb-3 px-2 md:px-3 py-1.5 md:py-2"
    >
      {children}
    </form>
  );
};

export default MyForm;
