import ConformModal from "@/components/modal/ConfirmModal";
import { delay } from "@/helpers/time";
import { Button } from "flowbite-react";
import { useRouter } from "next/navigation";
import { FC, useCallback, useState } from "react";

const confirmSteps: ConfirmStep[] = [
  {
    title: "Finish auction",
    description:
      "You'll be asked to review and transact finish transaction for list from your wallet.",
  },
];

type Props = {
  tokenId: string;
  id: string;
};

export const FinishForm: FC<Props> = ({ id, tokenId }) => {
  const router = useRouter();
  // confirm modal
  const [confirmOpen, setConfirmOpen] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [errorStep, setErrorStep] = useState<number>();
  const [errorMessage, setErrorMessage] = useState<string>();

  const handleFinish = useCallback(async () => {
    setConfirmOpen(true);
    setErrorStep(undefined);
    setErrorMessage(undefined);

    try {
      setActiveStep(0);
      // const { hash } = await finish({
      //   args: [id],
      // });
      // await waitForTransaction({ hash });
      await delay(5000);
    } catch (err: any) {
      console.log(err);
      setErrorStep(1);
      setErrorMessage(err?.shortMessage ?? "Something went wrong");
      return;
    }

    setActiveStep(1);
  }, [
    // finish,
    id,
  ]);

  return (
    <div className="mt-2 flex flex-col">
      <Button
        type="button"
        color="success"
        className="mt-2 w-full"
        onClick={handleFinish}
        disabled={confirmOpen}
      >
        {confirmOpen ? "Finishing auction..." : "Finish auction"}
      </Button>
      <ConformModal
        title={"Bid to auction"}
        isOpen={confirmOpen}
        setOpen={setConfirmOpen}
        steps={confirmSteps}
        activeStep={activeStep}
        errorStep={errorStep}
        errorMessage={errorMessage}
        successMessage="List succeed"
        handleRetry={handleFinish}
        handleContinue={() => router.push(`/market/${tokenId}`)}
      />
    </div>
  );
};
