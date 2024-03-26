/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { parseIpfsUrl } from "@/helpers";
import { getMapImage } from "@/helpers/api";
import { Button } from "flowbite-react";
import { KonvaEventObject } from "konva/lib/Node";
import { Line } from "konva/lib/shapes/Line";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import { MdOutlineZoomInMap } from "react-icons/md";
import { RiZoomInFill, RiZoomOutFill } from "react-icons/ri";
import { Image, Layer, Stage, Transformer } from "react-konva";
import useImage from "use-image";

type Props = {
  rect?: MintRect;
  setRect?: (value: MintRect) => void;
  croppedImage?: string;
  setCroppedImage?: (value: string | undefined) => void;
};

const MapBoard: FC<Props> = ({
  rect,
  setRect,
  croppedImage,
  setCroppedImage,
}) => {
  const boardRef = useRef<any>();
  const itemRef = useRef<any>();
  const trRef = useRef<any>();
  const gridLayerRef = useRef<any>();
  const [zoom, setZoom] = useState<number>(1);

  const [startPos, setStartPos] = useState<Position>();
  const [endPos, setEndPos] = useState<Position>();
  const [actionOn, setActionOn] = useState<boolean>(false);
  const [onChange, setOnChange] = useState<boolean>(false);
  const [mapImageUrl, setMapImageUrl] = useState<string>();

  const [mapImage] = useImage(parseIpfsUrl(mapImageUrl));
  const [itemImage] = useImage(croppedImage ?? "");

  const handleMouseDown = useCallback(
    (e: KonvaEventObject<MouseEvent>) => {
      if (e.target != boardRef.current) {
        return;
      }

      setActionOn(true);
      setOnChange(true);
      setCroppedImage && setCroppedImage(undefined);

      const pos = e.target.getStage()?.getPointerPosition();

      if (!pos) {
        return;
      }

      setStartPos({
        x: Math.round(pos.x / zoom),
        y: Math.round(pos.y / zoom),
      });
      setEndPos(undefined);
    },
    [setCroppedImage, zoom],
  );
  const handleMouseMove = useCallback(
    (e: KonvaEventObject<MouseEvent>) => {
      if (e.target != boardRef.current && !actionOn) {
        return;
      }

      const pos = e.target.getStage()?.getPointerPosition();

      if (!pos) {
        return;
      }

      setEndPos({
        x: Math.round(pos.x / zoom),
        y: Math.round(pos.y / zoom),
      });
    },
    [actionOn, zoom],
  );
  const handleMouseUp = useCallback(
    (e: KonvaEventObject<MouseEvent>) => {
      const pos = e.target.getStage()?.getPointerPosition();

      if (actionOn && pos) {
        setEndPos({
          x: Math.round(pos.x / zoom),
          y: Math.round(pos.y / zoom),
        });
      }

      setActionOn(false);
      setOnChange(false);
    },
    [actionOn, zoom],
  );

  const handleWheel = useCallback(() => {
    if (!gridLayerRef?.current) {
      return;
    }

    const stepSize = 8;

    const xSize = 1000 * zoom,
      ySize = 1000 * zoom,
      xSteps = Math.round(xSize / stepSize),
      ySteps = Math.round(ySize / stepSize);

    // draw vertical lines
    for (let i = 0; i <= xSteps; i++) {
      gridLayerRef.current.add(
        new Line({
          x: i * stepSize,
          points: [0, 0, 0, ySize],
          stroke: "rgba(107, 114, 122, 0.1)",
          strokeWidth: 1,
        }),
      );
    }
    //draw Horizontal lines
    for (let i = 0; i <= ySteps; i++) {
      gridLayerRef.current.add(
        new Line({
          y: i * stepSize,
          points: [0, 0, xSize, 0],
          stroke: "rgba(107, 114, 122, 0.1)",
          strokeWidth: 1,
        }),
      );
    }

    // // Draw a border around the viewport
    // gridLayerRef.current.add(
    //   new Konva.Rect({
    //     x: viewRect.x1 + 2,
    //     y: viewRect.y1 + 2,
    //     width: viewRect.x2 - viewRect.x1 - 4,
    //     height: viewRect.y2 - viewRect.y1 - 4,
    //     strokeWidth: 4,
    //     stroke: "red",
    //   }),
    // );

    gridLayerRef.current.batchDraw();
  }, [zoom]);

  useEffect(() => {
    if (startPos && endPos && setRect && onChange) {
      setRect({
        x: Math.min(startPos.x, endPos.x),
        y: Math.min(startPos.y, endPos.y),
        width: Math.abs(startPos.x - endPos.x) + 1,
        height: Math.abs(startPos.y - endPos.y) + 1,
      });
    }
  }, [startPos, endPos, setRect, onChange]);

  useEffect(() => {
    if (!onChange && rect) {
      if (
        rect.x == startPos?.x &&
        rect.y == startPos?.y &&
        rect.x + rect.width - 1 == endPos?.x &&
        rect.y + rect.height - 1 == endPos?.y
      ) {
        return;
      }
      setStartPos({
        x: rect.x,
        y: rect.y,
      });
      setEndPos({
        x: rect.x + rect.width - 1,
        y: rect.y + rect.height - 1,
      });
    }
  }, [onChange, endPos, rect, startPos]);

  useEffect(() => {
    if (rect) {
      // we need to attach transformer manually
      trRef.current.nodes([itemRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [rect]);

  useEffect(() => {
    getMapImage().then((res) => setMapImageUrl(res));
  }, []);

  useEffect(() => {
    handleWheel();
  }, [handleWheel]);

  return (
    <>
      <div className="absolute bottom-4 right-4 z-10">
        <Button.Group outline>
          <Button
            type="button"
            disabled={zoom > 8}
            onClick={() => setZoom(zoom * 1.2)}
            color="dark"
          >
            <RiZoomInFill className="h-5 w-5" />
          </Button>
          <Button
            type="button"
            disabled={zoom < 0.5}
            onClick={() => setZoom(zoom / 1.2)}
            color="dark"
          >
            <RiZoomOutFill className="h-5 w-5" />
          </Button>
          <Button
            type="button"
            onClick={() => setZoom(1)}
            disabled={zoom == 1}
            color="dark"
          >
            <MdOutlineZoomInMap className="h-5 w-5" />
          </Button>
        </Button.Group>
      </div>
      <Stage
        width={1000 * zoom}
        height={1000 * zoom}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        scaleX={zoom}
        scaleY={zoom}
        ref={boardRef}
      >
        <Layer>
          <Image
            x={0}
            y={0}
            width={1000}
            height={1000}
            image={mapImage}
            alt="Map Image"
            fill="#e2e2e210"
            draggable={false}
            listening={false}
          />
          {rect && setRect && (
            <>
              <Image
                x={rect.x}
                y={rect.y}
                width={rect.width}
                height={rect.height}
                image={itemImage}
                alt="Item Image"
                stroke="white"
                strokeEnabled={true}
                strokeWidth={1}
                draggable
                onDragEnd={(e) => {
                  setRect({
                    x: Math.round(e.target.x()),
                    y: Math.round(e.target.y()),
                    width: rect.width,
                    height: rect.height,
                  });
                }}
                onTransformEnd={() => {
                  // transformer is changing scale of the node
                  // and NOT its width or height
                  // but in the store we have only width and height
                  // to match the data better we will reset scale on transform end
                  const node = itemRef.current;
                  const scaleX = node.scaleX();
                  const scaleY = node.scaleY();

                  // we will reset it back
                  node.scaleX(1);
                  node.scaleY(1);
                  setRect({
                    x: Math.round(node.x()),
                    y: Math.round(node.y()),
                    // set minimal value
                    width: Math.max(5, Math.round(node.width() * scaleX)),
                    height: Math.max(5, Math.round(node.height() * scaleY)),
                  });
                }}
                onMouseEnter={(e) => {
                  // style stage container:
                  const container = e.target.getStage()!.container();
                  container.style.cursor = "pointer";
                }}
                onMouseLeave={(e) => {
                  const container = e.target.getStage()!.container();
                  container.style.cursor = "default";
                }}
                ref={itemRef}
              />
              <Transformer
                ref={trRef}
                // flipEnabled={false}
                rotateEnabled={false}
                boundBoxFunc={(oldBox, newBox) => {
                  // limit resize
                  if (
                    Math.abs(newBox.width) < 5 ||
                    Math.abs(newBox.height) < 5
                  ) {
                    return oldBox;
                  }
                  return newBox;
                }}
              />
            </>
          )}
        </Layer>
        <Layer ref={gridLayerRef} />
      </Stage>
    </>
  );
};

export default MapBoard;
