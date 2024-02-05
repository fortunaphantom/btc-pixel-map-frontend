import { CollapsibleCard } from "@/components/common/CollapsibleCard";
import ConformModal from "@/components/modal/ConfirmModal";
import { useCurrentTime } from "@/context/CurrentTimeContext";
import { delay, formatRemainingInterval } from "@/helpers/time";
import { Button, Table } from "flowbite-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FC, useCallback, useMemo, useState } from "react";
import { FaListUl } from "react-icons/fa6";
import { ImFilesEmpty } from "react-icons/im";

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

const ItemOffers: FC<Props> = ({ pixel }) => {
  const router = useRouter();
  const now = useCurrentTime();
  const offers = useMemo(
    () => (pixel.orders ?? []).filter((order) => order.side == "Buy"),
    [pixel],
  );

  const [acceptOfferConfirmOpen, setAcceptOfferConfirmOpen] =
    useState<boolean>(false);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [errorStep, setErrorStep] = useState<number>();
  const [errorMessage, setErrorMessage] = useState<string>();

  const handleAcceptOffer = useCallback(
    async (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      offer: OrderData,
    ) => {
      setAcceptOfferConfirmOpen(true);
      setErrorStep(undefined);
      setErrorMessage(undefined);

      try {
        setActiveStep(0);
        // const buyInput = {
        //   order: {
        //     trader: offer.trader,
        //     side: 0,
        //     collection: PIXEL_CONTRACT_ADDRESS,
        //     tokenId: offer.tokenId,
        //     paymentToken: offer.paymentToken,
        //     price: offer.price,
        //     listingTime: offer.listingTime,
        //     expirationTime: offer.expirationTime,
        //     salt: offer.salt,
        //   },
        //   r: offer.r,
        //   s: offer.s,
        //   v: offer.v,
        // };
        // const sellInput = {
        //   order: {
        //     trader: address,
        //     side: 1,
        //     collection: PIXEL_CONTRACT_ADDRESS,
        //     tokenId: offer.tokenId,
        //     paymentToken: offer.paymentToken,
        //     price: offer.price,
        //     listingTime: 0,
        //     expirationTime: offer.expirationTime,
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
    },
    [
      // address, execute
    ],
  );

  return (
    <div className="my-4 flex w-full px-5">
      <CollapsibleCard
        title="Offers"
        icon={<FaListUl className="h-5 w-5" />}
        className="w-full"
      >
        {offers?.length ? (
          <div className="relative h-60 w-full overflow-y-auto overflow-x-hidden">
            <Table>
              <Table.Body className="divide-y">
                {offers.map((offer) => (
                  <Table.Row
                    key={offer.id}
                    className="bg-white dark:border-slate-700 dark:bg-slate-800"
                  >
                    <Table.Cell className="whitespace-nowrap font-medium text-slate-900 dark:text-white">
                      {/* {formatBigIntWithUnits(BigInt(offer.price))} WETH */}
                    </Table.Cell>
                    <Table.Cell>
                      Expires in{" "}
                      {formatRemainingInterval(offer.expirationTime - now)}
                    </Table.Cell>
                    <Table.Cell>
                      <Link
                        href={`/profile/${offer.trader}`}
                        className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                      >
                        {/* {address == offer.trader
                          ? "You"
                          : offer?.creator?.name ?? shortenString(offer.trader)} */}
                      </Link>
                    </Table.Cell>
                    {
                      // address
                      "0x1" == pixel.ownerId && (
                        <Table.Cell className="flex justify-end">
                          <Button
                            outline
                            onClick={() => handleAcceptOffer(offer)}
                          >
                            Accept
                          </Button>
                          <ConformModal
                            title={"Accept offer"}
                            isOpen={acceptOfferConfirmOpen}
                            setOpen={setAcceptOfferConfirmOpen}
                            steps={acceptOfferConfirmSteps}
                            activeStep={activeStep}
                            errorStep={errorStep}
                            errorMessage={errorMessage}
                            successMessage="Accepted offer"
                            handleRetry={() => handleAcceptOffer(offer)}
                            handleContinue={() => {
                              setAcceptOfferConfirmOpen(false);
                              router.refresh();
                            }}
                          />
                        </Table.Cell>
                      )
                    }
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
        ) : (
          <div className="flex w-full flex-col items-center py-2">
            <ImFilesEmpty className="mb-1 h-10 w-10" />
            <span>No offers yet</span>
          </div>
        )}
      </CollapsibleCard>
    </div>
  );
};

export default ItemOffers;
