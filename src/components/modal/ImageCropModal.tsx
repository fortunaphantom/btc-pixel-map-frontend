import { extractSubImage } from "@/helpers/image";
import { Modal } from "flowbite-react";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import Cropper from "react-easy-crop";

type Props = {
  isOpen: boolean;
  setOpen: (value: boolean) => void;
  file?: File;
  size?: Size;
  setCroppedImage: (value: string | undefined) => void;
};

const ImageCropModal: FC<Props> = ({
  isOpen,
  setOpen,
  file,
  size,
  setCroppedImage,
}) => {
  const originalImage = useMemo(
    () => (file ? URL.createObjectURL(file) : undefined),
    [file],
  );
  const [crop, setCrop] = useState<Position>({ x: 0, y: 0 });
  const [completedCrop, setCompletedCrop] = useState<Position>();
  const [zoom, setZoom] = useState<number>(0);
  const [zoomPixel, setZoomPixel] = useState<number>(1);

  const onCropComplete = useCallback(
    async (croppedArea: MintRect, croppedAreaPixels: MintRect) => {
      setCompletedCrop({
        x: croppedAreaPixels.x,
        y: croppedAreaPixels.y,
      });
      setZoomPixel((size?.width ?? 0) / croppedAreaPixels.width);
    },
    [size?.width],
  );

  useEffect(() => {
    if (!originalImage || !size || !completedCrop) {
      return;
    }

    const timer = setTimeout(
      () =>
        extractSubImage(
          originalImage,
          {
            x: completedCrop.x,
            y: completedCrop.y,
            width: Math.round(size.width / zoomPixel),
            height: Math.round(size.height / zoomPixel),
          },
          size,
          0,
        ).then(setCroppedImage),
      200,
    );

    return () => clearTimeout(timer);
  }, [completedCrop, originalImage, setCroppedImage, size, zoomPixel]);

  return (
    <Modal show={isOpen} onClose={() => setOpen(false)} dismissible={true}>
      <Modal.Header className="bg-slate-800">Crop Pixel Image</Modal.Header>
      <Modal.Body
        className=". overflow-auto
      bg-slate-800"
      >
        {file ? (
          (size?.width ?? 0) * (size?.height ?? 0) > 0 ? (
            <div className="mt-8 w-full flex-col">
              <div
                className="relative w-full"
                style={{
                  aspectRatio: (size?.width ?? 0) / (size?.height ?? 1),
                }}
              >
                <Cropper
                  image={URL.createObjectURL(file)}
                  crop={crop}
                  zoom={2 ** zoom}
                  cropSize={size}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  zoomWithScroll={false}
                />
              </div>

              <input
                id="zoom-range"
                type="range"
                value={zoom}
                min={-10}
                max={10}
                step={0.1}
                onChange={(e) => setZoom(+e.target.value)}
                className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 dark:bg-gray-700"
              />
            </div>
          ) : (
            <p className="my-2 text-base leading-relaxed text-slate-500 dark:text-slate-400">
              Please select valid pixel area
            </p>
          )
        ) : (
          <p className="my-2 text-base leading-relaxed text-slate-500 dark:text-slate-400">
            Please select file first
          </p>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default ImageCropModal;
