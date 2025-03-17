import { ReactNode } from "react";

interface Props {
  children: ReactNode; // allows passing child components -- reactnode allows pass html content
}

const Alert = ({ children }: Props) => {
  return <div className="alert alert-primary">{children}</div>;
};

export default Alert;
