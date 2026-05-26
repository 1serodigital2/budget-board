import type { ReactNode } from "react";

type H1Props = {
  children: ReactNode;
};

const H1 = ({ children }: H1Props) => {
  return <h1 className="text-2xl font-medium mb-4">{children}</h1>;
};

export default H1;
