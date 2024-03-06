import { useConnect } from "@/contexts/WalletConnectProvider";
import signPsbt, {
  SerializedPsbt,
  SignPsbtOptionsParams,
} from "@/helpers/lib/signPsbt";
import { Psbt } from "bitcoinjs-lib";
import { useCallback } from "react";

export function useSign() {
  const { network, publicKey, format, wallet } = useConnect();

  const sign = useCallback(
    (
      address: string,
      unsignedPsbtBase64: string,
      options: SignPsbtOptionsParams,
    ): Promise<SerializedPsbt> =>
      new Promise(async (res, rej) => {
        try {
          if (!format || !publicKey || !wallet) {
            throw new Error("No wallet is connected");
          }

          const unsignedPsbt = Psbt.fromBase64(unsignedPsbtBase64);

          console.log(unsignedPsbt);

          const signedPsbt = await signPsbt({
            address,
            wallet,
            network,
            psbt: unsignedPsbt,
            options: {
              ...options,
              sigHash: unsignedPsbt?.data?.inputs?.[0]?.sighashType,
            },
          });

          res(signedPsbt);
        } catch (err) {
          rej((err as Error).message);
        }
      }),
    [format, network, publicKey, wallet],
  );

  return { sign };
}
