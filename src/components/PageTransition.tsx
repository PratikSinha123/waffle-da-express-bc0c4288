import { ReactNode } from "react";

const PageTransition = ({ children }: { children: ReactNode }) => (
  <div className="w-full min-h-screen">
    {children}
  </div>
);

export default PageTransition;
