"use client";

import { MintPanel } from "@/components/partial/mint/MintPannel";
import { NextPage } from "next";
import dynamic from "next/dynamic";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

const MapBoard = dynamic(() => import("@/components/partial/mint/MapBoard"), {
  ssr: false,
});

const MintPageContent: NextPage = () => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [rect, setRect] = useState<MintRect>();
  const [croppedImage, setCroppedImage] = useState<string>();

  return (
    <div
      className={twMerge(
        "relative h-full overflow-auto transition-all duration-200",
        isOpen && "lg:mr-64 xl:mr-72 2xl:mr-80",
      )}
    >
      <div className="m-auto h-full w-fit max-w-full overflow-auto">
        <MapBoard
          rect={rect}
          setRect={setRect}
          croppedImage={croppedImage}
          setCroppedImage={setCroppedImage}
        />
        <MintPanel
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          rect={rect}
          setRect={setRect}
          croppedImage={croppedImage}
          setCroppedImage={setCroppedImage}
        />
      </div>
    </div>
  );
};

export default MintPageContent;
