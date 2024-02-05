import { CollapsibleCard } from "@/components/common/CollapsibleCard";
import Link from "next/link";
import { FC } from "react";
import { BiDetail } from "react-icons/bi";

type Props = {
  pixel: Pixel;
};

const ItemDetails: FC<Props> = ({ pixel }) => {
  return (
    <div className="my-4 flex w-full">
      <CollapsibleCard
        title="Details"
        icon={<BiDetail className="h-5 w-5" />}
        className="w-full"
      >
        <div className="flex w-full flex-col gap-2 p-5">
          <div className="flex w-full justify-between">
            Token Id
            <span className="text-sm"># {pixel.tokenId}</span>
          </div>
          <div className="flex w-full justify-between">
            Name
            <span className="text-sm">{pixel.name}</span>
          </div>
          <div className="flex w-full justify-between">
            Title
            <span className="text-sm">{pixel.description}</span>
          </div>
          <div className="flex w-full justify-between">
            Link
            <span className="text-sm">
              <Link
                href={pixel.external_url}
                target="_blank"
                className="font-medium text-blue-600 hover:underline dark:text-blue-500"
              >
                {pixel.external_url}
              </Link>
            </span>
          </div>
          <div className="flex w-full justify-between">
            Position
            <span className="text-sm">
              ({pixel.left}, {pixel.top}, {pixel.right}, {pixel.bottom})
            </span>
          </div>
          <div className="flex w-full justify-between">
            Size
            <span className="text-sm">
              {(pixel.right - pixel.left + 1) * (pixel.bottom - pixel.top + 1)}
            </span>
          </div>
        </div>
      </CollapsibleCard>
    </div>
  );
};

export default ItemDetails;
