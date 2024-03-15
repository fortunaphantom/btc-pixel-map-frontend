import { network } from "@/config";
import mempoolJS from "@mempool/mempool.js";
import { delay } from "../time";

export const waitForTx = async (txId: string) => {
  const {
    bitcoin: { transactions },
  } = mempoolJS({
    hostname: "mempool.space",
    network: network,
  });

  // wait while transaction to be confirmed
  while (true) {
    const status = await transactions.getTxStatus({ txid: txId });
    if (status.confirmed) {
      break;
    }
    await delay(2000);
  }

  return { success: true };
};
