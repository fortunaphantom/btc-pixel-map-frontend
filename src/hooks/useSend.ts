import { useConnect } from "@/contexts/WalletConnectProvider";
import signPsbt from "@/helpers/lib/signPsbt";
import { PSBTBuilder } from "@ordzaar/ordit-sdk";
import { useCallback } from "react";

type SendFunction = (
  address: string,
  satoshis: number,
  feeRate: number,
  relay?: boolean,
) => Promise<string | null>;

export function useSend() {
  const { wallet, network, address, publicKey, datasource } = useConnect();

  const send: SendFunction = useCallback(
    (toAddress, satoshis, feeRate, relay = true) =>
      new Promise(async (res, rej) => {
        try {
          if (
            !address ||
            !address.payments ||
            !publicKey ||
            !publicKey.payments ||
            !wallet
          ) {
            throw new Error("No wallet is connected");
          }

          const psbtBuilder = new PSBTBuilder({
            address: address.payments,
            feeRate,
            network,
            publicKey: publicKey.payments,
            outputs: [
              {
                address: toAddress,
                value: satoshis,
              },
            ],
          });
          await psbtBuilder.prepare();

          const signedPsbt = await signPsbt({
            address: address.payments,
            wallet,
            network,
            psbt: psbtBuilder.toPSBT(),
          });

          if (relay) {
            const txId = await datasource.relay({ hex: signedPsbt.hex });
            res(txId);
          }
          res(signedPsbt.hex);
        } catch (err) {
          rej((err as Error).message);
        }
      }),
    [address, datasource, network, publicKey, wallet],
  );

  return { send };
}
