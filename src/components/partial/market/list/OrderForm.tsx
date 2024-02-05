/* eslint-disable jsx-a11y/label-has-associated-control */
"use client";

import ConformModal from "@/components/modal/ConfirmModal";
import { Button } from "flowbite-react";
import { useRouter } from "next/navigation";
import { FC, useCallback, useState } from "react";
import { DurationInput, PriceInput, SummeryView } from ".";
import InputWrapper from "./InputWrapper";

const confirmSteps: ConfirmStep[] = [
  {
    title: "Approve pixel for list",
    description:
      "You'll be asked to review and transact approve transaction from your wallet.",
  },
  {
    title: "Sign for list",
    description:
      "You'll be asked to review and sign for list from your wallet.",
  },
  {
    title: "Listing item fro Sale",
    description: "You need to wait until list.",
  },
];

type Props = {
  pixel: Pixel;
};

export const OrderForm: FC<Props> = ({ pixel }) => {
  const [price, setPrice] = useState<number>();
  const [
    ,
    // startTime
    setStartTime,
  ] = useState<number>();
  const [
    ,
    // endTime
    setEndTime,
  ] = useState<number>();

  // confirm modal
  const [confirmOpen, setConfirmOpen] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [errorStep, setErrorStep] = useState<number>();
  const [errorMessage, setErrorMessage] = useState<string>();

  const router = useRouter();

  const handleList = useCallback(async () => {
    // if (
    //   // Object.keys(orderSignMessage).length == 0 ||
    //   // data?.approved == undefined ||
    //   // data?.isApprovedForAll == undefined
    // ) {
    //   toast.error("Invalid input! Please check order parameters");
    //   return;
    // }

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
      //   side: 1,
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
  }, [
    // orderSignMessage,
    // data,
    // refetch,
    // setApprovalForAll,
    // approve,
    pixel.tokenId,
    // signTypedDataAsync,
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
