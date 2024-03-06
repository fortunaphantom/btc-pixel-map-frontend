import { Label, TextInput } from "flowbite-react";
import { FC, useMemo } from "react";
import { FaBitcoin } from "react-icons/fa";
import InputWrapper from "./InputWrapper";

/* eslint-disable jsx-a11y/label-has-associated-control */
type Props = {
  size: number;
  value?: number;
  setValue: (value: number) => void;
};

export const PriceInput: FC<Props> = ({ size, value, setValue }) => {
  const title = useMemo(() => {
    if (value) {
      return `Pixel Price (${Math.floor((value * 10000000000) / size) / 100} sats/px)`;
    }

    return "Set price";
  }, [size, value]);
  return (
    <InputWrapper title={title}>
      <div className="w-full">
        <div className="mb-2 block">
          <Label htmlFor="price" value="Start price" />
        </div>
        <TextInput
          id="price"
          type="number"
          rightIcon={FaBitcoin}
          placeholder="0.1"
          value={value == undefined ? undefined : value?.toString()}
          onChange={(e) => setValue(+e.target.value)}
          required
        />
      </div>
    </InputWrapper>
  );
};
