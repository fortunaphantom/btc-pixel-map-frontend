import ConformModal from "@/components/modal/ConfirmModal";
import OfferModal from "@/components/modal/OfferModal";
import { useCurrentTime } from "@/contexts/CurrentTimeContext";
import { delay, timestampToDateTime } from "@/helpers/time";
import { Button, Card } from "flowbite-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FC, useCallback, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  FaBagShopping,
  FaClock,
  FaFileInvoiceDollar,
  FaWallet,
} from "react-icons/fa6";
import { GiReceiveMoney } from "react-icons/gi";
import { MdOutlineLocalOffer } from "react-icons/md";
import { RiFileEditFill } from "react-icons/ri";

const buyConfirmSteps: ConfirmStep[] = [
  {
    title: "Buy NFT",
    description:
      "You'll be asked to review and transact buy transaction from your wallet.",
  },
];
const acceptOfferConfirmSteps: ConfirmStep[] = [
  {
    title: "Accept offer",
    description:
      "You'll be asked to review and transact accept transaction from your wallet.",
  },
];

type Props = {
  pixel: Pixel;
};

const ItemActions: FC<Props> = ({ pixel }) => {
  const router = useRouter();
  const now = useCurrentTime();

  // buy confirm modal
  const [buyConfirmOpen, setBuyConfirmOpen] = useState<boolean>(false);
  const [acceptOfferConfirmOpen, setAcceptOfferConfirmOpen] =
    useState<boolean>(false);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [errorStep, setErrorStep] = useState<number>();
  const [errorMessage, setErrorMessage] = useState<string>();

  // make offer modal
  const [offerModalOpen, setOfferModalOpen] = useState<boolean>(false);

  // const size = useMemo(
  //   () => (pixel.bottom - pixel.top + 1) * (pixel.right - pixel.left + 1),
  //   [pixel],
  // );

  const listing: OrderData | undefined = useMemo(
    () => (pixel.orders ?? []).filter((order) => order.side == "Sell")?.[0],
    [pixel],
  );

  const bestOffer = useMemo(() => {
    const offers = (pixel.orders ?? []).filter((order) => order.side == "Buy");
    if (!offers.length) {
      return undefined;
    }

    if (offers.length == 1) {
      return offers[0];
    }

    return offers.reduce((prev: OrderData, current: OrderData) =>
      BigInt(prev.price) > BigInt(current.price) ? prev : current,
    );
  }, [pixel.orders]);

  // const isOwner = useMemo(
  //   () => pixel.ownerId == address || pixel.auction?.ownerId == address,
  //   [address, pixel.auction, pixel.ownerId],
  // );

  const auctionTitle = useMemo(() => {
    if (pixel.auction) {
      if (pixel.auction?.endTime && pixel.auction.endTime >= now) {
        return `Auction ends ${timestampToDateTime(pixel.auction.endTime)}`;
      } else if (pixel.auction?.endTime && pixel.auction.endTime < now) {
        return `Auction ended`;
      } else if (pixel.auction.startTime > now) {
        return `Auction lives in ${timestampToDateTime(
          pixel.auction.startTime,
        )}`;
      } else {
        return `Auction is live now`;
      }
    }

    if (listing) {
      return `Listing ends in ${timestampToDateTime(
        listing.expirationTime,
      )} ETH`;
    }

    return "Not listed yet";
  }, [listing, now, pixel.auction]);

  const price = useMemo(() => {
    if (pixel.auction) {
      if (pixel.auction.bidPrice) {
        if (now > pixel.auction.endTime) {
          return undefined;
        }

        return (
          (BigInt(pixel.auction.bidPrice) *
            BigInt(pixel.auction.minWinPercent)) /
          100n
        );
      } else {
        return BigInt(pixel.auction.minPrice);
      }
    }
    if (listing) {
      return BigInt(listing.price);
    }

    return undefined;
  }, [listing, now, pixel.auction]);

  const handleBuy = useCallback(async () => {
    if (!listing) {
      toast.error("Invalid action");
      return;
    }

    setBuyConfirmOpen(true);
    setErrorStep(undefined);
    setErrorMessage(undefined);

    try {
      setActiveStep(0);
      // const sellInput = {
      //   order: {
      //     trader: listing.trader,
      //     side: 1,
      //     collection: PIXEL_CONTRACT_ADDRESS,
      //     tokenId: listing.tokenId,
      //     paymentToken: zeroAddress,
      //     price: listing.price,
      //     listingTime: listing.listingTime,
      //     expirationTime: listing.expirationTime,
      //     salt: listing.salt,
      //   },
      //   r: listing.r,
      //   s: listing.s,
      //   v: listing.v,
      // };
      // const buyInput = {
      //   order: {
      //     trader: address,
      //     side: 0,
      //     collection: PIXEL_CONTRACT_ADDRESS,
      //     tokenId: listing.tokenId,
      //     paymentToken: zeroAddress,
      //     price: listing.price,
      //     listingTime: 0,
      //     expirationTime: listing.expirationTime,
      //     salt: 0,
      //   },
      //   r: zeroHash,
      //   s: zeroHash,
      //   v: 0,
      // };
      // const { hash } = await execute({
      //   args: [sellInput, buyInput],
      //   value: BigInt(listing.price),
      // });
      // await waitForTransaction({ hash });
      await delay(5000);
    } catch (err: any) {
      console.log(err);
      setErrorStep(0);
      setErrorMessage(err?.shortMessage ?? "Something went wrong");
      return;
    }

    setActiveStep(1);
  }, [
    // address, execute,
    listing,
  ]);

  const handleAcceptOffer = useCallback(async () => {
    if (!bestOffer) {
      toast.error("Invalid action");
      return;
    }

    setAcceptOfferConfirmOpen(true);
    setErrorStep(undefined);
    setErrorMessage(undefined);

    try {
      setActiveStep(0);
      // const buyInput = {
      //   order: {
      //     trader: bestOffer.trader,
      //     side: 0,
      //     collection: PIXEL_CONTRACT_ADDRESS,
      //     tokenId: bestOffer.tokenId,
      //     paymentToken: bestOffer.paymentToken,
      //     price: bestOffer.price,
      //     listingTime: bestOffer.listingTime,
      //     expirationTime: bestOffer.expirationTime,
      //     salt: bestOffer.salt,
      //   },
      //   r: bestOffer.r,
      //   s: bestOffer.s,
      //   v: bestOffer.v,
      // };
      // const sellInput = {
      //   order: {
      //     trader: address,
      //     side: 1,
      //     collection: PIXEL_CONTRACT_ADDRESS,
      //     tokenId: bestOffer.tokenId,
      //     paymentToken: bestOffer.paymentToken,
      //     price: bestOffer.price,
      //     listingTime: 0,
      //     expirationTime: bestOffer.expirationTime,
      //     salt: 0,
      //   },
      //   r: zeroHash,
      //   s: zeroHash,
      //   v: 0,
      // };
      // const { hash } = await execute({
      //   args: [sellInput, buyInput],
      // });
      // await waitForTransaction({ hash });
      await delay(5000);
    } catch (err: any) {
      console.log(err);
      setErrorStep(0);
      setErrorMessage(err?.shortMessage ?? "Something went wrong");
      return;
    }

    setActiveStep(1);
  }, [
    // address, execute,
    bestOffer,
  ]);

  return (
    <div className="mx-5 my-4 flex text-slate-900 dark:text-white">
      <Card
        className="w-full p-0"
        renderImage={() => (
          <div className="inline-flex w-full items-center border-b border-gray-200 p-5 dark:border-gray-700">
            <FaClock className="mr-2 h-5 w-5" />
            <p>{auctionTitle}</p>
          </div>
        )}
      >
        {price != undefined && (
          <div className="flex w-full flex-col justify-between">
            <span className="text-sm text-slate-800 dark:text-slate-200">
              Current price
            </span>
            <div className="mt-1 inline-flex items-end gap-2 py-1 text-3xl leading-none">
              {/* {formatBigIntWithUnits(price)} ETH
              <span className="text-xs">
                {formatBigIntWithUnits(price / BigInt(size))} ETH/Pixel
              </span> */}
            </div>
          </div>
        )}
        {!price && bestOffer && (
          <div className="flex w-full flex-col justify-between">
            <span className="text-sm text-slate-800 dark:text-slate-200">
              Best offer
            </span>
            <div className="mt-1 inline-flex items-end gap-2 py-1 text-3xl leading-none">
              {/* {formatBigIntWithUnits(BigInt(bestOffer.price))} ETH
              <span className="text-xs">
                {formatBigIntWithUnits(BigInt(bestOffer.price) / BigInt(size))}{" "}
                ETH/Pixel
              </span> */}
            </div>
          </div>
        )}
        {
          // isOwner
          1 &&
            (pixel.auction ? (
              <Link href={`/market/auction/${pixel.auction.id}`}>
                {now >= pixel.auction.startTime &&
                  !pixel.auction.lastBidderId && (
                    <Button className="w-full">
                      <FaWallet className="mr-2 h-5 w-5" />
                      Cancel Auction
                    </Button>
                  )}
                {now >= pixel.auction.endTime && pixel.auction.lastBidderId && (
                  <Button className="w-full">
                    <FaWallet className="mr-2 h-5 w-5" />
                    Finish Auction
                  </Button>
                )}
              </Link>
            ) : (
              <div className="flex flex-col gap-1 lg:flex-row">
                {bestOffer && (
                  <Button
                    type="button"
                    className="w-full"
                    onClick={handleAcceptOffer}
                  >
                    <GiReceiveMoney className="mr-2 h-5 w-5" />
                    Accept offer |{" "}
                    {/* {formatBigIntWithUnits(BigInt(bestOffer.price))} WETH */}
                  </Button>
                )}
                {!listing ? (
                  <Link
                    className="w-full"
                    href={`/market/${pixel.tokenId}/list`}
                  >
                    <Button className="w-full">
                      <FaFileInvoiceDollar className="mr-2 h-5 w-5" />
                      List for sale
                    </Button>
                  </Link>
                ) : (
                  <Link className="w-full" href={`/market/list/${listing.id}`}>
                    <Button className="w-full">
                      <RiFileEditFill className="mr-2 h-5 w-5" />
                      Edit list
                    </Button>
                  </Link>
                )}
              </div>
            ))
        }
        {
          // !isOwner
          1 &&
            (pixel.auction ? (
              <Link href={`/market/auction/${pixel.auction.id}`}>
                {pixel.auction?.lastBidderId == "1" &&
                // address
                now >= pixel?.auction?.endTime ? (
                  <Button className="w-full">
                    <FaWallet className="mr-2 h-5 w-5" />
                    Finish Auction
                  </Button>
                ) : (
                  <Button className="w-full">
                    <FaWallet className="mr-2 h-5 w-5" />
                    Place bid
                  </Button>
                )}
              </Link>
            ) : (
              <div className="flex flex-col gap-1 lg:flex-row">
                {listing && (
                  <Button type="button" className="w-full" onClick={handleBuy}>
                    <FaBagShopping className="mr-2 h-5 w-5" />
                    Buy pixel
                  </Button>
                )}
                <Button
                  type="button"
                  className="w-full"
                  onClick={() => setOfferModalOpen(true)}
                >
                  <MdOutlineLocalOffer className="mr-2 h-5 w-5" />
                  Make offer
                </Button>
              </div>
            ))
        }
        <ConformModal
          title={"Buy NFT"}
          isOpen={buyConfirmOpen}
          setOpen={setBuyConfirmOpen}
          steps={buyConfirmSteps}
          activeStep={activeStep}
          errorStep={errorStep}
          errorMessage={errorMessage}
          successMessage="List succeed"
          handleRetry={handleBuy}
          handleContinue={() => {
            setBuyConfirmOpen(false);
            router.refresh();
          }}
        />
        <ConformModal
          title={"Accept offer"}
          isOpen={acceptOfferConfirmOpen}
          setOpen={setAcceptOfferConfirmOpen}
          steps={acceptOfferConfirmSteps}
          activeStep={activeStep}
          errorStep={errorStep}
          errorMessage={errorMessage}
          successMessage="Accepted offer"
          handleRetry={handleAcceptOffer}
          handleContinue={() => {
            setAcceptOfferConfirmOpen(false);
            router.refresh();
          }}
        />
      </Card>
      {pixel && (
        <OfferModal
          isOpen={offerModalOpen}
          setOpen={setOfferModalOpen}
          pixel={pixel}
          listing={listing}
          bestOffer={bestOffer?.price ? BigInt(bestOffer.price) : undefined}
        />
      )}
    </div>
  );
};

export default ItemActions;
