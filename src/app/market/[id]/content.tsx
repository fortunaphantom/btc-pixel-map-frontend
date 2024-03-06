"use client";

import { Loader } from "@/components/common/Loader";
import {
  ItemActions,
  ItemActivity,
  ItemCounts,
  ItemDetails,
  ItemHeader,
  ItemOffers,
  ItemSummery,
} from "@/components/partial/market/detail";
import { useConnect } from "@/contexts/WalletConnectProvider";
import { getPixelDetail, reportView } from "@/helpers/api";
import { NextPage } from "next";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const TokenDetailContent: NextPage = () => {
  const { id } = useParams();
  const { address } = useConnect();
  const [pixel, setPixel] = useState<Pixel>();

  const refreshPixel = useCallback(async () => {
    getPixelDetail(id as string).then(setPixel);
  }, [id]);

  useEffect(() => {
    setPixel(undefined);
    if (!id) {
      return;
    }

    getPixelDetail(id as string).then(setPixel);
  }, [id]);

  useEffect(() => {
    if (!pixel || !address.ordinals) {
      return;
    }
    reportView(pixel.id, address.ordinals);
  }, [address.ordinals, pixel]);

  return (
    <div className="mx-auto flex h-full min-h-fit w-full max-w-screen-2xl flex-row">
      {pixel ? (
        <div className="grid h-full w-full grid-cols-10 pt-5">
          <div className="relative col-span-4 p-2">
            <ItemSummery pixel={pixel} refreshPixel={refreshPixel} />
            <ItemDetails pixel={pixel} />
          </div>
          <div className="col-span-6 flex flex-col">
            <ItemHeader pixel={pixel} />
            <ItemCounts pixel={pixel} />
            <ItemActions pixel={pixel} />
            <ItemOffers pixel={pixel} />
          </div>
          <div className="col-span-full">
            <ItemActivity pixel={pixel} />
          </div>
        </div>
      ) : (
        <Loader />
      )}
    </div>
  );
};

export default TokenDetailContent;
