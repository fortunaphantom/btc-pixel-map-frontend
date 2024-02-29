/* eslint-disable jsx-a11y/label-has-associated-control */
"use client";

import {
  BidForm,
  CancelForm,
  FinishForm,
} from "@/components/partial/market/auction";
import { useCurrentTime } from "@/contexts/CurrentTimeContext";
import {
  // formatBigIntWithUnits,
  parseIpfsUrl,
  shortenString,
} from "@/helpers";
import { getAuctionDetail } from "@/helpers/api/market";
// import { dynamicBlurDataUrl } from "@/helpers/image";
import { formatTimeInterval } from "@/helpers/time";
import { Card, Label, Spinner } from "flowbite-react";
import { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { FaChevronLeft } from "react-icons/fa6";

const AuctionListContent: NextPage = () => {
  const { id } = useParams();
  // const [blurDataURL, setBlurDataURL] = useState<string>();
  const [auction, setAuction] = useState<Auction>();

  const now = useCurrentTime();

  const minWinPrice = useMemo(() => {
    if (!auction) {
      return undefined;
    }

    if (!auction.bidPrice) {
      return BigInt(auction.minPrice);
    }

    return (BigInt(auction.bidPrice) * BigInt(auction.minWinPercent)) / 100n;
  }, [auction]);

  const expired = useMemo(
    () => (auction?.endTime ? auction.endTime <= now : false),
    [auction?.endTime, now],
  );

  const status = useMemo(() => {
    if (!auction) {
      return <></>;
    }

    if (auction.startTime > now) {
      return (
        <div className="mr-2 block grow text-right text-sm font-medium text-gray-400">
          <span className="flex flex-row text-right">
            Live in:&nbsp;{" "}
            <span className="tracking-wide text-amber-400">
              {formatTimeInterval(auction.startTime - now)}
            </span>
          </span>
        </div>
      );
    } else if (!auction.endTime) {
      return (
        <div className="mr-2 block grow text-right text-sm font-medium text-gray-400">
          <span className="flex flex-row text-right">
            Status:&nbsp;{" "}
            <span className="tracking-wide text-emerald-500">Live</span>
          </span>
        </div>
      );
    } else if (auction.endTime < now) {
      return (
        <div className="mr-2 block grow text-right text-sm font-medium text-gray-400">
          <span className="flex flex-row text-right">
            Limited-time auction:&nbsp;{" "}
            <span className="tracking-wide text-red-500">Ended</span>
          </span>
        </div>
      );
    } else {
      return (
        <div className="mr-2 block grow text-right text-sm font-medium text-gray-400">
          <span className="flex flex-row text-right">
            Auction ends in:&nbsp;{" "}
            <span className="tracking-wide text-emerald-500">
              {formatTimeInterval(auction.endTime - now)}
            </span>
          </span>
        </div>
      );
    }
  }, [now, auction]);

  useEffect(() => {
    setAuction(undefined);
    if (!id) {
      return;
    }

    getAuctionDetail(id as string).then(setAuction);
  }, [id]);

  // useEffect(() => {
  //   if (auction?.pixel?.image) {
  //     dynamicBlurDataUrl(auction.pixel.image).then(setBlurDataURL);
  //   }
  // }, [auction?.pixel?.image]);

  return (
    <div className="mx-auto flex h-full w-full max-w-5xl flex-row">
      <div className="flex h-fit w-full justify-center gap-20">
        <div className="w-3/5 max-w-lg">
          <div className="my-10 flex items-center">
            <Link href={`/market/${auction?.tokenId}`}>
              <div className="mr-5 flex items-center">
                <FaChevronLeft className="h-5 w-5" />
              </div>
            </Link>
            <h1 className="text-3xl font-semibold">Auction Detail</h1>
          </div>
          <div className="my-5 w-full">{status}</div>
          {!expired &&
            auction?.ownerId != "0x1" &&
            // address
            !!auction?.paymentToken && (
              <BidForm
                id={id as string}
                tokenId={auction.pixel.tokenId}
                token={auction.paymentToken}
                minWinPrice={minWinPrice}
              />
            )}
          {auction && !auction?.lastBidderId && auction?.ownerId == "0x1" && (
            // address
            <CancelForm id={id as string} tokenId={auction.pixel.tokenId} />
          )}
          {auction &&
            expired &&
            (auction?.ownerId == "0x1" ||
              // address
              auction?.lastBidderId == "0x1") && (
              // address
              <FinishForm id={id as string} tokenId={auction.pixel.tokenId} />
            )}
          <div className="mt-10 flex flex-col">
            <Card className="w-full">
              <div className="flex w-full flex-col gap-2">
                <div className="grid w-full grid-cols-[auto_1fr] items-center">
                  <Label value="Creator" className="text-lg" />
                  <p className="text-end">
                    {auction?.owner?.name ??
                      shortenString(auction?.ownerId) ??
                      "--"}
                  </p>
                </div>
                <div className="grid w-full grid-cols-[auto_1fr] items-center">
                  <Label value="Start Time" className="text-lg" />
                  <p className="text-end">
                    {auction?.startTime
                      ? new Date(auction.startTime * 1000).toLocaleString()
                      : "--"}
                  </p>
                </div>
                <div className="grid w-full grid-cols-[auto_1fr] items-center">
                  <Label value="End Time" className="text-lg" />
                  <p className="text-end">
                    {auction?.startTime
                      ? new Date(auction.endTime * 1000).toLocaleString()
                      : "--"}
                  </p>
                </div>
                <div className="grid w-full grid-cols-[auto_1fr] items-center">
                  <Label value="Minimum bid price" className="text-lg" />
                  <p className="text-end">
                    {/* {auction?.minPrice
                      ? formatBigIntWithUnits(BigInt(auction.minPrice)) +
                        " WETH"
                      : "--"} */}
                  </p>
                </div>
                <div className="grid w-full grid-cols-[auto_1fr] items-center">
                  <Label value="Minimum win percent" className="text-lg" />
                  <p className="text-end">
                    {auction?.minWinPercent
                      ? auction.minWinPercent + " %"
                      : "--"}
                  </p>
                </div>
                <div className="grid w-full grid-cols-[auto_1fr] items-center">
                  <Label value="Last bid price" className="text-lg" />
                  <p className="text-end">
                    {/* {auction?.bidPrice
                      ? formatBigIntWithUnits(BigInt(auction.bidPrice)) +
                        " WETH"
                      : "--"} */}
                  </p>
                </div>
                <div className="grid w-full grid-cols-[auto_1fr] items-center">
                  <Label value="Last Bidder" className="text-lg" />
                  <p className="text-end">
                    {auction?.lastBidder?.name ??
                      shortenString(auction?.lastBidderId) ??
                      "--"}
                  </p>
                </div>
                <div className="grid w-full grid-cols-[auto_1fr] items-center">
                  <Label value="Minimum win price" className="text-lg" />
                  <p className="text-end">
                    {/* {minWinPrice
                      ? formatBigIntWithUnits(minWinPrice) + " WETH"
                      : "--"} */}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
        <div className="flex w-max flex-col">
          <div className="sticky top-28">
            <div className="mb-10">
              <article className="z-10 flex w-96 flex-col overflow-hidden rounded-xl">
                <div className="relative h-96 w-96">
                  <div className="relative flex h-full min-h-[inherit] w-full flex-col items-center justify-center rounded-[inherit]">
                    {auction?.pixel?.image ? (
                      <Image
                        layout="fill"
                        src={parseIpfsUrl(auction.pixel.image)}
                        alt="Asset Image"
                        // blurDataURL={blurDataURL}
                      />
                    ) : (
                      <Spinner size="md" />
                    )}
                  </div>
                </div>
                <h5 className="mt-5 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {auction?.pixel?.name ?? "--"}
                </h5>
                <h5 className="mt-3 text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
                  {auction?.pixel
                    ? `(${auction.pixel.left}, ${auction.pixel.top}, ${auction.pixel.right}, ${auction.pixel.bottom})`
                    : "--"}
                </h5>
              </article>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionListContent;
