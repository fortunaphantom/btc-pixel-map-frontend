import { useCurrentTime } from "@/contexts/CurrentTimeContext";
import { formatNumberWithUnit, parseIpfsUrl } from "@/helpers";
// import { dynamicBlurDataUrl } from "@/helpers/image";
import { Card } from "flowbite-react";
import Image from "next/image";
import { FC } from "react";

type CardProps = {
  pixel: Pixel;
};

const PixelCard: FC<CardProps> = ({ pixel }) => {
  const now = useCurrentTime();
  // const [blurDataURL, setBlurDataURL] = useState<string>();

  // useEffect(() => {
  //   if (pixel?.image) {
  //     dynamicBlurDataUrl(pixel.image).then(setBlurDataURL);
  //   }
  // }, [pixel?.image]);

  return (
    <Card
      href={`/market/${pixel.id}`}
      className="w-full"
      renderImage={() => (
        <div className="relative flex h-52 w-full items-center justify-center overflow-hidden rounded-t-lg bg-slate-100 dark:bg-slate-900">
          <Image
            objectFit="contain"
            layout="fill"
            src={parseIpfsUrl(pixel.image)}
            // blurDataURL={blurDataURL}
            alt="Pixel Image"
            className="overflow-hidden rounded-lg"
          />
          <div className="absolute right-4 top-4 text-xs shadow-slate-100 [text-shadow:0px_0px_4px_var(--tw-shadow-color)] dark:shadow-slate-900">
            {pixel.right - pixel.left + 1} X {pixel.bottom - pixel.top + 1}
          </div>
        </div>
      )}
      theme={{
        root: {
          children: "flex flex-col justify-center p-4",
        },
      }}
    >
      <div className="flex w-full flex-col gap-1">
        <h5 className="text-md w-full overflow-hidden text-ellipsis whitespace-nowrap font-bold tracking-tight text-slate-900 dark:text-white">
          {pixel.name}
        </h5>
        <p className="h-5 w-full overflow-hidden text-ellipsis whitespace-nowrap text-sm font-bold tracking-tight text-slate-900 dark:text-white">
          {pixel?.price && (pixel?.priceExpiration ?? 0) >= now
            ? `Price: ${formatNumberWithUnit(pixel?.price)} ETH`
            : " "}
        </p>
        <p className="h-4 w-full overflow-hidden text-ellipsis whitespace-nowrap text-xs font-bold tracking-tight text-slate-700 dark:text-slate-300">
          {pixel?.lastPrice
            ? `Last Sale: ${formatNumberWithUnit(pixel?.lastPrice)} ETH`
            : " "}
        </p>
      </div>
    </Card>
  );
};

export default PixelCard;
