import AppLayout from "@/components/layout";
import type { FC, PropsWithChildren } from "react";

const MintLayout: FC<PropsWithChildren> = function ({ children }) {
  return <AppLayout>{children}</AppLayout>;
};

export default MintLayout;

export const metadata = {
  title: "Mint Pixel",
  description: "Mints pixels for brand",
};
