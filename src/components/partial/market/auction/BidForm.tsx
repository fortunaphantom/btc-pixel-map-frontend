import ConformModal from "@/components/modal/ConfirmModal";
import { delay } from "@/helpers/time";
import { Button, Label, TextInput } from "flowbite-react";
import { useRouter } from "next/navigation";
import { FC, useCallback, useEffect, useState } from "react";
import { FaEthereum } from "react-icons/fa6";

const confirmSteps: ConfirmStep[] = [
  {
    title: "Approve WETH to place bid",
    description:
      "You'll be asked to review and transact approve transaction from your wallet.",
  },
  {
    title: "Bid to auction",
    description:
      "You'll be asked to review and transact bid transaction for list from your wallet.",
  },
];

type Props = {
  id: string;
  token: `0x${string}`;
  tokenId: string;
  minWinPrice?: bigint;
};

export const BidForm: FC<Props> = ({
  id,
  // token,
  minWinPrice,
  tokenId,
}) => {
  const router = useRouter();
  const [price, setPrice] = useState<number>(0);

  // confirm modal
  const [confirmOpen, setConfirmOpen] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [errorStep, setErrorStep] = useState<number>();
  const [errorMessage, setErrorMessage] = useState<string>();

  // const { wallet } = useWalletAddress();

  const handleBid = useCallback(async () => {
    // if (data?.allowance == undefined) {
    //   toast.error("Invalid input! Please check order parameters");
    //   return;
    // }

    setConfirmOpen(true);
    setErrorStep(undefined);
    setErrorMessage(undefined);

    // const priceInBigInt = parseEther(price + "");
    try {
      setActiveStep(0);
      // if (data.allowance < priceInBigInt) {
      //   const { hash } = await approve({
      //     args: [MARKETPLACE_CONTRACT_ADDRESS, priceInBigInt],
      //   });
      //   await waitForTransaction({ hash });
      // }
    } catch (err: any) {
      console.log(err);
      setErrorStep(0);
      setErrorMessage(err?.shortMessage ?? "Something went wrong");
      return;
    }

    try {
      setActiveStep(1);
      // const { hash } = await bid({
      //   args: [id, priceInBigInt],
      // });
      // await waitForTransaction({ hash });
      await delay(5000);
    } catch (err: any) {
      console.log(err);
      setErrorStep(1);
      setErrorMessage(err?.shortMessage ?? "Something went wrong");
      return;
    }

    setActiveStep(2);
  }, [
    // approve,
    // bid,
    // data?.allowance,
    id,
    price,
  ]);

  useEffect(() => {
    if (!minWinPrice) {
      return;
    }

    // const priceInBigInt = parseEther(price + "");

    // if (priceInBigInt < minWinPrice) {
    //   setPrice(+formatEther(minWinPrice ?? 0n));
    // }
  }, [price, minWinPrice]);

  return (
    <div className="mt-2 flex flex-col">
      <div className="w-full">
        <div className="mb-2 block">
          <Label htmlFor="price" value="Set price" />
        </div>
        <TextInput
          id="price"
          type="number"
          rightIcon={FaEthereum}
          placeholder="0.1"
          value={price}
          onChange={(e) => setPrice(+e.target.value)}
          required
        />
      </div>
      <Button
        type="button"
        color="success"
        className="mt-2 w-full"
        onClick={handleBid}
        // disabled={confirmOpen || (data?.balance ?? 0n) < parseEther(price + "")}
      >
        {/* {(data?.balance ?? 0n) < parseEther(price + "")
          ? "Insufficient balance"
          : confirmOpen
            ? "Placing bid..."
            : "Place bid"} */}
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
        handleRetry={handleBid}
        handleContinue={() => router.push(`/market/${tokenId}`)}
      />
    </div>
  );
};
