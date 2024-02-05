import { FC, PropsWithChildren } from "react";
import AppNavbar from "./navbar";
import AppSidebar from "./sidebar";
import ContentWrapper from "./wrapper";

const AppLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <AppNavbar />
      <div className="flex h-screen items-start pt-16 text-slate-900 dark:text-white">
        <AppSidebar />
        <ContentWrapper>{children}</ContentWrapper>
      </div>
    </>
  );
};

export default AppLayout;
