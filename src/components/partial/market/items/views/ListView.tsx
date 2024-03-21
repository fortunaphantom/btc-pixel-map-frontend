import { useCurrentTime } from "@/contexts/CurrentTimeContext";
import { useConnect } from "@/contexts/WalletConnectProvider";
import { formatBtcWithUnit, parseIpfsUrl, shortenString } from "@/helpers";
import { formatRemainingInterval } from "@/helpers/time";
import { Table } from "flowbite-react";
import Image from "next/image";
import Link from "next/link";
import { FC, useMemo } from "react";

type Props = {
  pixels: Pixel[];
};

const ListView: FC<Props> = ({ pixels }) => {
  return (
    <Table striped>
      <Table.Head>
        <Table.HeadCell>Item</Table.HeadCell>
        <Table.HeadCell>Current Price</Table.HeadCell>
        <Table.HeadCell>Last Sale</Table.HeadCell>
        <Table.HeadCell>Owner</Table.HeadCell>
        <Table.HeadCell>Expires In</Table.HeadCell>
      </Table.Head>
      <Table.Body className="divide-y">
        {pixels.map((pixel) => (
          <ListRow key={pixel.id} pixel={pixel} />
        ))}
      </Table.Body>
    </Table>
  );
};

export default ListView;

type RowProps = {
  pixel: Pixel;
};

const ListRow: FC<RowProps> = ({ pixel }) => {
  const now = useCurrentTime();
  const { address } = useConnect();

  const listingExpires = useMemo(() => {
    if (!pixel?.listing) {
      return 0;
    }

    return Math.round(new Date(pixel.listing.expires).getTime() / 1000);
  }, [pixel?.listing]);

  // const bestOffer = useMemo(() => {
  //   const offers = (pixel.orders ?? []).filter((order) => order.side == "Buy");
  //   if (!offers.length) {
  //     return undefined;
  //   }

  //   if (offers.length == 1) {
  //     return offers[0];
  //   }

  //   return offers.reduce((prev: OrderData, current: OrderData) =>
  //     BigInt(prev.price) > BigInt(current.price) ? prev : current,
  //   );
  // }, [pixel.orders]);

  return (
    <Table.Row className="bg-white dark:border-slate-700 dark:bg-slate-800">
      <Table.Cell className="whitespace-nowrap font-medium text-slate-900 dark:text-white">
        <Link href={`/market/${pixel.id}`}>
          <div className="flex max-w-[12vw] items-center">
            <div className="relative h-10 w-10 overflow-hidden rounded-sm">
              <div className="relative flex h-full min-h-[inherit] w-full flex-col items-center justify-center rounded-[inherit]">
                <Image
                  layout="fill"
                  src={parseIpfsUrl(pixel.image)}
                  alt="Asset Image"
                />
              </div>
            </div>
            <div className="ml-5 max-w-[calc(100%-80px)] gap-2">
              <div className="flex flex-col gap-1">
                <span className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-sm font-semibold">
                  {pixel.name}
                </span>
                <span className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-xs font-semibold opacity-70">
                  {pixel.right - pixel.left + 1} X{" "}
                  {pixel.bottom - pixel.top + 1}
                </span>
              </div>
            </div>
          </div>
        </Link>
      </Table.Cell>
      <Table.Cell>
        {pixel?.listing?.price && listingExpires >= now
          ? `Price: ${formatBtcWithUnit(pixel.listing.price)} BTC`
          : " "}
      </Table.Cell>
      <Table.Cell>
        {pixel?.lastPrice ? `${formatBtcWithUnit(pixel?.lastPrice)} BTC` : "--"}
      </Table.Cell>
      <Table.Cell>
        <Link href={`/profile/${pixel.ownerId}`}>
          {pixel.ownerId == address?.ordinals
            ? "You"
            : pixel.owner?.name ?? shortenString(pixel.ownerId)}
        </Link>
      </Table.Cell>
      <Table.Cell>
        {(listingExpires ?? 0) >= now
          ? formatRemainingInterval((listingExpires ?? 0) - now)
          : "--"}
      </Table.Cell>
    </Table.Row>
  );
};
