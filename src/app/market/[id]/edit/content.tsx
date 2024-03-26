/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/label-has-associated-control */
"use client";

import ConfirmModal from "@/components/modal/ConfirmModal";
import ImageCropModal from "@/components/modal/ImageCropModal";
import SelectFeeRate from "@/components/modal/SelectFeeRate";
import { useConnect } from "@/contexts/WalletConnectProvider";
import { getPixelDetail } from "@/helpers/api";
import { getUpdatePsbt } from "@/helpers/api/mint";
import { waitForReveal } from "@/helpers/ordinals/waitForReveal";
import { useFeeRecommended, useSend } from "@/hooks";
import { Button, FileInput, Label, TextInput } from "flowbite-react";
import { NextPage } from "next";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaEdit } from "react-icons/fa";
import { RiImageEditFill } from "react-icons/ri";

const confirmSteps: ConfirmStep[] = [
  {
    title: "Generate Update PSBT",
    description: "You have to wait for the mint parameters to be created.",
  },
  {
    title: "Sign for transaction",
    description:
      "You'll be asked to review and confirm this transaction from your wallet.",
  },
  {
    title: "Wait ordinal to be revealed",
    description: "You need to wait while reveal transaction to be confirmed",
  },
];

const EditContent: NextPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const { address } = useConnect();
  const { send } = useSend();
  const [pixel, setPixel] = useState<Pixel>();

  const [name, setName] = useState<string>();
  const [description, setDescription] = useState<string>();
  const [link, setLink] = useState<string>();
  const [cropOpen, setCropOpen] = useState<boolean>(false);
  const [originFile, setOriginFile] = useState<File>();
  const [croppedImage, setCroppedImage] = useState<string>();

  const feesRecommended = useFeeRecommended();
  const [feeRate, setFeeRate] = useState<number>(1);
  const [editFeeOpen, setEditFeeOpen] = useState<boolean>(false);

  // confirm modal
  const [confirmOpen, setConfirmOpen] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [errorStep, setErrorStep] = useState<number>();
  const [errorMessage, setErrorMessage] = useState<string>();

  const handleMint = useCallback(async () => {
    if (!address?.ordinals || !name || !description || !link || !pixel) {
      return;
    }

    if (!croppedImage) {
      toast.error("Please crop image of pixel");
      return undefined;
    }

    setConfirmOpen(true);
    setErrorStep(undefined);
    setErrorMessage(undefined);
    let mintParam: MintParam;
    //generate update param
    setActiveStep(0);
    try {
      mintParam = await getUpdatePsbt(pixel.id, {
        name,
        description,
        externalLink: link,
        image: croppedImage,
        feeRate,
      });
    } catch (error: unknown) {
      console.log(error);
      setErrorStep(0);
      setErrorMessage(
        (error as any).response?.data?.reason ??
          "Something went wrong on server side.",
      );
      return undefined;
    }
    setActiveStep(1);

    let tx;
    try {
      tx = await send(mintParam.address, mintParam.revealFee, feeRate, true);
      console.log(tx);
    } catch (error: unknown) {
      console.log(error);
      setErrorStep(1);
      setErrorMessage(
        (error as any)?.message ?? error ?? "Something went wrong.",
      );
      return undefined;
    }
    setActiveStep(2);

    try {
      await waitForReveal(mintParam.address, tx!);
      toast.success("Successfully minted new Pixels!");
    } catch (error: any) {
      console.log(error);
      setErrorStep(2);
      setErrorMessage(
        error?.message ??
          error?.response?.data?.reason ??
          "Something went wrong.",
      );
      return undefined;
    }
    setActiveStep(3);
  }, [
    address?.ordinals,
    croppedImage,
    description,
    feeRate,
    link,
    name,
    pixel,
    send,
  ]);

  useEffect(() => {
    if (feesRecommended) {
      setFeeRate(feesRecommended.hourFee);
    }
  }, [feesRecommended]);

  useEffect(() => {
    setPixel(undefined);
    if (!id) {
      return;
    }

    getPixelDetail(id as string).then(setPixel);
  }, [id]);

  return (
    <div className="mx-auto flex h-full w-full max-w-2xl flex-col justify-center px-4">
      <header>
        <h2 className="mb-5 mt-9 text-4xl font-bold dark:text-slate-200">
          Edit Pixel Data
        </h2>
      </header>
      <form
        className="flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleMint();
        }}
      >
        <div>
          <div className="mb-2 block">
            <Label htmlFor="image">Pixel Image</Label>
          </div>
          <div className="relative grid grid-cols-[1fr_auto] gap-1">
            <div className="relative">
              <FileInput
                id="image"
                helperText="A profile picture on your pixel"
                onChange={(e) => {
                  setOriginFile(e.target.files?.[0]);
                  setCropOpen(true);
                }}
              />
            </div>
            <div onClick={() => setCropOpen(true)}>
              <RiImageEditFill className="mt-[10px] h-6 w-6 cursor-pointer text-slate-800 dark:text-white" />
            </div>
          </div>
        </div>
        <hr className="mt-1 w-full border-gray-200 dark:border-gray-700 sm:mx-auto lg:mt-2"></hr>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="name">Name</Label>
          </div>
          <TextInput
            id="name"
            type="text"
            placeholder="Put pixel name here..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="description">Description</Label>
          </div>
          <TextInput
            id="description"
            type="text"
            placeholder="Put pixel description here..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="link">External Link</Label>
          </div>
          <TextInput
            id="link"
            type="text"
            placeholder="Put your link here..."
            value={link}
            onChange={(e) => setLink(e.target.value)}
            required
          />
        </div>
        <hr className="mt-1 w-full border-gray-200 dark:border-gray-700 sm:mx-auto lg:mt-2"></hr>
        <div className="flex w-full items-center justify-between">
          <span className="text-slate-800 dark:text-white">
            {feeRate} Sats/vByte
          </span>
          <div onClick={() => setEditFeeOpen(true)}>
            <FaEdit className="h-5 w-5 cursor-pointer text-slate-800 dark:text-white" />
          </div>
        </div>
        <hr className="mt-1 w-full border-gray-200 dark:border-gray-700 sm:mx-auto lg:mt-2"></hr>
        <Button type="submit" size="lg">
          Update Pixel
        </Button>
      </form>
      <ImageCropModal
        isOpen={cropOpen}
        setOpen={setCropOpen}
        file={originFile}
        setCroppedImage={setCroppedImage}
        size={{
          width: pixel ? pixel.right - pixel.left + 1 : 0,
          height: pixel ? pixel.bottom - pixel.top + 1 : 1,
        }}
      />
      <ConfirmModal
        isOpen={confirmOpen}
        setOpen={setConfirmOpen}
        title="Update Pixel"
        steps={confirmSteps}
        activeStep={activeStep}
        errorStep={errorStep}
        errorMessage={errorMessage}
        handleRetry={() => handleMint()}
        handleContinue={() => router.push(`/market/${pixel?.id}`)}
        successMessage="Pixel updated successfully"
      />
      <SelectFeeRate
        isOpen={editFeeOpen}
        setOpen={setEditFeeOpen}
        feeRate={feeRate}
        setFeeRate={setFeeRate}
      />
    </div>
  );
};

export default EditContent;
