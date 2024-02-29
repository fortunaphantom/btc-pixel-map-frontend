"use client";

import { Wallet } from "@/config/constant";
import { useConnect } from "@/contexts/WalletConnectProvider";
import { isMobileUserAgent } from "@/helpers/mobile-detector";
import { waitForUnisatExtensionReady } from "@/helpers/unisat";
import {
  BrowserWalletNotInstalledError,
  BrowserWalletRequestCancelledByUserError,
} from "@ordzaar/ordit-sdk";
import { getAddresses as getUnisatAddresses } from "@ordzaar/ordit-sdk/unisat";
import { getAddresses as getXverseAddresses } from "@ordzaar/ordit-sdk/xverse";
import { Button, Modal } from "flowbite-react";
import { FC, useCallback, useEffect } from "react";
import toast from "react-hot-toast";

import { default as UnisatIcon } from "@/assets/icon/unisat-wallet.svg";
import { default as XVerseIcon } from "@/assets/icon/xverse-wallet.svg";
import Image from "next/image";

interface SelectWalletModalProp {
  isOpen: boolean;
  closeModal: () => void;
  disableMobile?: boolean;
}

const WALLET_CHROME_EXTENSION_URL: Record<Wallet, string> = {
  [Wallet.UNISAT]: "https://unisat.io/download", // their www subdomain doesn't work
  [Wallet.XVERSE]: "https://www.xverse.app/download",
};

export const SelectWalletModal: FC<SelectWalletModalProp> = ({
  isOpen,
  closeModal,
  disableMobile,
}) => {
  const {
    updateAddress,
    network,
    updateWallet,
    updatePublicKey,
    updateFormat,
    wallet,
    format,
    address,
    publicKey,
    disconnectWallet,
  } = useConnect();

  const isMobile = isMobileUserAgent();
  const isSupportedDevice = !disableMobile || !isMobile;

  const onError = useCallback(
    (
      walletProvider: Wallet,
      err:
        | BrowserWalletNotInstalledError
        | BrowserWalletRequestCancelledByUserError
        | Error,
    ) => {
      if (err instanceof BrowserWalletNotInstalledError) {
        window.open(
          // eslint-disable-next-line security/detect-object-injection
          WALLET_CHROME_EXTENSION_URL[walletProvider],
          "_blank",
          "noopener,noreferrer",
        );
      }
      toast.error(err.message ?? err.toString());
      console.error(`Error while connecting to ${walletProvider} wallet`, err);
      disconnectWallet();
    },
    [disconnectWallet],
  );

  const onConnectUnisatWallet = useCallback(
    async ({ readOnly }: { readOnly?: boolean } = {}) => {
      try {
        const unisat = await getUnisatAddresses(network, readOnly);

        if (!unisat || unisat.length < 1) {
          disconnectWallet();
          throw new Error("Unisat via Ordit returned no addresses.");
        }

        // Unisat only returns one wallet by default
        const unisatWallet = unisat[0];
        updateAddress({
          ordinals: unisatWallet.address,
          payments: unisatWallet.address,
        });
        updatePublicKey({
          ordinals: unisatWallet.publicKey,
          payments: unisatWallet.publicKey,
        });
        updateWallet(Wallet.UNISAT);
        updateFormat({
          ordinals: unisatWallet.format,
          payments: unisatWallet.format,
        });

        closeModal();
        return true;
      } catch (err) {
        onError(Wallet.UNISAT, err as Error);
        return false;
      }
    },
    [
      closeModal,
      disconnectWallet,
      network,
      onError,
      updateAddress,
      updateFormat,
      updatePublicKey,
      updateWallet,
    ],
  );

  const onConnectXverseWallet = useCallback(async () => {
    try {
      const xverse = await getXverseAddresses(network);
      // P2SH-P2WPKH = BTC
      // Taproot = Ordinals / Inscriptions
      if (!xverse || xverse.length < 1) {
        disconnectWallet();
        throw new Error("Xverse via Ordit returned no addresses.");
      }

      const p2sh = xverse.find(
        (walletAddress) => walletAddress.format === "p2sh-p2wpkh",
      );
      const taproot = xverse.find(
        (walletAddress) => walletAddress.format === "taproot",
      );

      if (!p2sh || !taproot) {
        throw new Error(
          "Xverse via Ordit did not return P2SH or Taproot addresses.",
        );
      }

      updateAddress({
        ordinals: taproot.address,
        payments: p2sh.address,
      });
      updatePublicKey({
        ordinals: taproot.publicKey,
        payments: p2sh.publicKey,
      });
      updateWallet(Wallet.XVERSE);
      updateFormat({
        ordinals: taproot.format,
        payments: p2sh.format,
      });
      closeModal();
      return true;
    } catch (err) {
      onError(Wallet.XVERSE, err as Error);
      return false;
    }
  }, [
    closeModal,
    disconnectWallet,
    network,
    onError,
    updateAddress,
    updateFormat,
    updatePublicKey,
    updateWallet,
  ]);

  // Reconnect address change listener if there there is already a connected wallet
  // eslint-disable-next-line sonarjs/cognitive-complexity
  useEffect(() => {
    if (wallet !== Wallet.UNISAT) {
      return undefined;
    }

    let isMounted = true;
    let isConnectSuccessful = false;
    const listener = () => onConnectUnisatWallet();

    if (address && publicKey && format) {
      const connectToUnisatWalletOnReady = async () => {
        const isUnisatExtensionReady = await waitForUnisatExtensionReady();
        if (!isMounted) {
          return;
        }
        if (!isUnisatExtensionReady) {
          disconnectWallet();
          return;
        }

        isConnectSuccessful = await onConnectUnisatWallet({ readOnly: true });
        if (!isMounted) {
          return;
        }

        if (isConnectSuccessful) {
          window.unisat.addListener("accountsChanged", listener);
        }
      };
      connectToUnisatWalletOnReady();
    }
    return () => {
      isMounted = false;
      if (isConnectSuccessful) {
        window.unisat.removeListener("accountsChanged", listener);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet, onConnectUnisatWallet, disconnectWallet]);

  return (
    <Modal show={isOpen} size="sm" onClose={closeModal}>
      <Modal.Header>
        {isSupportedDevice ? "Choose wallet to connect" : "Unsupported device"}
      </Modal.Header>
      <Modal.Body>
        <p className="mt-4 text-sm font-normal text-gray-500 dark:text-gray-400">
          Connect with one of our available wallet providers or create a new
          one.
        </p>
        <ul className="my-4 grid grid-cols-1 space-y-3">
          <li>
            <Button
              color="gray"
              className="grid w-full grid-cols-1"
              size="lg"
              onClick={() => onConnectXverseWallet()}
            >
              <Image src={XVerseIcon} alt="xverse" className="mr-2 h-8 w-8" />
              <span className="flex-1 text-start">XVerse</span>
              <span className="ms-3 inline-flex items-center justify-center rounded bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-500 dark:bg-gray-700 dark:text-gray-400">
                Popular
              </span>
            </Button>
          </li>
          {!isMobile && ( // TODO:: remove this once unisat supported on mobile devices
            <li>
              <Button
                color="gray"
                className="grid w-full grid-cols-1"
                size="lg"
                onClick={() => onConnectUnisatWallet({ readOnly: false })}
              >
                <Image src={UnisatIcon} alt="unisat" className="mr-2 h-8 w-8" />
                <span className="flex-1 text-start">Unisat</span>
              </Button>
            </li>
          )}
        </ul>
      </Modal.Body>
    </Modal>
  );
};
