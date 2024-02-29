import { useFeeRecommended } from "@/hooks";
import { Button, Modal } from "flowbite-react";
import { FC, useState } from "react";
import { FaEdit, FaMinus, FaPlus } from "react-icons/fa";
import { GiRabbit, GiTortoise } from "react-icons/gi";
import { IoRocketSharp } from "react-icons/io5";

type Props = {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  feeRate: number;
  setFeeRate: (value: number) => void;
};

const SelectFeeRate: FC<Props> = ({ isOpen, setOpen, feeRate, setFeeRate }) => {
  const feesRecommended = useFeeRecommended();
  const [useCustom, setCustom] = useState<boolean>(false);

  return (
    <Modal show={isOpen} size="xl" onClose={() => setOpen(false)}>
      <Modal.Header>Edit FeeRate ({`${feeRate} Sats/vByte`})</Modal.Header>
      <Modal.Body>
        <div className="mt-6 flex w-full items-center justify-center">
          <Button.Group>
            <Button
              color={
                !useCustom && feeRate == feesRecommended?.hourFee
                  ? "info"
                  : "gray"
              }
              onClick={() => {
                setFeeRate(feesRecommended?.hourFee ?? 1);
                setCustom(false);
              }}
            >
              <GiTortoise className="mr-2 h-5 w-5" />
              Slow
            </Button>
            <Button
              color={
                !useCustom && feeRate == feesRecommended?.halfHourFee
                  ? "info"
                  : "gray"
              }
              onClick={() => {
                setFeeRate(feesRecommended?.halfHourFee ?? 1);
                setCustom(false);
              }}
            >
              <GiRabbit className="mr-2 h-5 w-5" />
              Medium
            </Button>
            <Button
              color={
                !useCustom && feeRate == feesRecommended?.fastestFee
                  ? "info"
                  : "gray"
              }
              onClick={() => {
                setFeeRate(feesRecommended?.fastestFee ?? 1);
                setCustom(false);
              }}
            >
              <IoRocketSharp className="mr-2 h-4 w-4" />
              Fast
            </Button>
            <Button
              color={useCustom ? "info" : "gray"}
              onClick={() => setCustom(true)}
            >
              <FaEdit className="mr-2 h-4 w-4" />
              Custom
            </Button>
          </Button.Group>
        </div>
        {useCustom && (
          <div className="flex w-full items-start justify-center">
            <div>
              <div className="relative flex w-full items-center">
                <button
                  type="button"
                  className="h-11 rounded-s-lg border border-gray-300 bg-gray-100 p-3 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700"
                  onClick={() => setFeeRate(feeRate > 1 ? feeRate - 1 : 1)}
                >
                  <FaMinus className="h-3 w-3 text-gray-900 dark:text-white" />
                </button>
                <input
                  type="text"
                  aria-describedby="helper-text-explanation"
                  className="block h-11 w-full border-x-0 border-gray-300 bg-gray-50 py-2.5 text-center text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                  min={1}
                  value={feeRate}
                  onChange={(e) => setFeeRate(parseInt(e.target.value) ?? 1)}
                  required
                />
                <button
                  type="button"
                  className="h-11 rounded-e-lg border border-gray-300 bg-gray-100 p-3 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700"
                  onClick={() => setFeeRate(feeRate + 1)}
                >
                  <FaPlus className="h-3 w-3 text-gray-900 dark:text-white" />
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default SelectFeeRate;
