import { FC } from "react";
import { FaRegCircleDot } from "react-icons/fa6";
import { twMerge } from "tailwind-merge";
import InputWrapper from "./InputWrapper";

/* eslint-disable jsx-a11y/label-has-associated-control */
type Props = {
  value: ListMode;
  setValue: (value: ListMode) => void;
};

export const ListModeSelect: FC<Props> = ({ value, setValue }) => {
  return (
    <InputWrapper title="Chose type of sale">
      <ul className="flex w-full flex-col gap-4">
        <li>
          <input
            type="radio"
            id="order"
            name="mode"
            value="Order"
            className="peer hidden"
            checked={value == "Order"}
            onClick={() => setValue("Order")}
          />
          <label
            htmlFor="order"
            className="inline-flex w-full cursor-pointer items-center justify-between rounded-lg border border-gray-200 bg-white p-5 text-gray-500 hover:bg-gray-100 hover:text-gray-600 peer-checked:border-cyan-600 peer-checked:text-cyan-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 dark:peer-checked:text-cyan-500"
          >
            <div className="block">
              <div className="w-full text-lg font-semibold">Fixed price</div>
              <div className="w-full text-sm">
                The item is listed at the price you set.
              </div>
            </div>
            <FaRegCircleDot
              className={twMerge("h-5 w-5", value != "Order" && "hidden")}
            />
          </label>
        </li>
        <li>
          <input
            type="radio"
            id="auction"
            name="mode"
            value="Auction"
            className="peer hidden"
            checked={value == "Auction"}
            onClick={() => setValue("Auction")}
          />
          <label
            htmlFor="auction"
            className="inline-flex w-full cursor-pointer items-center justify-between rounded-lg border border-gray-200 bg-white p-5 text-gray-500 hover:bg-gray-100 hover:text-gray-600 peer-checked:border-cyan-600 peer-checked:text-cyan-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 dark:peer-checked:text-cyan-500"
          >
            <div className="block">
              <div className="w-full text-lg font-semibold">
                Sell to highest bidder
              </div>
              <div className="w-full text-sm">
                The item is listed for auction.
              </div>
            </div>
            <FaRegCircleDot
              className={twMerge("h-5 w-5", value != "Auction" && "hidden")}
            />
          </label>
        </li>
      </ul>
    </InputWrapper>
  );
};
