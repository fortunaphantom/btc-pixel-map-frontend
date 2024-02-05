/* eslint-disable jsx-a11y/click-events-have-key-events */
import { FC, PropsWithChildren, useState } from "react";
import { FaChevronUp } from "react-icons/fa6";
import { twMerge } from "tailwind-merge";

type Props = {
  title: string;
  className?: string;
  opened?: boolean;
  icon?: JSX.Element;
};

export const CollapsibleCard: FC<PropsWithChildren<Props>> = ({
  title,
  className = "",
  opened = true,
  icon,
  children,
}) => {
  const [isOpen, setOpen] = useState<boolean>(opened);

  return (
    <div
      className={twMerge(
        "flex flex-col rounded-lg border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800",
        className,
      )}
    >
      <div className="flex w-full items-center justify-between p-5 text-slate-800 dark:text-slate-200">
        <div className="inline-flex w-full items-center gap-2">
          {icon}
          <p>{title}</p>
        </div>
        <div
          className="cursor-pointer"
          role="button"
          tabIndex={0}
          onClick={() => setOpen(!isOpen)}
        >
          <FaChevronUp
            className={twMerge(
              "h-4 w-4 transition duration-200",
              isOpen ? "rotate-0" : "-rotate-180",
            )}
          />
        </div>
      </div>
      <div
        className={twMerge(
          "w-full overflow-hidden border-gray-200 text-slate-800 transition duration-300 dark:border-gray-700 dark:text-slate-200",
          isOpen ? "h-auto border-t" : "h-0",
        )}
      >
        {children}
      </div>
    </div>
  );
};
