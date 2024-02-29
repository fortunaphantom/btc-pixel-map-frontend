"use client";
import { SelectWalletModal } from "@/components/modal/SelectWalletModal";
import { isDevelopment } from "@/config";
import { Network, Wallet } from "@/config/constant";
import { useLocalStorage } from "@/hooks";
import { AddressFormat, JsonRpcDatasource } from "@ordzaar/ordit-sdk";
import {
  FC,
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

export interface BiAddress<T> {
  payments: T | null;
  ordinals: T | null;
}

type BiAddressString = BiAddress<string>;
type BiAddressFormat = BiAddress<AddressFormat>;

const EMPTY_BIADDRESS_OBJECT = {
  payments: null,
  ordinals: null,
};

interface WalletConnectContextType {
  address: BiAddressString;
  updateAddress: (address: BiAddressString) => void;
  publicKey: BiAddressString;
  updatePublicKey: (publicKey: BiAddressString) => void;
  network: Network;
  updateNetwork: (network: Network) => void;
  wallet: Wallet | null;
  updateWallet: (wallet: Wallet | null) => void;
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  format: BiAddressFormat;
  updateFormat: (format: BiAddressFormat) => void;
  disconnectWallet: () => void;
  datasource: JsonRpcDatasource;
}

const WalletConnectContext = createContext<
  WalletConnectContextType | undefined
>(undefined);

const ADDRESS = "address";
const WALLET = "wallet";
const PUBLIC_KEY = "publicKey";
const FORMAT = "format";
const NETWORK = "network";

const datasource = new JsonRpcDatasource({
  network: isDevelopment ? Network.TESTNET : Network.MAINNET,
});

const WalletConnectProviders: FC<PropsWithChildren> = ({ children }) => {
  const [address, setAddress] = useLocalStorage<BiAddressString>(
    ADDRESS,
    EMPTY_BIADDRESS_OBJECT,
  );

  const [network, setNetwork] = useLocalStorage<Network>(
    NETWORK,
    isDevelopment ? Network.TESTNET : Network.MAINNET,
  );

  const [wallet, setWallet] = useLocalStorage<Wallet | null>(WALLET, null);
  const [publicKey, setPublicKey] = useLocalStorage<BiAddressString>(
    PUBLIC_KEY,
    EMPTY_BIADDRESS_OBJECT,
  );

  const [format, setFormat] = useLocalStorage<BiAddressFormat>(
    FORMAT,
    EMPTY_BIADDRESS_OBJECT,
  );

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const openModal = useCallback(() => setIsModalOpen(true), []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);

  const disconnectWallet = useCallback(() => {
    setAddress(EMPTY_BIADDRESS_OBJECT);
    setPublicKey(EMPTY_BIADDRESS_OBJECT);
    setFormat(EMPTY_BIADDRESS_OBJECT as BiAddressFormat);
    setWallet(null);
  }, [setAddress, setFormat, setPublicKey, setWallet]);

  const context: WalletConnectContextType = useMemo(
    () => ({
      address,
      updateAddress: setAddress,
      publicKey,
      updatePublicKey: setPublicKey,
      network,
      updateNetwork: setNetwork,
      wallet,
      updateWallet: setWallet,
      isModalOpen,
      openModal,
      closeModal,
      format,
      updateFormat: setFormat,
      disconnectWallet,
      datasource,
    }),
    [
      address,
      setAddress,
      publicKey,
      setPublicKey,
      network,
      setNetwork,
      wallet,
      setWallet,
      isModalOpen,
      openModal,
      closeModal,
      format,
      setFormat,
      disconnectWallet,
    ],
  );

  return (
    <WalletConnectContext.Provider value={context}>
      {children}
      <SelectWalletModal isOpen={isModalOpen} closeModal={closeModal} />
    </WalletConnectContext.Provider>
  );
};

export default WalletConnectProviders;

export function useConnect() {
  const context = useContext(WalletConnectContext);

  if (!context) {
    throw new Error("useConnect must be used within WalletConnectProvider");
  }

  return context;
}
