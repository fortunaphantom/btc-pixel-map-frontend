/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { usePixelDataContext } from "@/context/PixelDataContext";
import { parseIpfsUrl } from "@/helpers";
import { getMapImage } from "@/helpers/api";
import { Button } from "flowbite-react";
import Image from "next/image";
import { FC, useEffect, useState } from "react";
import { MdOutlineZoomInMap } from "react-icons/md";
import { RiZoomInFill, RiZoomOutFill } from "react-icons/ri";

export const MapBoard: FC = () => {
  const { pixels } = usePixelDataContext();
  const [zoom, setZoom] = useState<number>(1);

  const [mapImage, setMapImage] = useState<string>();

  useEffect(() => {
    getMapImage().then((res) => setMapImage(res));
  }, []);

  return (
    <>
      <div className="absolute bottom-4 right-4 z-10">
        <Button.Group outline>
          <Button
            type="button"
            disabled={zoom > 8}
            onClick={() => setZoom(zoom * 1.2)}
            gradientDuoTone="cyanToBlue"
          >
            <RiZoomInFill className="h-5 w-5" />
          </Button>
          <Button
            type="button"
            disabled={zoom < 0.5}
            onClick={() => setZoom(zoom / 1.2)}
            gradientDuoTone="cyanToBlue"
          >
            <RiZoomOutFill className="h-5 w-5" />
          </Button>
          <Button
            type="button"
            onClick={() => setZoom(1)}
            disabled={zoom == 1}
            gradientDuoTone="cyanToBlue"
          >
            <MdOutlineZoomInMap className="h-5 w-5" />
          </Button>
        </Button.Group>
      </div>
      <div
        className="relative h-[1000px] w-[1000px] transition duration-200"
        style={{
          zoom: zoom,
        }}
      >
        {mapImage && (
          <Image
            width={1000}
            height={1000}
            src={parseIpfsUrl(mapImage)}
            alt="Map Image"
            className="absolute left-0 top-0 bg-orange-400"
            useMap="#pixel-map"
          />
        )}
        <map name="pixel-map">
          {pixels.map((pixel) => (
            <area
              key={pixel.tokenId}
              shape="rect"
              coords={`${pixel.left},${pixel.top},${pixel.right},${pixel.bottom}`}
              href={pixel.external_url}
              title={pixel.description}
              target="_blank"
            ></area>
          ))}
        </map>
      </div>
    </>
  );
};
