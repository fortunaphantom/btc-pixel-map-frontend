"use client";

import { sideMenuList } from "@/config/menu";
import { useSidebarContext } from "@/contexts/SidebarContext";
import { Sidebar } from "flowbite-react";
import { usePathname } from "next/navigation";
import type { FC } from "react";
import { BiBuoy } from "react-icons/bi";
import { HiViewBoards } from "react-icons/hi";
import { twMerge } from "tailwind-merge";

const AppSidebar: FC = function () {
  const { isCollapsed } = useSidebarContext();
  const asPath = usePathname();

  return (
    <Sidebar
      aria-label="Sidebar with multi-level dropdown example"
      collapsed={isCollapsed}
      id="sidebar"
      className={twMerge(
        "fixed inset-y-0 left-0 z-30 mt-16 flex h-full shrink-0 flex-col border-r border-slate-200 duration-75 dark:border-slate-700 lg:flex",
        isCollapsed && "hidden w-16",
      )}
    >
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          {sideMenuList.map((item) => (
            <Sidebar.Item
              key={item.title}
              href={item.link}
              icon={item.icon}
              active={asPath == item?.link}
              className="mb-1"
            >
              <span className="text-sm">{item.title}</span>
            </Sidebar.Item>
          ))}
        </Sidebar.ItemGroup>
        <Sidebar.ItemGroup>
          <Sidebar.Item href="#" icon={HiViewBoards}>
            <span className="text-sm">Documentation</span>
          </Sidebar.Item>
          <Sidebar.Item href="#" icon={BiBuoy}>
            <span className="text-sm">Help</span>
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
};

export default AppSidebar;
