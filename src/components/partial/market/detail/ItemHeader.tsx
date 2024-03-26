import { useConnect } from "@/contexts/WalletConnectProvider";
import { shortenString } from "@/helpers";
import Link from "next/link";
import { FC } from "react";
import { FaEdit } from "react-icons/fa";

type Props = {
  pixel: Pixel;
};

const ItemHeader: FC<Props> = ({ pixel }) => {
  const { address } = useConnect();
  return (
    <div className="relative m-5 mb-4 text-slate-900 dark:text-white">
      <h1 className="text-2xl font-bold">{pixel.name}</h1>
      <div className="mt-1">
        <div className="inline-flex items-center gap-1 text-base">
          Owned by
          <span>
            <Link
              href={`/profile/${pixel.ownerId}`}
              className="overflow-hidden text-ellipsis whitespace-nowrap font-semibold uppercase no-underline"
            >
              {pixel.ownerId == address?.ordinals
                ? "YOU"
                : pixel?.owner?.name ?? shortenString(pixel.ownerId)}
            </Link>
          </span>
        </div>
      </div>
      {pixel?.ownerId == address?.ordinals && (
        <div className="absolute right-5 top-2 rounded-full p-2">
          <Link href={`/market/${pixel.id}/edit`} title="Edit Pixel">
            <FaEdit className="h-4 w-4" />
          </Link>
        </div>
      )}
    </div>
  );
};

export default ItemHeader;
