/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import ConfirmModal from "@/components/modal/ConfirmModal";
import ImageCropModal from "@/components/modal/ImageCropModal";
import { delay } from "@/helpers/time";
import { Button, FileInput, Label, TextInput } from "flowbite-react";
import { useRouter } from "next/navigation";
import { FC, useCallback, useState } from "react";
import toast from "react-hot-toast";
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
  const router = useRouter();

  const [name, setName] = useState<string>();
  const [description, setDescription] = useState<string>();
  const [link, setLink] = useState<string>();
  const [cropOpen, setCropOpen] = useState<boolean>(false);
  const [originFile, setOriginFile] = useState<File>();

  // confirm modal
  const [confirmOpen, setConfirmOpen] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [errorStep, setErrorStep] = useState<number>();
  const [errorMessage, setErrorMessage] = useState<string>();

  const handleMint = useCallback(async () => {
    if (
      // !address ||
      !name ||
      !description ||
      !link
    ) {
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
    // let mintParam: MintParam;
    //generate mint param
    setActiveStep(0);
    try {
      // mintParam = await getMintSign({
      //   x: rect.x,
      //   y: rect.y,
      //   width: rect.width,
      //   height: rect.height,
      //   owner: address,
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
      // const { hash } = await mint({
      //   args: [
      //     mintParam.x,
      //     mintParam.y,
      //     mintParam.width,
      //     mintParam.height,
      //     mintParam.metadataUri,
      //     mintParam.signature,
      //   ],
      // });
      // await waitForTransaction({ hash });
      await delay(5000);
      router.push("/");
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
    // mint,
    name,
    rect,
    router,
  ]);

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
            className="flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleMint();
            }}
          >
            <div>
              <div className="mb-2 block">
                <Label htmlFor="position-x">Pixel X</Label>
              </div>
              <TextInput
                id="position-x"
                type="number"
                sizing="sm"
                placeholder="0"
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
              <div className="mb-2 block">
                <Label htmlFor="position-y">Pixel Y</Label>
              </div>
              <TextInput
                id="position-y"
                type="number"
                sizing="sm"
                placeholder="0"
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
              <div className="mb-2 block">
                <Label htmlFor="position-w">Pixel Width</Label>
              </div>
              <TextInput
                id="position-w"
                type="number"
                sizing="sm"
                placeholder="0"
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
              <div className="block">
                <Label htmlFor="position-h">Pixel Height</Label>
              </div>
              <TextInput
                id="position-h"
                type="number"
                sizing="sm"
                placeholder="0"
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
            <hr className="mt-1 w-full border-gray-200 dark:border-gray-700 sm:mx-auto lg:mt-2"></hr>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="name">Name</Label>
              </div>
              <TextInput
                id="name"
                type="text"
                sizing="sm"
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
                sizing="sm"
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
                sizing="sm"
                placeholder="Put your link here..."
                value={link}
                onChange={(e) => setLink(e.target.value)}
                required
              />
            </div>
            <hr className="mt-1 w-full border-gray-200 dark:border-gray-700 sm:mx-auto lg:mt-2"></hr>
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
    </>
  );
};
