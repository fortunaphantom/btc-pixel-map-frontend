import { parseIpfsUrl } from "@/helpers";
import { imageToDataUri } from "@/helpers/image";
import cx from "classnames";
import Image from "next/image";
import { FC, useEffect, useState } from "react";
import { FaCloudArrowUp } from "react-icons/fa6";

type Props = {
  title: string;
  value: File | string | undefined;
  setValue: (value: File | string | undefined) => void;
  description?: string;
  rounded?: boolean;
};

const ImageInput: FC<Props> = ({
  title,
  value,
  setValue,
  description,
  rounded = false,
}) => {
  const [url, setUrl] = useState<string>();

  useEffect(() => {
    if (!value) {
      return;
    }

    if (typeof value == "string") {
      setUrl(parseIpfsUrl(value));
    } else {
      imageToDataUri(value).then((res) => setUrl(res as string));
    }
  }, [value]);

  return (
    <div
      className={cx(
        "flex h-40 w-40 items-center justify-center overflow-hidden border-2 border-dashed border-gray-600 hover:border-gray-500",
        rounded ? "rounded-full" : "rounded-lg",
      )}
    >
      <label
        htmlFor={title.toLowerCase().replace(" ", "-")}
        className="hover:bg-bray-800 flex h-full w-full cursor-pointer flex-col items-center justify-center rounded-lg bg-slate-800 hover:bg-slate-700"
      >
        {url ? (
          <Image
            src={url}
            className="h-full w-full object-cover"
            alt={title}
            layout="fill"
          />
        ) : (
          <div className="flex flex-col items-center justify-center pb-6 pt-5">
            <FaCloudArrowUp className="mb-4 h-8 w-8 text-gray-400" />
            <p className="mb-2 text-center text-sm text-gray-400">
              <span className="font-semibold">Click to upload</span> or drag and
              drop
            </p>
            <p className="text-xs text-gray-400">{description}</p>
          </div>
        )}
        <input
          id={title.toLowerCase().replace(" ", "-")}
          type="file"
          className="hidden"
          onChange={(e) => setValue(e.target.files?.[0])}
        />
      </label>
    </div>
  );
};

export default ImageInput;
