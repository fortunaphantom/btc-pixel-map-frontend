import { isDevelopment } from "@/config";
import mempoolJS from "@mempool/mempool.js";
import { getRevealState } from "../api/mint";
import { delay } from "../time";

export const waitForReveal = async (account: string, depositTx: string) => {
  const {
    bitcoin: { transactions },
  } = mempoolJS({
    hostname: "mempool.space",
    network: isDevelopment ? "testnet" : "mainnet",
  });

  // wait while deposit transaction to be confirmed
  while (true) {
    const status = await transactions.getTxStatus({ txid: depositTx });
    if (status.confirmed) {
      break;
    }
    await delay(1000);
  }

  // wait 10s
  await delay(10000);

  const revealState = await getRevealState(account);
  while (true) {
    const status = await transactions.getTxStatus({ txid: revealState.id });
    if (status.confirmed) {
      break;
    }
    await delay(1000);
  }
};
