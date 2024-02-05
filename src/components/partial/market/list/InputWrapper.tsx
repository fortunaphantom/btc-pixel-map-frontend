import { FC, PropsWithChildren } from "react";

type Props = {
  title: string;
};

const InputWrapper: FC<PropsWithChildren<Props>> = ({ title, children }) => {
  return (
    <div className="mb-10 flex flex-col">
      <div className="mb-4 flex w-full">
        <span className="text-2xl font-semibold">{title}</span>
      </div>
      {children}
    </div>
  );
};

export default InputWrapper;
