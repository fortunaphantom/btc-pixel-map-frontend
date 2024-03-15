/* eslint-disable jsx-a11y/label-has-associated-control */
"use client";

import ConformModal from "@/components/modal/ConfirmModal";
import {
  DurationInput,
  PriceInput,
  SummeryView,
} from "@/components/partial/market/list";
import InputWrapper from "@/components/partial/market/list/InputWrapper";
import { useAuthContext } from "@/contexts/AuthContext";
import { useConnect } from "@/contexts/WalletConnectProvider";
import { parseIpfsUrl } from "@/helpers";
import { getListPsbt, getListingDetail } from "@/helpers/api/market";
import { delay } from "@/helpers/time";
import { useSign } from "@/hooks";
import * as bitcoin from "bitcoinjs-lib";
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
    title: "Generate PSBT",
    description: "You need to wait Listing PSBT to be generated",
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

const cancelConfirmSteps: ConfirmStep[] = [
  {
    title: "Cancel listing",
    description: "You need to wait until cancel listing",
  },
];

const TokenListContent: NextPage = () => {
  const { id } = useParams();
  const { address, publicKey, openModal } = useConnect();
  const { axios } = useAuthContext();
  const { sign } = useSign();

  const [listing, setListing] = useState<Listing>();
  // const [blurDataURL, setBlurDataURL] = useState<string>();
  const [price, setPrice] = useState<number>();
  const [duration, setDuration] = useState<number>();

  // confirm modal
  const [editConfirmOpen, setEditConfirmOpen] = useState<boolean>(false);
  const [cancelConfirmOpen, setCancelConfirmOpen] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [errorStep, setErrorStep] = useState<number>();
  const [errorMessage, setErrorMessage] = useState<string>();

  const router = useRouter();

  const handleEdit = useCallback(async () => {
    if (!listing) {
      return;
    }
    if (!address?.ordinals || !publicKey.ordinals) {
      openModal();
      return;
    }
    if (!price) {
      toast.error("Please input sell price");
      return;
    }

    setEditConfirmOpen(true);
    setErrorStep(undefined);
    setErrorMessage(undefined);

    const satsPrice = Math.floor(price * 100_000_000);

    let psbt: string;
    try {
      setActiveStep(0);
      psbt = await getListPsbt(listing.pixel.id, publicKey.ordinals, satsPrice);
    } catch (err: any) {
      console.log(err);
      setErrorStep(0);
      setErrorMessage(err?.response?.data?.reason ?? "Something went wrong");
      // refetch();
      return;
    }

    let signedPsbtStr: string;
    try {
      setActiveStep(1);
      const signedPsbt = await sign(address.ordinals, psbt, {
        finalize: true,
        extractTx: false,
        sigHash:
          bitcoin.Transaction.SIGHASH_SINGLE |
          bitcoin.Transaction.SIGHASH_ANYONECANPAY,
      });
      if (!signedPsbt.hex) {
        throw new Error("Signing failed!");
      }
      signedPsbtStr = signedPsbt.hex;
    } catch (err: any) {
      console.log(err);
      setErrorStep(1);
      setErrorMessage(err ?? "Something went wrong");
      return;
    }

    try {
      setActiveStep(2);
      await axios.post(
        `/pixel/list/${listing.pixel.id}?psbt=${signedPsbtStr}&price=${satsPrice}&duration=${duration}`,
      );
    } catch (err: any) {
      console.log(err);
      setErrorStep(2);
      setErrorMessage(
        err?.response?.data?.reason ?? "Something went wrong on server side",
      );
      return;
    }

    setActiveStep(3);
  }, [
    address.ordinals,
    axios,
    duration,
    listing,
    openModal,
    price,
    publicKey.ordinals,
    sign,
  ]);

  const handleCancel = useCallback(async () => {
    if (!listing) {
      toast.error("Invalid listing");
      return;
    }

    setCancelConfirmOpen(true);
    setErrorStep(undefined);
    setErrorMessage(undefined);

    try {
      setActiveStep(0);
      await axios.delete(`/pixel/listing/${listing.id}`);
      await delay(5000);
    } catch (err: any) {
      console.log(err);
      setErrorStep(0);
      setErrorMessage(
        err?.response?.data?.reason ?? "Something went wrong on server side",
      );
      return;
    }

    setActiveStep(1);
  }, [axios, listing]);

  useEffect(() => {
    setListing(undefined);
    if (!id) {
      return;
    }

    getListingDetail(id as string).then(setListing);
  }, [id]);

  useEffect(() => {
    if (listing) {
      setPrice(listing.price / 100_000_000);
    }
  }, [listing]);

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
            <Link href={`/market/${listing?.pixel?.id}`}>
              <div className="mr-5 flex items-center">
                <FaChevronLeft className="h-5 w-5" />
              </div>
            </Link>
            <h1 className="text-3xl font-semibold">Edit listing</h1>
          </div>
          {listing && (
            <form
              className="mb-10"
              onSubmit={(e) => {
                e.stopPropagation();
                e.preventDefault();
                handleEdit();
              }}
            >
              <PriceInput
                size={listing.pixel.size}
                value={price}
                setValue={setPrice}
              />
              <InputWrapper title="Duration">
                <DurationInput setDuration={setDuration} />
              </InputWrapper>
              <SummeryView price={price} />
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
                handleContinue={() =>
                  router.push(`/market/${listing?.pixel?.id}`)
                }
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
                handleContinue={() =>
                  router.push(`/market/${listing?.pixel?.id}`)
                }
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
                    {listing?.pixel?.image ? (
                      <Image
                        layout="fill"
                        src={parseIpfsUrl(listing.pixel.image)}
                        alt="Asset Image"
                        // blurDataURL={blurDataURL}
                      />
                    ) : (
                      <Spinner size="md" />
                    )}
                  </div>
                </div>
                <h5 className="mt-5 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {listing?.pixel?.name ?? "--"}
                </h5>
                <h5 className="mt-3 text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
                  {listing
                    ? `(${listing.pixel.left}, ${listing.pixel.top}, ${listing.pixel.right}, ${listing.pixel.bottom})`
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
