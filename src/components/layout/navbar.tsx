import { useSidebarContext } from "@/contexts/SidebarContext";
import { isSmallScreen } from "@/helpers/is-small-screen";
import { DarkThemeToggle, Navbar } from "flowbite-react";
import dynamic from "next/dynamic";
import type { FC } from "react";
import { HiMenuAlt1, HiX } from "react-icons/hi";

const ConnectButton = dynamic(() => import("./ConnectButton"), {
  ssr: false,
});

const AppNavbar: FC<Record<string, never>> = function () {
  const { isCollapsed: isSidebarCollapsed, setCollapsed: setSidebarCollapsed } =
    useSidebarContext();

  return (
    <header>
      <Navbar
        fluid
        className="fixed top-0 z-30 h-16 w-full border-b border-slate-200 bg-white p-0 dark:border-slate-700 dark:bg-slate-800 sm:p-0"
      >
        <div className="w-full p-3 pr-4">
          <div className="flex h-full items-center justify-between">
            <div className="flex items-center">
              <button
                aria-controls="sidebar"
                aria-expanded
                className="mr-2 cursor-pointer rounded p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:bg-slate-100 focus:ring-2 focus:ring-slate-100 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white dark:focus:bg-slate-700 dark:focus:ring-slate-700"
                onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
              >
                {isSidebarCollapsed || !isSmallScreen() ? (
                  <HiMenuAlt1 className="h-6 w-6" />
                ) : (
                  <HiX className="h-6 w-6" />
                )}
              </button>
              <Navbar.Brand href="/">
                <span className="self-center whitespace-nowrap px-3 text-xl font-semibold dark:text-white">
                  PixelMap
                </span>
              </Navbar.Brand>
            </div>
            <div className="flex justify-items-center gap-2">
              <ConnectButton />
              <DarkThemeToggle />
            </div>
          </div>
        </div>
      </Navbar>
    </header>
  );
};

export default AppNavbar;
