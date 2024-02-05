import { Loader } from "@/components/common/Loader";
import { searchPixel } from "@/helpers/api";
import { Button } from "flowbite-react";
import { FC, useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import PixelCard from "../PixelCard";

type Props = {
  address?: string;
  setTotalPixels: (count: number) => void;
};

const UserPixels: FC<Props> = ({ address, setTotalPixels }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadedAll, setLoadedAll] = useState<boolean>(false);
  const [pixels, setPixels] = useState<Pixel[]>([]);

  const fetchPixels = useCallback(
    async (offset: number) => {
      if (!address) {
        return;
      }

      setIsLoading(true);
      try {
        const data = await searchPixel(offset, {}, address);

        if (offset == 0) {
          setLoadedAll(false);
          setTotalPixels(data[0]);
          setPixels(data[1]);
        } else {
          setPixels([...pixels, ...data[1]]);
        }

        if (data[1]?.length < 24) {
          setLoadedAll(true);
        }
      } catch (err: any) {
        console.log(err);
        toast.error(err?.response?.data?.reason);
      }
      setIsLoading(false);
    },
    [address, pixels, setTotalPixels],
  );

  const loadMore = useCallback(async () => {
    await fetchPixels(pixels.length);
  }, [fetchPixels, pixels]);

  useEffect(() => {
    setPixels([]);
    fetchPixels(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  return (
    <div className="grid w-full grid-cols-2 gap-2 md:grid-cols-4 xl:grid-cols-6">
      {pixels.map((pixel) => (
        <PixelCard key={pixel.tokenId} pixel={pixel} />
      ))}
      {isLoading && (
        <div className="col-span-full h-10 w-full">
          <Loader />
        </div>
      )}
      {!isLoading && !loadedAll && (
        <Button color="gray" onClick={loadMore} className="col-span-full">
          Load More
        </Button>
      )}
    </div>
  );
};

export default UserPixels;
