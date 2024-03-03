/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import ConfirmModal from "@/components/modal/ConfirmModal";
import ImageCropModal from "@/components/modal/ImageCropModal";
import SelectFeeRate from "@/components/modal/SelectFeeRate";
import { useConnect } from "@/contexts/WalletConnectProvider";
import { getMintSign } from "@/helpers/api/mint";
import { waitForReveal } from "@/helpers/ordinals/waitForReveal";
import { useFeeRecommended, useSend } from "@/hooks";
import { Button, FileInput, FloatingLabel, Label } from "flowbite-react";
import { FC, useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaEdit } from "react-icons/fa";
import { HiChevronDoubleLeft, HiChevronDoubleRight } from "react-icons/hi";
import { RiImageEditFill } from "react-icons/ri";
import { twMerge } from "tailwind-merge";

const confirmSteps: ConfirmStep[] = [
  {
    title: "Generate Pixel Parameters",
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

type Props = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  rect?: MintRect;
  setRect: (value: MintRect) => void;
  croppedImage?: string;
  setCroppedImage: (value: string | undefined) => void;
};

export const MintPanel: FC<Props> = ({
  isOpen,
  setIsOpen,
  rect,
  setRect,
  croppedImage,
  setCroppedImage,
}) => {
  const { address } = useConnect();
  const { send } = useSend();

  const [name, setName] = useState<string>();
  const [description, setDescription] = useState<string>();
  const [link, setLink] = useState<string>();
  const [cropOpen, setCropOpen] = useState<boolean>(false);
  const [originFile, setOriginFile] = useState<File>();

  const feesRecommended = useFeeRecommended();
  const [feeRate, setFeeRate] = useState<number>(1);
  const [editFeeOpen, setEditFeeOpen] = useState<boolean>(false);

  // confirm modal
  const [confirmOpen, setConfirmOpen] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [errorStep, setErrorStep] = useState<number>();
  const [errorMessage, setErrorMessage] = useState<string>();

  const handleMint = useCallback(async () => {
    if (!address?.ordinals || !name || !description || !link) {
      return;
    }

    if (!rect) {
      toast.error("Please selected mint area");
      return undefined;
    }
    if (!croppedImage) {
      toast.error("Please crop image of pixel");
      return undefined;
    }

    setConfirmOpen(true);
    setErrorStep(undefined);
    setErrorMessage(undefined);
    let mintParam: MintParam;
    //generate mint param
    setActiveStep(0);
    try {
      mintParam = await getMintSign({
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height,
        name,
        description,
        externalLink: link,
        image: croppedImage,
        feeRate,
        receiver: address.ordinals,
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
    address.ordinals,
    croppedImage,
    description,
    feeRate,
    link,
    name,
    rect,
    send,
  ]);

  useEffect(() => {
    if (feesRecommended) {
      setFeeRate(feesRecommended.hourFee);
    }
  }, [feesRecommended]);

  return (
    <>
      <div
        className="fixed right-0 top-16 z-20 cursor-pointer rounded-l-lg border border-slate-400 bg-slate-200 p-2 text-slate-400 dark:border-slate-600 dark:bg-slate-950 dark:text-white"
        onClick={() => setIsOpen(!isOpen)}
        title={isOpen ? "Close Mint Panel" : "Open Mint Panel"}
      >
        {isOpen ? <HiChevronDoubleRight /> : <HiChevronDoubleLeft />}
      </div>
      <div
        className={twMerge(
          "fixed top-0 h-screen w-full overflow-auto border-l border-slate-200 bg-white px-2 pb-4 pt-16 transition-all duration-200 dark:border-slate-600 dark:bg-slate-800 md:w-64 lg:w-72 2xl:w-80",
          isOpen ? "right-0" : "-right-80",
        )}
      >
        <div className="flex w-full flex-col">
          <header>
            <h2 className="mb-3 mt-9 text-2xl font-bold dark:text-slate-200">
              Pixel Data
            </h2>
          </header>
          <form
            className="flex flex-col gap-2 py-2"
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleMint();
            }}
          >
            <div>
              <FloatingLabel
                variant="outlined"
                label="X"
                sizing="sm"
                value={rect?.x}
                onChange={(e) =>
                  setRect({
                    x: +e.target.value,
                    y: rect?.y ?? 0,
                    width: rect?.width ?? 1,
                    height: rect?.height ?? 1,
                  })
                }
                required
              />
            </div>
            <div>
              <FloatingLabel
                variant="outlined"
                label="Y"
                sizing="sm"
                value={rect?.y}
                onChange={(e) =>
                  setRect({
                    x: rect?.x ?? 0,
                    y: +e.target.value,
                    width: rect?.width ?? 1,
                    height: rect?.height ?? 1,
                  })
                }
                required
              />
            </div>
            <div>
              <FloatingLabel
                variant="outlined"
                label="Width"
                sizing="sm"
                value={rect?.width}
                onChange={(e) =>
                  setRect({
                    x: rect?.x ?? 0,
                    y: rect?.y ?? 0,
                    width: +e.target.value,
                    height: rect?.height ?? 1,
                  })
                }
                required
              />
            </div>
            <div>
              <FloatingLabel
                variant="outlined"
                label="Height"
                sizing="sm"
                value={rect?.height}
                onChange={(e) =>
                  setRect({
                    x: rect?.x ?? 0,
                    y: rect?.y ?? 0,
                    width: rect?.width ?? 1,
                    height: +e.target.value,
                  })
                }
                required
              />
            </div>
            <hr className="mt-1 w-full border-gray-200 dark:border-gray-700 sm:mx-auto lg:mt-2"></hr>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="image">Pixel Image</Label>
              </div>
              <div className="relative grid grid-cols-[1fr_auto] gap-1">
                <div className="relative">
                  <FileInput
                    id="image"
                    sizing="sm"
                    helperText="A profile picture on your pixel"
                    onChange={(e) => {
                      setOriginFile(e.target.files?.[0]);
                      setCropOpen(true);
                    }}
                  />
                </div>
                <div onClick={() => setCropOpen(true)}>
                  <RiImageEditFill className="mt-2 h-5 w-5 cursor-pointer text-slate-800 dark:text-white" />
                </div>
              </div>
            </div>
            <hr className="mb-1 w-full border-gray-200 dark:border-gray-700 sm:mx-auto lg:mb-2"></hr>
            <div>
              <FloatingLabel
                variant="outlined"
                label="Name"
                sizing="sm"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <FloatingLabel
                variant="outlined"
                label="Description"
                sizing="sm"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <div>
              <FloatingLabel
                variant="outlined"
                label="Link"
                sizing="sm"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                required
              />
            </div>
            <hr className="mb-1 w-full border-gray-200 dark:border-gray-700 sm:mx-auto lg:mb-2"></hr>
            <div className="flex w-full items-center justify-between">
              <span className="text-slate-800 dark:text-white">
                {feeRate} Sats/vByte
              </span>
              <div onClick={() => setEditFeeOpen(true)}>
                <FaEdit className="h-5 w-5 cursor-pointer text-slate-800 dark:text-white" />
              </div>
            </div>
            <hr className="mb-1 w-full border-gray-200 dark:border-gray-700 sm:mx-auto lg:mb-2"></hr>
            <Button type="submit">Mint Pixel</Button>
          </form>
        </div>
      </div>
      <ImageCropModal
        isOpen={cropOpen}
        setOpen={setCropOpen}
        file={originFile}
        setCroppedImage={setCroppedImage}
        size={{
          width: rect?.width ?? 0,
          height: rect?.height ?? 1,
        }}
      />
      <ConfirmModal
        isOpen={confirmOpen}
        setOpen={setConfirmOpen}
        title="Mint Pixel"
        steps={confirmSteps}
        activeStep={activeStep}
        errorStep={errorStep}
        errorMessage={errorMessage}
        handleRetry={() => handleMint()}
        handleContinue={() => setConfirmOpen(false)}
        successMessage="Pixel minted successfully"
      />
      <SelectFeeRate
        isOpen={editFeeOpen}
        setOpen={setEditFeeOpen}
        feeRate={feeRate}
        setFeeRate={setFeeRate}
      />
    </>
  );
};
