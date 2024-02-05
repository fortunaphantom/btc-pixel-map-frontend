"use client";

import { MapBoard } from "@/components/partial/home/MapBoard";
import { NextPage } from "next";
import { twMerge } from "tailwind-merge";

const HomeContent: NextPage = () => {
  return (
    <div
      className={twMerge(
        "relative h-full overflow-auto transition-all duration-200",
      )}
    >
      <div className="m-auto h-full w-fit max-w-full overflow-auto">
        <MapBoard />
      </div>
    </div>
  );
};

export default HomeContent;
