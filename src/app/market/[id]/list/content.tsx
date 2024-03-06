/* eslint-disable jsx-a11y/label-has-associated-control */
"use client";

import { ListForm } from "@/components/partial/market/list";
import { parseIpfsUrl } from "@/helpers";
import { getPixelDetail } from "@/helpers/api";
// import { dynamicBlurDataUrl } from "@/helpers/image";
import { Spinner } from "flowbite-react";
import { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FaChevronLeft } from "react-icons/fa6";

const TokenListContent: NextPage = () => {
  const { id } = useParams();
  const [pixel, setPixel] = useState<Pixel>();
  // const [blurDataURL, setBlurDataURL] = useState<string>();

  useEffect(() => {
    setPixel(undefined);
    if (!id) {
      return;
    }

    getPixelDetail(id as string).then(setPixel);
  }, [id]);

  // useEffect(() => {
  //   if (pixel?.image) {
  //     dynamicBlurDataUrl(pixel.image).then(setBlurDataURL);
  //   }
  // }, [pixel?.image]);

  return (
    <div className="mx-auto flex h-full w-full max-w-5xl flex-row">
      <div className="flex h-fit w-full justify-center gap-20">
        <div className="w-3/5 max-w-lg">
          <div className="my-10 flex items-center">
            <Link href={`/market/${pixel?.id}`}>
              <div className="mr-5 flex items-center">
                <FaChevronLeft className="h-5 w-5" />
              </div>
            </Link>
            <h1 className="text-3xl font-semibold">List for sale</h1>
          </div>
          {pixel && <ListForm pixel={pixel} />}
        </div>
        <div className="flex w-max flex-col">
          <div className="sticky top-28">
            <div className="mb-10">
              <article className="z-10 flex w-96 flex-col overflow-hidden rounded-xl">
                <div className="relative h-96 w-96">
                  <div className="relative flex h-full min-h-[inherit] w-full flex-col items-center justify-center rounded-[inherit]">
                    {pixel?.image ? (
                      <Image
                        layout="fill"
                        src={parseIpfsUrl(pixel.image)}
                        alt="Asset Image"
                        // blurDataURL={blurDataURL}
                      />
                    ) : (
                      <Spinner size="md" />
                    )}
                  </div>
                </div>
                <h5 className="mt-5 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {pixel?.name ?? "--"}
                </h5>
                <h5 className="mt-3 text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
                  {pixel
                    ? `(${pixel.left}, ${pixel.top}, ${pixel.right}, ${pixel.bottom})`
                    : "--"}
                </h5>
              </article>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenListContent;
