import PixelCard from "@/components/partial/PixelCard";
import { useSidebarContext } from "@/context/SidebarContext";
import { FC } from "react";
import { twMerge } from "tailwind-merge";

type Props = {
  isSidebarOpen: boolean;
  pixels: Pixel[];
};

const GridView: FC<Props> = ({ pixels, isSidebarOpen }) => {
  const { isCollapsed } = useSidebarContext();

  return (
    <div
      className={twMerge(
        "grid w-full gap-4 p-2",
        !isCollapsed && isSidebarOpen
          ? "grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
          : !isCollapsed
            ? "grid-cols-1 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6"
            : isSidebarOpen
              ? "grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6"
              : "grid-cols-1 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7",
      )}
    >
      {pixels.map((pixel) => (
        <PixelCard key={pixel.tokenId} pixel={pixel} />
      ))}
    </div>
  );
};

export default GridView;
