import { FC } from "react";
import InputWrapper from "./InputWrapper";

/* eslint-disable jsx-a11y/label-has-associated-control */
type Props = {
  price?: number;
};

export const SummeryView: FC<Props> = ({ price }) => {
  return (
    <InputWrapper title="Summery">
      <>
        <div className="mb-2 flex flex-wrap justify-between">
          <div className="pr-6" data-id="TextBody">
            Listing price
          </div>
          <div className="" data-id="TextBody">
            {price ?? 0} BTC
          </div>
        </div>
        <div className="mb-2 flex flex-wrap justify-between">
          <div className="pr-6" data-id="TextBody">
            Platform fee
          </div>
          <div className="" data-id="TextBody">
            5%
          </div>
        </div>
        <div className="mb-2 flex flex-wrap justify-between">
          <div className="pr-6" data-id="TextBody">
            Total potential earning
          </div>
          <div className="" data-id="TextBody">
            {(price ?? 0) * 0.95} BTC
          </div>
        </div>
      </>
    </InputWrapper>
  );
};
