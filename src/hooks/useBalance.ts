import { useConnect } from "@/contexts/WalletConnectProvider";
import {
  ADDRESS_FORMAT_TO_TYPE,
  AddressType,
  getAddressesFromPublicKey,
} from "@ordzaar/ordit-sdk";
import { useCallback } from "react";

export function useBalance() {
  const { network, publicKey, format, datasource } = useConnect();

  const getBalance = useCallback(
    async (): Promise<number> =>
      new Promise(async (res, rej) => {
        try {
          if (
            !format ||
            !format.payments ||
            !publicKey ||
            !publicKey.payments
          ) {
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
            (
              total: number,
              spendable: { safeToSpend: boolean; sats: number },
            ) => (spendable.safeToSpend ? total + spendable.sats : total),
            0,
          );

          res(totalSatsAvailable);
        } catch (err) {
          rej((err as Error).message);
        }
      }),
    [datasource, format, network, publicKey],
  );

  return { getBalance };
}
