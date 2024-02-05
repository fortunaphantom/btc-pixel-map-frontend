"use client";

import UserProfile from "@/components/partial/profile";
import { ConnectMultiButton, useWalletAddress } from "bitcoin-wallet-adapter";
import { NextPage } from "next";

const ProfileContent: NextPage = () => {
  const walletDetails = useWalletAddress();
  return walletDetails?.wallet ? (
    <UserProfile address={walletDetails.wallet} />
  ) : (
    <div className="flex h-full w-full items-center justify-center">
      <ConnectMultiButton
        walletImageClass="w-[60px]"
        walletLabelClass="pl-3 font-bold text-xl"
        walletItemClass="border w-full md:w-6/12 cursor-pointer border-transparent rounded-xl mb-4 hover:border-green-500 transition-all"
        headingClass="text-green-700 text-4xl pb-12 font-bold text-center"
        buttonClassname="bg-green-300 hover:bg-green-400 rounded-xl flex items-center text-green-800 px-4 py-1 font-bold"
      />
      ;
    </div>
  );
};

export default ProfileContent;
