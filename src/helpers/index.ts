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

export const formatNumberWithUnit = (
  amount: number,
  displayDecimals: number = 2,
  // eslint-disable-next-line sonarjs/cognitive-complexity
) => {
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
      return amount >= item.value;
    });

  if (!item) {
    let i = 0;
    for (; ; i--) {
      if (amount >= Math.pow(10, i)) {
        break;
      }
    }

    if (i <= 3) {
      return `${Math.round(amount * 1000000) / 1000000}`;
    }

    return `${(amount / Math.pow(10, i)).toFixed(displayDecimals)}*1e${i}`;
  }

  if (amount > 1000 * (item?.value ?? 1)) {
    let i = 21;
    for (; ; i++) {
      if (amount < Math.pow(10, i + 1)) {
        break;
      }
    }

    return `${(amount / Math.pow(10, i)).toFixed(displayDecimals)}*1e${i}`;
  }

  return (
    (amount / (item?.value ?? 1)).toFixed(displayDecimals).replace(rx, "$1") +
    (item?.symbol ?? "")
  );
};

// export const formatBigIntWithUnits = (
//   value: bigint,
//   decimals: number = 18,
//   displayDecimals: number = 2,
// ) => {
//   return formatNumberWithUnit(
//     parseFloat(formatUnits(value, decimals)),
//     displayDecimals,
//   );
// };
