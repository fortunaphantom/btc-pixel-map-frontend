import AppLayout from "@/components/layout";
import type { FC, PropsWithChildren } from "react";

const MarketLayout: FC<PropsWithChildren> = function ({ children }) {
  return <AppLayout>{children}</AppLayout>;
};

export default MarketLayout;

export const metadata = {
  title: "PixelMap Marketplace",
  description: "Users can list/buy Pixels",
};
