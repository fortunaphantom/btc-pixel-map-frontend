import { useSidebarContext } from "@/contexts/SidebarContext";
import { FC, PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

const ContentWrapper: FC<PropsWithChildren> = ({ children }) => {
  const { isCollapsed } = useSidebarContext();

  return (
    <div
      id="main-content"
      className={twMerge(
        "h-full min-h-[100vh-64px] w-full overflow-y-auto bg-slate-50 dark:bg-slate-900",
        isCollapsed ? "lg:ml-[4.5rem]" : "lg:ml-64",
      )}
    >
      {children}
    </div>
  );
};

export default ContentWrapper;
