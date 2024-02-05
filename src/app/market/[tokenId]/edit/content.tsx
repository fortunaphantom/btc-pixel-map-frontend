/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/label-has-associated-control */
"use client";

import ConfirmModal from "@/components/modal/ConfirmModal";
import ImageCropModal from "@/components/modal/ImageCropModal";
import { getPixelDetail } from "@/helpers/api";
import { delay } from "@/helpers/time";
import { Button, FileInput, Label, TextInput } from "flowbite-react";
import { NextPage } from "next";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { RiImageEditFill } from "react-icons/ri";

const confirmSteps: ConfirmStep[] = [
  {
    title: "Generate Pixel Parameters",
    description: "You have to wait for the update parameters to be generated.",
  },
  {
    title: "Sign for transaction",
    description:
      "You'll be asked to review and confirm this transaction from your wallet.",
  },
];

const EditContent: NextPage = () => {
  const { tokenId } = useParams();
  const router = useRouter();
  const [pixel, setPixel] = useState<Pixel>();

  const [name, setName] = useState<string>();
  const [description, setDescription] = useState<string>();
  const [link, setLink] = useState<string>();
  const [cropOpen, setCropOpen] = useState<boolean>(false);
  const [originFile, setOriginFile] = useState<File>();
  const [croppedImage, setCroppedImage] = useState<string>();

  // confirm modal
  const [confirmOpen, setConfirmOpen] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [errorStep, setErrorStep] = useState<number>();
  const [errorMessage, setErrorMessage] = useState<string>();

  const handleMint = useCallback(async () => {
    if (!name || !description || !link || !pixel) {
      return;
    }

    // if (address != pixel.ownerId) {
    //   toast.error("Permission denied");
    // }

    if (!croppedImage) {
      toast.error("Please crop image of pixel");
      return undefined;
    }

    setConfirmOpen(true);
    setErrorStep(undefined);
    setErrorMessage(undefined);
    // let mintParam: MintParam;
    //generate mint param
    setActiveStep(0);
    try {
      // mintParam = await generateUpdateParams(pixel.tokenId, {
      //   name,
      //   description,
      //   externalLink: link,
      //   image: croppedImage,
      // });
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

    try {
      // const { hash } = await updateTokenUri({
      //   args: [pixel.tokenId, mintParam.metadataUri],
      // });
      // await waitForTransaction({ hash });
      await delay(5000);
    } catch (error: unknown) {
      console.log(error);
      setErrorStep(1);
      setErrorMessage((error as any)?.shortMessage ?? "Something went wrong.");
      return undefined;
    }
    setActiveStep(2);
  }, [
    // address,
    croppedImage,
    description,
    link,
    name,
    pixel,
    // updateTokenUri
  ]);

  useEffect(() => {
    setPixel(undefined);
    if (!tokenId) {
      return;
    }

    getPixelDetail(tokenId as string).then(setPixel);
  }, [tokenId]);

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
        handleContinue={() => router.push(`/market/${pixel?.tokenId}`)}
        successMessage="Pixel updated successfully"
      />
    </div>
  );
};

export default EditContent;
