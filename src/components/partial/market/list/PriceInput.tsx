import { Label, TextInput } from "flowbite-react";
import { FC } from "react";
import { FaEthereum } from "react-icons/fa6";
import InputWrapper from "./InputWrapper";

/* eslint-disable jsx-a11y/label-has-associated-control */
type Props = {
  value?: number;
  setValue: (value: number) => void;
};

export const PriceInput: FC<Props> = ({ value, setValue }) => {
  return (
    <InputWrapper title="Set price">
      <div className="w-full">
        <div className="mb-2 block">
          <Label htmlFor="price" value="Start price" />
        </div>
        <TextInput
          id="price"
          type="number"
          rightIcon={FaEthereum}
          placeholder="0.1"
          value={value == undefined ? undefined : value?.toString()}
          onChange={(e) => setValue(+e.target.value)}
          required
        />
      </div>
    </InputWrapper>
  );
};
