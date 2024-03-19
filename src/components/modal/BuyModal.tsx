/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { network } from "@/config";
import { useConnect } from "@/contexts/WalletConnectProvider";
import { parseIpfsUrl } from "@/helpers";
import { getBuyPsbt } from "@/helpers/api/market";
import { waitForTx } from "@/helpers/ordinals/waitForTx";
import { useBalance, useFeeRecommended, useSign } from "@/hooks";
import { UTXOManager } from "@sadoprotocol/ordit-sdk";
import { MINIMUM_AMOUNT_IN_SATS } from "@sadoprotocol/ordit-sdk/dist/constants";
import * as bitcoin from "bitcoinjs-lib";
import { Button, Card, Modal, Spinner } from "flowbite-react";
import Image from "next/image";
import { FC, useCallback, useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { FaWallet } from "react-icons/fa6";
import ConformModal from "./ConfirmModal";
import SelectFeeRate from "./SelectFeeRate";

const confirmSteps: ConfirmStep[] = [
  {
    title: "Split utxo for instant trade",
    description:
      "You will be asked to review for split transaction if you don't have enough utxos",
  },
  {
    title: "Generate PSBT",
    description: "You need to wait until psbt to be generated.",
  },
  {
    title: "Sign for transaction",
    description:
      "You'll be asked to review and sign for buy transaction from your wallet.",
  },
  {
    title: "Wait until transaction to be confirmed",
    description: "You need to wait until transaction to be confirmed.",
  },
];

type Props = {
  isOpen: boolean;
  setOpen: (value: boolean) => void;
  pixel: Pixel;
};

const BuyModal: FC<Props> = ({ isOpen, setOpen, pixel }) => {
  const { address, publicKey, openModal, datasource } = useConnect();
  const { getBalance } = useBalance();
  const { sign } = useSign();

  const [balance, setBalance] = useState<number>();
  // confirm modal
  const [confirmOpen, setConfirmOpen] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [errorStep, setErrorStep] = useState<number>();
  const [errorMessage, setErrorMessage] = useState<string>();

  const feesRecommended = useFeeRecommended();
  const [feeRate, setFeeRate] = useState<number>(1);
  const [editFeeOpen, setEditFeeOpen] = useState<boolean>(false);

  const handleBuy = useCallback(async () => {
    if (!address?.ordinals || !address?.payments || !publicKey?.payments) {
      openModal();
      return;
    }
    if (!pixel?.listing?.id) {
      return;
    }

    setConfirmOpen(true);
    setErrorStep(undefined);
    setErrorMessage(undefined);

    try {
      setActiveStep(0);
      const utxos = (
        await datasource.getUnspents({
          address: address.payments,
          sort: "asc", // sort by ascending order to use low amount utxos as refundable utxos
        })
      ).spendableUTXOs.filter((utxo) => utxo.sats >= MINIMUM_AMOUNT_IN_SATS);

      // 3 = 2 refundable + (at least) 1 to cover for purchase
      if (utxos.length < 3) {
        const utxoManager = new UTXOManager({
          address: address.payments,
          network,
          publicKey: publicKey.payments,
          feeRate: feeRate,
        });

        await utxoManager.splitUTXOForInstantTrade(address.payments);
        const base64 = utxoManager.toBase64();
        const signedTxHex = await sign(address.payments, base64, {});
        const txId = await datasource.relay({ hex: signedTxHex.hex });
        await waitForTx(txId);
      }
    } catch (err: any) {
      console.dir(err);
      setErrorStep(0);
      setErrorMessage(
        err?.message ?? err ?? "Something went wrong when split utxos",
      );
      return;
    }

    let tx: any;
    try {
      setActiveStep(1);
      tx = await getBuyPsbt(
        pixel.listing.id,
        address.payments,
        publicKey.payments,
        address.ordinals,
        feeRate,
      );
    } catch (err: any) {
      console.log(err);
      setErrorStep(1);
      setErrorMessage(err?.message ?? err ?? "Something went wrong");
      return;
    }

    let signedTxHex: string;
    try {
      setActiveStep(2);
      const signedTx = await sign(address.payments, tx.psbt, {
        sigHash: bitcoin.Transaction.SIGHASH_ALL,
        signingIndexes: tx.inputsToSign.signingIndexes,
        finalize: true,
        extractTx: true,
      });
      if (!signedTx.hex) {
        throw new Error("Something went wrong while signing");
      }
      signedTxHex = signedTx.hex;
    } catch (err: any) {
      console.log(err);
      setErrorStep(2);
      setErrorMessage(err?.message ?? err ?? "Something went wrong");
      return;
    }

    try {
      setActiveStep(3);
      const txId = await datasource.relay({ hex: signedTxHex });
      console.log(txId);
      await waitForTx(txId);
    } catch (err: any) {
      console.log(err);
      setErrorStep(3);
      setErrorMessage(
        err?.message ?? err ?? "Something went wrong on server side",
      );
      return;
    }

    setActiveStep(4);
  }, [
    address.ordinals,
    address.payments,
    datasource,
    feeRate,
    openModal,
    pixel?.listing?.id,
    publicKey.payments,
    sign,
  ]);

  useEffect(() => {
    if (getBalance) {
      getBalance().then(setBalance);
    }
  }, [getBalance]);

  useEffect(() => {
    if (feesRecommended) {
      setFeeRate(feesRecommended.hourFee);
    }
  }, [feesRecommended]);

  return (
    <Modal show={isOpen} onClose={() => setOpen(false)} dismissible={true}>
      <Modal.Header className="bg-slate-800">Buy Pixels</Modal.Header>
      <Modal.Body className="overflow-visible bg-slate-800 text-slate-800 dark:text-slate-100">
        <div className="border-level-2 flex w-full border-0 px-4 pt-6">
          <div className="relative flex flex-col justify-center">
            <div className="order-2 mr-4 flex h-20 w-20 shrink-0 flex-col items-center justify-center self-center overflow-hidden">
              <div className="relative h-16 w-16 overflow-hidden rounded-md">
                <Image
                  layout="fill"
                  src={parseIpfsUrl(pixel.image)}
                  alt="Pixel Image"
                />
                qq
              </div>
            </div>
          </div>
          <div className="order-3 mr-4 flex flex-auto flex-col items-start justify-center self-stretch overflow-hidden">
            <div className="text-primary font-semibold">
              <div className="font-semibold"># {pixel.sat}</div>
            </div>
            <span className="text-secondary text-sm text-slate-600 dark:text-slate-400">
              <div className="text-sm">
                {pixel.right - pixel.left + 1} X {pixel.bottom - pixel.top + 1}
              </div>
            </span>
          </div>
          <div className="order-4 flex max-w-[40%] flex-[0_0_auto] flex-col justify-center self-stretch overflow-hidden text-right">
            <span className="font-semibold">
              {pixel?.listing?.pricePerPixel
                ? pixel.listing.pricePerPixel
                : "--"}{" "}
              Sats/px
            </span>
          </div>
        </div>
        <form
          className="flex w-full flex-col gap-4"
          onSubmit={(e) => {
            e.stopPropagation();
            e.preventDefault();
            handleBuy();
          }}
        >
          <Card className="w-full">
            <div className="flex w-full">
              <FaWallet className="mr-2 h-5 w-5" />
              <div className="order-3 mr-4 flex flex-auto flex-col items-start justify-center self-stretch overflow-hidden">
                <span className="text-primary font-semibold">Balance</span>
              </div>
              <div className="order-4 flex max-w-[40%] flex-[0_0_auto] flex-col justify-center self-stretch overflow-hidden text-right">
                <span className="text-primary font-semibold">
                  {balance != undefined ? balance / 100_000_000 : "--"} BTC
                </span>
              </div>
            </div>
            <div className="flex w-full">
              <div className="order-3 mr-4 flex flex-auto flex-col items-start justify-center self-stretch overflow-hidden">
                <span className="text-primary font-semibold">Price</span>
              </div>
              <div className="order-4 flex max-w-[40%] flex-[0_0_auto] flex-col justify-center self-stretch overflow-hidden text-right">
                <span className="text-primary font-semibold">
                  {pixel?.listing?.price
                    ? pixel.listing.price / 100_000_000
                    : "--"}{" "}
                  BTC
                </span>
              </div>
            </div>
            <div className="flex w-full">
              <div className="order-3 mr-4 flex flex-auto flex-col items-start justify-center self-stretch overflow-hidden">
                <span className="text-primary font-semibold">Fee Rate</span>
              </div>
              <div className="order-4 flex max-w-[40%] flex-[0_0_auto] flex-row items-center justify-center gap-2 self-stretch overflow-hidden text-right">
                <span className="text-primary font-semibold">
                  {feeRate} Sats/vByte
                </span>
                <div role="button" onClick={() => setEditFeeOpen(true)}>
                  <FaEdit className="h-5 w-5 cursor-pointer text-slate-800 dark:text-white" />
                </div>
              </div>
            </div>
          </Card>
          <Button
            type="submit"
            color="success"
            size="md"
            className="w-full"
            disabled={!balance || balance < pixel?.listing?.price}
          >
            {balance == undefined ? (
              <Spinner color="info" />
            ) : balance < pixel?.listing?.price ? (
              "Insufficient funds"
            ) : (
              "Buy Pixels"
            )}
          </Button>
          <ConformModal
            title={`Buy Pixels`}
            isOpen={confirmOpen}
            setOpen={setConfirmOpen}
            steps={confirmSteps}
            activeStep={activeStep}
            errorStep={errorStep}
            errorMessage={errorMessage}
            successMessage="Succeed"
            handleRetry={handleBuy}
            handleContinue={() => {
              setOpen(false);
              setConfirmOpen(false);
            }}
          />
          <SelectFeeRate
            isOpen={editFeeOpen}
            setOpen={setEditFeeOpen}
            feeRate={feeRate}
            setFeeRate={setFeeRate}
          />
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default BuyModal;
