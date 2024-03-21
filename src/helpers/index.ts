import { IPFS_GATEWAY } from "@/config";
// import { formatUnits } from "viem";

export const parseIpfsUrl = (ipfsUrl?: string) => {
  return ipfsUrl?.replace("ipfs://", IPFS_GATEWAY) ?? "";
};

export const shortenString = (
  address: string | null | undefined,
  preLength: number = 6,
  backLength: number = 4,
) => {
  if (!address) {
    return undefined;
  }

  if (address.length < preLength + backLength) {
    return address;
  }

  return (
    address.substring(0, preLength) +
    "..." +
    address.substring(address.length - backLength)
  );
};

export const formatBtcWithUnit = (
  amount: number,
  displayDecimals: number = 2,
  // eslint-disable-next-line sonarjs/cognitive-complexity
) => {
  const amountInBtc = amount / 100_000_000;

  const lookup = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "k" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "G" },
    { value: 1e12, symbol: "T" },
    { value: 1e15, symbol: "P" },
    { value: 1e18, symbol: "E" },
  ];

  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  const item = lookup
    .slice()
    .reverse()
    .find(function (item) {
      return amountInBtc >= item.value;
    });

  if (!item) {
    let i = 0;
    for (; ; i--) {
      if (amountInBtc >= Math.pow(10, i)) {
        break;
      }
    }

    if (i <= 3) {
      return `${Math.round(amountInBtc * 1000000) / 1000000}`;
    }

    return `${(amountInBtc / Math.pow(10, i)).toFixed(displayDecimals)}*1e${i}`;
  }

  if (amountInBtc > 1000 * (item?.value ?? 1)) {
    let i = 21;
    for (; ; i++) {
      if (amountInBtc < Math.pow(10, i + 1)) {
        break;
      }
    }

    return `${(amountInBtc / Math.pow(10, i)).toFixed(displayDecimals)}*1e${i}`;
  }

  return (
    (amountInBtc / (item?.value ?? 1))
      .toFixed(displayDecimals)
      .replace(rx, "$1") + (item?.symbol ?? "")
  );
};
