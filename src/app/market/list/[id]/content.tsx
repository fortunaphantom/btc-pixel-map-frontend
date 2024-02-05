/* eslint-disable jsx-a11y/label-has-associated-control */
"use client";

import ConformModal from "@/components/modal/ConfirmModal";
import {
  DurationInput,
  PriceInput,
  SummeryView,
} from "@/components/partial/market/list";
import InputWrapper from "@/components/partial/market/list/InputWrapper";
import { parseIpfsUrl } from "@/helpers";
import { getOrderDetail } from "@/helpers/api/market";
// import { dynamicBlurDataUrl } from "@/helpers/image";
import { delay } from "@/helpers/time";
import { Button, Spinner } from "flowbite-react";
import { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaChevronLeft } from "react-icons/fa6";

const editConfirmSteps: ConfirmStep[] = [
  {
    title: "Sign for edit",
    description:
      "You'll be asked to review and sign for edit from your wallet.",
  },
  {
    title: "Listing item fro Sale",
    description: "You need to wait until list.",
  },
];

const cancelConfirmSteps: ConfirmStep[] = [
  {
    title: "Transact for cancel",
    description:
      "You'll be asked to review and sign for cancel transaction from your wallet",
  },
];

const TokenListContent: NextPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState<OrderData>();
  // const [blurDataURL, setBlurDataURL] = useState<string>();
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
  const [editConfirmOpen, setEditConfirmOpen] = useState<boolean>(false);
  const [cancelConfirmOpen, setCancelConfirmOpen] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [errorStep, setErrorStep] = useState<number>();
  const [errorMessage, setErrorMessage] = useState<string>();

  const router = useRouter();

  const handleEdit = useCallback(async () => {
    setEditConfirmOpen(true);
    setErrorStep(undefined);
    setErrorMessage(undefined);

    try {
      setActiveStep(0);
      // signature = await signTypedDataAsync();
    } catch (err: any) {
      console.log(err);
      setErrorStep(0);
      setErrorMessage(err?.shortMessage ?? "Something went wrong");
      // refetch();
      return;
    }

    try {
      setActiveStep(1);
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

      // await orderPixel(payload, id as string);
    } catch (err: any) {
      console.log(err);
      setErrorStep(1);
      setErrorMessage(
        err?.response?.data?.reason ?? "Something went wrong on server side",
      );
      // refetch();
      return;
    }

    setActiveStep(2);
  }, [id]);

  const handleCancel = useCallback(async () => {
    if (!order) {
      toast.error("Invalid order");
      return;
    }

    setCancelConfirmOpen(true);
    setErrorStep(undefined);
    setErrorMessage(undefined);

    try {
      setActiveStep(0);
      // const { hash } = await cancelOrder({
      //   args: [
      //     {
      //       trader: order.trader,
      //       side: 1,
      //       collection: PIXEL_CONTRACT_ADDRESS,
      //       tokenId: order.tokenId,
      //       paymentToken: order.paymentToken,
      //       price: order.price,
      //       listingTime: order.listingTime,
      //       expirationTime: order.expirationTime,
      //       salt: order.salt,
      //     },
      //   ],
      // });

      // await waitForTransaction({ hash });
      await delay(5000);
    } catch (err: any) {
      console.log(err);
      setErrorStep(0);
      setErrorMessage(
        err?.response?.data?.reason ?? "Something went wrong on server side",
        // refetch();
      );
      return;
    }

    setActiveStep(1);
  }, [
    order,
    // , cancelOrder, refetch
  ]);

  useEffect(() => {
    setOrder(undefined);
    if (!id) {
      return;
    }

    getOrderDetail(id as string).then(setOrder);
  }, [id]);

  // useEffect(() => {
  //   if (order) {
  //     setPrice(+formatEther(BigInt(order.price)));
  //     setStartTime(+order.listingTime);
  //     setEndTime(order.expirationTime);
  //   }
  // }, [order]);

  // useEffect(() => {
  //   if (order?.pixel?.image) {
  //     dynamicBlurDataUrl(order.pixel.image).then(setBlurDataURL);
  //   }
  // }, [order?.pixel?.image]);

  return (
    <div className="mx-auto flex h-full w-full max-w-5xl flex-row">
      <div className="flex h-fit w-full justify-center gap-20">
        <div className="w-3/5 max-w-lg">
          <div className="my-10 flex items-center">
            <Link href={`/market/${order?.tokenId}`}>
              <div className="mr-5 flex items-center">
                <FaChevronLeft className="h-5 w-5" />
              </div>
            </Link>
            <h1 className="text-3xl font-semibold">Edit listing</h1>
          </div>
          {order && (
            <form
              className="mb-10"
              onSubmit={(e) => {
                e.stopPropagation();
                e.preventDefault();
                handleEdit();
              }}
            >
              <PriceInput value={price} setValue={setPrice} />
              <InputWrapper title="Duration">
                <DurationInput
                  setStartTime={setStartTime}
                  setEndTime={setEndTime}
                />
              </InputWrapper>
              <SummeryView mode="Order" price={price} />
              <div className="flex w-full flex-col gap-2 lg:flex-row">
                <Button
                  type="submit"
                  color="success"
                  size="lg"
                  className="w-full"
                >
                  Edit listing
                </Button>
                <Button
                  type="button"
                  color="failure"
                  size="lg"
                  className="w-full"
                  onClick={handleCancel}
                >
                  Cancel listing
                </Button>
              </div>
              <ConformModal
                title={`Edit listing`}
                isOpen={editConfirmOpen}
                setOpen={setEditConfirmOpen}
                steps={editConfirmSteps}
                activeStep={activeStep}
                errorStep={errorStep}
                errorMessage={errorMessage}
                successMessage="Edit succeed"
                handleRetry={handleEdit}
                handleContinue={() => router.push(`/market/${order.tokenId}`)}
              />
              <ConformModal
                title={`Cancel listing`}
                isOpen={cancelConfirmOpen}
                setOpen={setCancelConfirmOpen}
                steps={cancelConfirmSteps}
                activeStep={activeStep}
                errorStep={errorStep}
                errorMessage={errorMessage}
                successMessage="Cancelation succeed"
                handleRetry={handleCancel}
                handleContinue={() => router.push(`/market/${order.tokenId}`)}
              />
            </form>
          )}
        </div>
        <div className="flex w-max flex-col">
          <div className="sticky top-28">
            <div className="mb-10">
              <article className="z-10 flex w-96 flex-col overflow-hidden rounded-xl">
                <div className="relative h-96 w-96">
                  <div className="relative flex h-full min-h-[inherit] w-full flex-col items-center justify-center rounded-[inherit]">
                    {order?.pixel?.image ? (
                      <Image
                        layout="fill"
                        src={parseIpfsUrl(order.pixel.image)}
                        alt="Asset Image"
                        // blurDataURL={blurDataURL}
                      />
                    ) : (
                      <Spinner size="md" />
                    )}
                  </div>
                </div>
                <h5 className="mt-5 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {order?.pixel?.name ?? "--"}
                </h5>
                <h5 className="mt-3 text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
                  {order
                    ? `(${order.pixel.left}, ${order.pixel.top}, ${order.pixel.right}, ${order.pixel.bottom})`
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

export default TokenListContent;
