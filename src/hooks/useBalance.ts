import { useConnect } from "@/contexts/WalletConnectProvider";
import {
  ADDRESS_FORMAT_TO_TYPE,
  AddressType,
  getAddressesFromPublicKey,
} from "@ordzaar/ordit-sdk";
import { useCallback, useState } from "react";

export function useBalance() {
  const { network, publicKey, format, datasource } = useConnect();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const getBalance = useCallback(async (): Promise<number> => {
    setLoading(true);
    try {
      setError(null);
      if (!format || !format.payments || !publicKey || !publicKey.payments) {
        throw new Error("No wallet is connected");
      }
      const { address } = getAddressesFromPublicKey(
        publicKey.payments,
        network,
        ADDRESS_FORMAT_TO_TYPE[format.payments] as Exclude<
          AddressType,
          "p2wsh"
        >,
      )[0];

      const { spendableUTXOs } = await datasource.getUnspents({
        address,
        type: "spendable",
      });

      const totalSatsAvailable = spendableUTXOs.reduce(
        (total: number, spendable: { safeToSpend: boolean; sats: number }) =>
          spendable.safeToSpend ? total + spendable.sats : total,
        0,
      );

      setLoading(false);
      return totalSatsAvailable;
    } catch (err) {
      setError((err as Error).message);
      setLoading(false);
      return 0; // Returning 0 as default value in case of an error
    }
  }, [datasource, format, network, publicKey]);

  return { getBalance, error, loading };
}
