import { isDevelopment } from "@/config";
import mempoolJS from "@mempool/mempool.js";
import { FeesRecommended } from "@mempool/mempool.js/lib/interfaces/bitcoin/fees";
import { useEffect, useState } from "react";

const {
  bitcoin: { fees },
} = mempoolJS({
  hostname: "mempool.space",
  network: isDevelopment ? "testnet" : "mainnet",
});

export const useFeeRecommended = () => {
  const [feesRecommended, setFeesRecommended] = useState<FeesRecommended>();

  useEffect(() => {
    fees.getFeesRecommended().then(setFeesRecommended);
  }, []);

  return feesRecommended;
};
