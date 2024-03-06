"use client";

import ConnectButton from "@/components/layout/ConnectButton";
import UserProfile from "@/components/partial/profile";
import { useConnect } from "@/contexts/WalletConnectProvider";
import { NextPage } from "next";

const ProfileContent: NextPage = () => {
  const { address } = useConnect();
  return address?.ordinals ? (
    <UserProfile address={address.ordinals} />
  ) : (
    <div className="flex h-full w-full items-center justify-center">
      <ConnectButton />
    </div>
  );
};

export default ProfileContent;
