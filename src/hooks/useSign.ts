import { Psbt } from "bitcoinjs-lib";
import { useCallback, useState } from "react";

import { useConnect } from "@/contexts/WalletConnectProvider";
import signPsbt, {
  SerializedPsbt,
  SignPsbtOptionsParams,
} from "@/helpers/lib/signPsbt";

export function useSign() {
  const { network, publicKey, format, wallet } = useConnect();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const sign = useCallback(
    async (
      address: string,
      unsignedPsbtBase64: string,
      options: SignPsbtOptionsParams,
    ): Promise<SerializedPsbt> => {
      setLoading(true);
      try {
        setError(null);
        if (!format || !publicKey || !wallet) {
          throw new Error("No wallet is connected");
        }

        const unsignedPsbt = Psbt.fromBase64(unsignedPsbtBase64);

        const signedPsbt = await signPsbt({
          address,
          wallet,
          network,
          psbt: unsignedPsbt,
          options,
        });

        setLoading(false);
        return signedPsbt;
      } catch (err) {
        setError((err as Error).message);
        setLoading(false);
        throw err;
      }
    },
    [format, network, publicKey, wallet],
  );

  return { sign, error, loading };
}
