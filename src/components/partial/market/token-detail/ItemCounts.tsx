import { FC } from "react";
import { FaEye, FaHeart } from "react-icons/fa6";

type Props = {
  pixel: Pixel;
};

const ItemCounts: FC<Props> = ({ pixel }) => {
  return (
    <div className="mx-5 my-4 flex text-slate-900 dark:text-white">
      <div className="my-2 mr-6 flex items-center">
        <div className="mr-2 flex items-center justify-center">
          <FaEye />
        </div>
        <span className="text-sm" data-id="TextBody">
          {pixel.views.length ?? 0} views
        </span>
      </div>
      {pixel.favorites.length ? (
        <div className="my-2 mr-6 flex items-center">
          <div className="mr-2 flex items-center justify-center">
            <FaHeart />
          </div>
          <span className="text-sm" data-id="TextBody">
            {pixel.favorites.length ?? 0} favorites
          </span>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default ItemCounts;
