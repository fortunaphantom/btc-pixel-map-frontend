import { useCallback } from "react";

import { useConnect } from "@/contexts/WalletConnectProvider";
import signMessage from "@/helpers/lib/signMessage";

export function useSignMessage() {
  const { network, wallet, publicKey, format } = useConnect();

  const signMsg = useCallback(
    (address: string, message: string) =>
      new Promise(async (res, rej) => {
        try {
          if (!format || !publicKey || !wallet) {
            throw new Error("No wallet is connected");
          }

          const signedMessage = await signMessage({
            address,
            wallet,
            message,
            network,
          });

          res(signedMessage);
        } catch (err) {
          rej((err as Error).message);
          throw err;
        }
      }),
    [format, network, publicKey, wallet],
  );

  return { signMsg };
}
