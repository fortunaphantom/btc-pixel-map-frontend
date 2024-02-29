import { FC, PropsWithChildren } from "react";
import AuthContextProvider from "./AuthContext";
import CurrentTimeContextProvider from "./CurrentTimeContext";
import PixelDataProvider from "./PixelDataContext";
import SidebarProvider from "./SidebarContext";
import WalletConnectProviders from "./WalletConnectProvider";

const ContextProviders: FC<PropsWithChildren> = ({ children }) => {
  return (
    <WalletConnectProviders>
      <AuthContextProvider>
        <CurrentTimeContextProvider>
          <SidebarProvider>
            <PixelDataProvider>{children}</PixelDataProvider>
          </SidebarProvider>
        </CurrentTimeContextProvider>
      </AuthContextProvider>
    </WalletConnectProviders>
  );
};

export default ContextProviders;
