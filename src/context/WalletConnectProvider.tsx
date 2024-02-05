"use client";
import { isDevelopment } from "@/config";
import { WalletProvider } from "bitcoin-wallet-adapter";
import { FC, PropsWithChildren } from "react";

export const network = isDevelopment ? "Testnet" : "Mainnet";

const WalletConnectProviders: FC<PropsWithChildren> = ({ children }) => {
  return (
    <WalletProvider
      customAuthOptions={{
        appDetails: { name: "My Example App" },
      }}
    >
      {children}
    </WalletProvider>
  );
};

export default WalletConnectProviders;
