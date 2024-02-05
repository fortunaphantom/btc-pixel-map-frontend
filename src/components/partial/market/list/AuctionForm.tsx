/* eslint-disable jsx-a11y/label-has-associated-control */
"use client";

import ConformModal from "@/components/modal/ConfirmModal";
import { Button } from "flowbite-react";
import { useRouter } from "next/navigation";
import { FC, useCallback, useState } from "react";
import toast from "react-hot-toast";
import { DurationInput, PriceInput, SummeryView } from ".";
import InputWrapper from "./InputWrapper";
import { MinWinPercentInput } from "./MinWinPercentInput";

const confirmSteps: ConfirmStep[] = [
  {
    title: "Approve pixel for list",
    description:
      "You'll be asked to review and transact approve transaction from your wallet.",
  },
  {
    title: "Create a new Auction",
    description:
      "You'll be asked to review and transact create auction transaction for list from your wallet.",
  },
];

type Props = {
  pixel: Pixel;
};

export const AuctionForm: FC<Props> = ({ pixel }) => {
  const [price, setPrice] = useState<number>();
  const [minWinPercent, setMinWinPercent] = useState<number>(105);
  const [startTime, setStartTime] = useState<number>();
  const [endTime, setEndTime] = useState<number>();

  // confirm modal
  const [confirmOpen, setConfirmOpen] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [errorStep, setErrorStep] = useState<number>();
  const [errorMessage, setErrorMessage] = useState<string>();

  const router = useRouter();

  const handleList = useCallback(async () => {
    if (
      // data?.approved == undefined ||
      // data?.isApprovedForAll == undefined ||
      !startTime ||
      !endTime ||
      !price ||
      minWinPercent < 100
    ) {
      toast.error("Invalid input! Please check order parameters");
      return;
    }

    setConfirmOpen(true);
    setErrorStep(undefined);
    setErrorMessage(undefined);

    try {
      setActiveStep(0);
      // if (
      //   !data.isApprovedForAll &&
      //   data.approved != MARKETPLACE_CONTRACT_ADDRESS
      // ) {
      //   try {
      //     const { hash } = await setApprovalForAll({
      //       args: [MARKETPLACE_CONTRACT_ADDRESS, true],
      //     });
      //     await waitForTransaction({ hash });
      //   } catch (err) {
      //     console.log(err);
      //     const { hash } = await approve({
      //       args: [MARKETPLACE_CONTRACT_ADDRESS, BigInt(pixel.tokenId)],
      //     });
      //     await waitForTransaction({ hash });
      //   }
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
      // const { hash } = await createAuction({
      //   args: [
      //     {
      //       collection: PIXEL_CONTRACT_ADDRESS,
      //       tokenId: pixel.tokenId,
      //       paymentToken: WETH_ADDRESS,
      //       minPrice: parseEther(price + ""),
      //       minWinPercent: minWinPercent,
      //       startTime: startTime,
      //       duration: endTime - startTime,
      //     },
      //   ],
      // });
      // await waitForTransaction({ hash });
    } catch (err: any) {
      console.log(err);
      setErrorStep(1);
      setErrorMessage(err?.shortMessage ?? "Something went wrong");
      // refetch();
      return;
    }

    setActiveStep(2);
  }, [
    // data?.approved,
    // data?.isApprovedForAll,
    startTime,
    endTime,
    price,
    minWinPercent,
    // setApprovalForAll,
    // approve,
    pixel.tokenId,
    // refetch,
    // createAuction,
  ]);

  return (
    <form
      className="mb-10"
      onSubmit={(e) => {
        e.stopPropagation();
        e.preventDefault();
        handleList();
      }}
    >
      <PriceInput value={price} setValue={setPrice} />
      <MinWinPercentInput value={minWinPercent} setValue={setMinWinPercent} />
      <InputWrapper title="Duration">
        <DurationInput setStartTime={setStartTime} setEndTime={setEndTime} />
      </InputWrapper>
      <SummeryView mode="Order" price={price} />
      <Button type="submit" color="success" size="lg" className="w-full">
        Complete listing
      </Button>
      <ConformModal
        title={`Listing ${pixel.name}`}
        isOpen={confirmOpen}
        setOpen={setConfirmOpen}
        steps={confirmSteps}
        activeStep={activeStep}
        errorStep={errorStep}
        errorMessage={errorMessage}
        successMessage="List succeed"
        handleRetry={handleList}
        handleContinue={() => router.push(`/market/${pixel.tokenId}`)}
      />
    </form>
  );
};
