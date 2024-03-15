/* eslint-disable jsx-a11y/label-has-associated-control */
"use client";

import ConformModal from "@/components/modal/ConfirmModal";
import { useAuthContext } from "@/contexts/AuthContext";
import { useConnect } from "@/contexts/WalletConnectProvider";
import { getListPsbt } from "@/helpers/api/market";
import { useSign } from "@/hooks";
import * as bitcoin from "bitcoinjs-lib";
import { Button } from "flowbite-react";
import { useRouter } from "next/navigation";
import { FC, useCallback, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { DurationInput, PriceInput, SummeryView } from ".";
import InputWrapper from "./InputWrapper";

const confirmSteps: ConfirmStep[] = [
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

type Props = {
  pixel: Pixel;
};

export const ListForm: FC<Props> = ({ pixel }) => {
  const [price, setPrice] = useState<number>();
  const [duration, setDuration] = useState<number>();

  // confirm modal
  const [confirmOpen, setConfirmOpen] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [errorStep, setErrorStep] = useState<number>();
  const [errorMessage, setErrorMessage] = useState<string>();

  const router = useRouter();
  const { address, publicKey, openModal } = useConnect();
  const { sign } = useSign();
  const { axios } = useAuthContext();

  const size = useMemo(() => {
    return (pixel.right - pixel.left + 1) * (pixel.bottom - pixel.top + 1);
  }, [pixel]);

  const handleList = useCallback(async () => {
    if (!address?.ordinals || !publicKey.ordinals) {
      openModal();
      return;
    }
    if (!price) {
      toast.error("Please input sell price");
      return;
    }

    setConfirmOpen(true);
    setErrorStep(undefined);
    setErrorMessage(undefined);

    const satsPrice = Math.floor(price * 100_000_000);

    let psbt: string;
    try {
      setActiveStep(0);
      psbt = await getListPsbt(pixel.id, publicKey.ordinals, satsPrice);
    } catch (err: any) {
      console.log(err);
      setErrorStep(0);
      setErrorMessage(err?.response?.data?.reason ?? "Something went wrong");
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
        `/pixel/list/${pixel.id}?psbt=${signedPsbtStr}&price=${satsPrice}&duration=${duration}`,
      );
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
    address.ordinals,
    axios,
    duration,
    openModal,
    pixel.id,
    price,
    publicKey.ordinals,
    sign,
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
      <PriceInput size={size} value={price} setValue={setPrice} />
      <InputWrapper title="Duration">
        <DurationInput setDuration={setDuration} />
      </InputWrapper>
      <SummeryView price={price} />
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
        handleContinue={() => router.push(`/market/${pixel.id}`)}
      />
    </form>
  );
};
