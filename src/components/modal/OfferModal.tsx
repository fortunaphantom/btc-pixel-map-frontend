import {
  // formatBigIntWithUnits,
  parseIpfsUrl,
} from "@/helpers";
import { Button, Card, Label, Modal, TextInput } from "flowbite-react";
import Image from "next/image";
import { FC, useCallback, useState } from "react";
import { FaEthereum, FaWallet } from "react-icons/fa6";
import ConformModal from "./ConfirmModal";

const confirmSteps: ConfirmStep[] = [
  {
    title: "Approve token to make offer",
    description:
      "You'll be asked to review and transact approve transaction from your wallet.",
  },
  {
    title: "Sign to make offer",
    description:
      "You'll be asked to review and sign for list from your wallet.",
  },
  {
    title: "Make offer",
    description: "You need to wait until list.",
  },
];

type Props = {
  isOpen: boolean;
  setOpen: (value: boolean) => void;
  pixel: Pixel;
  listing?: Listing;
  bestOffer?: bigint;
};

const OfferModal: FC<Props> = ({
  isOpen,
  setOpen,
  pixel,
  // listing,
  // bestOffer,
}) => {
  const [price, setPrice] = useState<number>(0);
  // const [
  //   ,
  //   // startTime
  //   setStartTime,
  // ] = useState<number>();
  // const [
  //   ,
  //   // endTime
  //   setEndTime,
  // ] = useState<number>();

  // confirm modal
  const [confirmOpen, setConfirmOpen] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [errorStep, setErrorStep] = useState<number>();
  const [errorMessage, setErrorMessage] = useState<string>();

  // const priceInBigInt = useMemo(() => parseEther(price + ""), [price]);

  const handleMakeOffer = useCallback(
    async () => {
      setConfirmOpen(true);
      setErrorStep(undefined);
      setErrorMessage(undefined);

      try {
        setActiveStep(0);
        // if (data.allowance < priceInBigInt) {
        //   const { hash } = await approve({
        //     args: [MARKETPLACE_CONTRACT_ADDRESS, priceInBigInt],
        //   });
        //   await waitForTransaction({ hash });
        // }
      } catch (err: any) {
        console.log(err);
        setErrorStep(0);
        setErrorMessage(err?.shortMessage ?? "Something went wrong");
        // refetch();
        return;
      }

      try {
        setActiveStep(1);
        // signature = await signTypedDataAsync();
      } catch (err: any) {
        console.log(err);
        setErrorStep(1);
        setErrorMessage(err?.shortMessage ?? "Something went wrong");
        // refetch();
        return;
      }

      try {
        setActiveStep(2);
        // const payload: OrderCreateData = {
        //   trader: orderSignMessage.trader!,
        //   side: 0,
        //   collection: orderSignMessage.collection!,
        //   tokenId: orderSignMessage.tokenId!,
        //   paymentToken: orderSignMessage.paymentToken!,
        //   price: orderSignMessage.price!.toString(),
        //   listingTime: orderSignMessage.listingTime!,
        //   expirationTime: orderSignMessage.expirationTime!,
        //   salt: orderSignMessage.salt!.toString(),
        //   nonce: orderSignMessage.nonce!.toString(),
        //   signature: signature!,
        // };

        // await orderPixel(payload);
      } catch (err: any) {
        console.log(err);
        setErrorStep(2);
        setErrorMessage(
          err?.response?.data?.reason ?? "Something went wrong on server side",
        );
        // refetch();
        return;
      }

      setActiveStep(3);
    },
    [
      // orderSignMessage,
      // data?.allowance,
      // priceInBigInt,
      // approve,
      // refetch,
      // signTypedDataAsync,
    ],
  );

  return (
    <Modal show={isOpen} onClose={() => setOpen(false)} dismissible={true}>
      <Modal.Header className="bg-slate-800">Make an offer</Modal.Header>
      <Modal.Body className="overflow-visible bg-slate-800 text-slate-800 dark:text-slate-100">
        <div className="border-level-2 flex w-full border-0 px-4 pt-6">
          <div className="relative flex flex-col justify-center">
            <div className="order-2 mr-4 flex h-20 w-20 shrink-0 flex-col items-center justify-center self-center overflow-hidden">
              <div className="relative h-16 w-16 overflow-hidden rounded-md">
                <Image
                  layout="fill"
                  src={parseIpfsUrl(pixel.image)}
                  alt="Pixel Image"
                />
              </div>
            </div>
          </div>
          <div className="order-3 mr-4 flex flex-auto flex-col items-start justify-center self-stretch overflow-hidden">
            <div className="text-primary font-semibold">
              <div className="font-semibold"># {pixel.id}</div>
            </div>
            <span className="text-secondary text-sm text-slate-600 dark:text-slate-400">
              <div className="text-sm">
                {pixel.right - pixel.left + 1} X {pixel.bottom - pixel.top + 1}
              </div>
            </span>
          </div>
          <div className="order-4 flex max-w-[40%] flex-[0_0_auto] flex-col justify-center self-stretch overflow-hidden text-right">
            <span className="font-semibold">
              {/* {listing?.price
                ? formatBigIntWithUnits(BigInt(listing.price))
                : "--"}{" "} */}
              WETH
            </span>
          </div>
        </div>
        <form
          className="flex w-full flex-col gap-4"
          onSubmit={(e) => {
            e.stopPropagation();
            e.preventDefault();
            handleMakeOffer();
          }}
        >
          <Card className="w-full">
            <div className="flex w-full">
              <FaWallet className="mr-2 h-5 w-5" />
              <div className="order-3 mr-4 flex flex-auto flex-col items-start justify-center self-stretch overflow-hidden">
                <span className="text-primary font-semibold">Balance</span>
              </div>
              <div className="order-4 flex max-w-[40%] flex-[0_0_auto] flex-col justify-center self-stretch overflow-hidden text-right">
                <span className="text-primary font-semibold">
                  {/* {data?.balance != undefined
                    ? formatBigIntWithUnits(data.balance)
                    : "--"}{" "} */}
                  WETH
                </span>
              </div>
            </div>
            <div className="flex w-full">
              <div className="order-3 mr-4 flex flex-auto flex-col items-start justify-center self-stretch overflow-hidden">
                <span className="text-primary font-semibold">Best Offer</span>
              </div>
              <div className="order-4 flex max-w-[40%] flex-[0_0_auto] flex-col justify-center self-stretch overflow-hidden text-right">
                <span className="text-primary font-semibold">
                  {/* {bestOffer ? formatBigIntWithUnits(bestOffer) : "--"} WETH */}
                </span>
              </div>
            </div>
          </Card>
          <TextInput
            id="price"
            type="number"
            rightIcon={FaEthereum}
            placeholder="0.1"
            value={price == undefined ? undefined : price?.toString()}
            onChange={(e) => setPrice(+e.target.value)}
            required
          />
          <div className="flex w-full flex-col">
            <div className="mb-3 flex flex-col">
              <div className="flex items-center">
                <Label value="Duration" className="text-lg" />
              </div>
            </div>
            {/* <DurationInput
              setStartTime={setStartTime}
              setEndTime={setEndTime}
              position="top"
            /> */}
          </div>
          <Button
            type="submit"
            color="success"
            size="md"
            className="w-full"
            // disabled={!data?.balance || priceInBigInt > data.balance}
          >
            {/* {!data?.balance || priceInBigInt > data.balance
              ? "Insufficient funds"
              : "Make offer"} */}
          </Button>
          <ConformModal
            title={`Make an offer`}
            isOpen={confirmOpen}
            setOpen={setConfirmOpen}
            steps={confirmSteps}
            activeStep={activeStep}
            errorStep={errorStep}
            errorMessage={errorMessage}
            successMessage="List succeed"
            handleRetry={handleMakeOffer}
            handleContinue={() => {
              setOpen(false);
              setConfirmOpen(false);
            }}
          />
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default OfferModal;
