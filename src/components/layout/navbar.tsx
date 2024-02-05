import { useSidebarContext } from "@/context/SidebarContext";
import { isSmallScreen } from "@/helpers/is-small-screen";
import { ConnectMultiButton } from "bitcoin-wallet-adapter";
import { DarkThemeToggle, Navbar } from "flowbite-react";
import type { FC } from "react";
import { HiMenuAlt1, HiX } from "react-icons/hi";

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
              <ConnectMultiButton
                walletImageClass="w-[60px]"
                walletLabelClass="pl-3 font-bold text-xl"
                walletItemClass="border w-full md:w-6/12 cursor-pointer border-transparent rounded-xl mb-4 hover:border-green-500 transition-all"
                headingClass="text-green-700 text-4xl pb-12 font-bold text-center"
                modalContentClass="text-slate-100"
                modalContainerClass="bg-slate-800 border border-slate-600 rounded-lg bwa-bg-black bwa-bg-opacity-75 bwa-h-screen bwa-w-full bwa_center"
                buttonClassname="bg-green-300 hover:bg-green-400 rounded-xl flex items-center text-green-800 px-4 py-auto h-full font-bold"
              />
              <DarkThemeToggle />
            </div>
          </div>
        </div>
      </Navbar>
    </header>
  );
};

export default AppNavbar;
