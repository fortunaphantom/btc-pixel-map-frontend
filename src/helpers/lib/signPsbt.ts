import { Network, Wallet } from "@/config/constant";
import { signPsbt as signUnisatPsbt } from "@ordzaar/ordit-sdk/unisat";
import { signPsbt as signXversePsbt } from "@ordzaar/ordit-sdk/xverse";
import { Psbt } from "bitcoinjs-lib";

export interface SignPsbtOptionsParams {
  finalize?: boolean;
  extractTx?: boolean;
  signingIndexes?: number[];
  sigHash?: number;
}

interface SignPsbtParams {
  address: string;
  wallet: Wallet;
  network: Network;
  psbt: Psbt;
  options?: SignPsbtOptionsParams;
}

export interface SerializedPsbt {
  hex: string;
  base64: string | null;
}

/**
 * @description accept wallet type and calls the right ordit function to sign the psbt.
 * @param wallet
 * @param network
 * @param psbt
 * @param options
 */
export default async function signPsbt({
  address,
  wallet,
  network,
  psbt,
  options,
}: SignPsbtParams): Promise<SerializedPsbt> {
  const finalize = options?.finalize ?? true;
  const extractTx = options?.extractTx ?? true;

  if (wallet === Wallet.UNISAT) {
    return await signUnisatPsbt(psbt, {
      finalize,
      extractTx,
    });
  }

  if (wallet === Wallet.XVERSE) {
    const getAllInputIndices = () =>
      psbt.data.inputs.map((value, index) => index);

    return await signXversePsbt(psbt, {
      network,
      inputsToSign: [
        {
          address,
          signingIndexes: options?.signingIndexes ?? getAllInputIndices(), // If signingIndexes is not provided, just sign everything
          sigHash: options?.sigHash,
        },
      ],
      finalize,
      extractTx,
    });
  }
  // else throw error
  throw new Error("Invalid wallet selected");
}
