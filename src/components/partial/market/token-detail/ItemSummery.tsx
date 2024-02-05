import { useAuthContext } from "@/context/AuthContext";
import { parseIpfsUrl } from "@/helpers";
import { Card } from "flowbite-react";
import Image from "next/image";
import {
  FC,
  useCallback,
  // useEffect,
  // useState,
  useMemo,
} from "react";
import toast from "react-hot-toast";
import { FaHeart, FaRegHeart } from "react-icons/fa6";

type Props = {
  pixel: Pixel;
  refreshPixel: () => Promise<void>;
};

const ItemSummery: FC<Props> = ({ pixel, refreshPixel }) => {
  const { axios } = useAuthContext();

  const favorite = useMemo(
    () =>
      !!pixel.favorites.filter(
        (item) => item.actorId == "0x1",
        // address
      ).length,
    [
      pixel,
      // address
    ],
  );

  const handleFavorite = useCallback(async () => {
    try {
      await axios.post(`/pixel/favorite/${pixel.tokenId}`);
      await refreshPixel();
    } catch (err: any) {
      console.log(err);
      toast.error(err?.response?.reason);
    }
  }, [axios, pixel.tokenId, refreshPixel]);

  // useEffect(() => {
  //   if (pixel?.image) {
  //     dynamicBlurDataUrl(pixel.image).then(setBlurDataURL);
  //   }
  // }, [pixel?.image]);

  return (
    <Card
      renderImage={() => (
        <div className="relative aspect-square w-full overflow-hidden rounded-t-md">
          <Image
            layout="fill"
            src={parseIpfsUrl(pixel.image)}
            // blurDataURL={blurDataURL}
            className="object-cover"
            alt="Pixel Image"
          />
        </div>
      )}
    >
      <div className="flex items-center justify-between">
        <h5 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
          {pixel.name ?? `Pixel #${pixel.tokenId}`}
        </h5>
        <button type="button" onClick={handleFavorite}>
          {favorite ? (
            <FaHeart className="h-4 w-4" />
          ) : (
            <FaRegHeart className="h-4 w-4" />
          )}
        </button>
      </div>
    </Card>
  );
};

export default ItemSummery;
