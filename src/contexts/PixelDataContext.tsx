"use client";

import { getPixels } from "@/helpers/api";
import type { FC, PropsWithChildren } from "react";
import { createContext, useContext, useEffect, useState } from "react";

interface PixelDataContextProps {
  pixels: Pixel[];
  refresh: () => Promise<void>;
}

const PixelDataContext = createContext<PixelDataContextProps>(
  {} as PixelDataContextProps,
);

const PixelDataProvider: FC<PropsWithChildren> = ({ children }) => {
  const [pixels, setPixels] = useState<Pixel[]>([]);

  const refresh = async () => {
    let temp: Pixel[] = [];
    let offset = 0;
    const limit = 100;

    while (true) {
      const data = await getPixels(offset, limit);
      temp = [...temp, ...data];
      setPixels(temp);
      if (data?.length < 100) {
        break;
      }
      offset += 100;
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <PixelDataContext.Provider
      value={{
        pixels,
        refresh,
      }}
    >
      {children}
    </PixelDataContext.Provider>
  );
};

export default PixelDataProvider;

export function usePixelDataContext(): PixelDataContextProps {
  const context = useContext(PixelDataContext);

  if (typeof context === "undefined") {
    throw new Error(
      "usePixelDataContext should be used within the PixelDataContext provider!",
    );
  }

  return context;
}
