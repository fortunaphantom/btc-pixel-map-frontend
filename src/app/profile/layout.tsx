"use client";

import AppLayout from "@/components/layout";
import type { FC, PropsWithChildren } from "react";

const ProfileLayout: FC<PropsWithChildren> = function ({ children }) {
  return <AppLayout>{children}</AppLayout>;
};

export default ProfileLayout;
