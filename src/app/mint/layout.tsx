"use client";

import AppLayout from "@/components/layout";
import type { FC, PropsWithChildren } from "react";

const MintLayout: FC<PropsWithChildren> = function ({ children }) {
  return <AppLayout>{children}</AppLayout>;
};

export default MintLayout;
