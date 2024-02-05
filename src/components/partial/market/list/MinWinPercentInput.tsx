import { Label, TextInput } from "flowbite-react";
import { FC } from "react";
import { FaPercent } from "react-icons/fa6";
import InputWrapper from "./InputWrapper";

/* eslint-disable jsx-a11y/label-has-associated-control */
type Props = {
  value?: number;
  setValue: (value: number) => void;
};

export const MinWinPercentInput: FC<Props> = ({ value, setValue }) => {
  return (
    <InputWrapper title="Set minimum win percent">
      <div className="w-full">
        <div className="mb-2 block">
          <Label htmlFor="price" value="Min win percent" />
        </div>
        <TextInput
          id="price"
          type="number"
          rightIcon={FaPercent}
          min={100}
          step={1}
          value={value == undefined ? undefined : value?.toString()}
          onChange={(e) => setValue(+e.target.value)}
          required
        />
      </div>
    </InputWrapper>
  );
};
