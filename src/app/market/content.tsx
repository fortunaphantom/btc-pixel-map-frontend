"use client";

import MarketActivity from "@/components/partial/market/activity";
import MarketItems from "@/components/partial/market/items";
import { Tabs } from "flowbite-react";
import { NextPage } from "next";
import { twMerge } from "tailwind-merge";

const MarketContent: NextPage = () => {
  return (
    <div className={twMerge("min-h-full p-4 transition-all duration-200")}>
      <div className="mx-auto min-h-full w-full max-w-screen-2xl">
        <Tabs aria-label="Tabs" style="underline">
          <Tabs.Item title="Items">
            <MarketItems />
          </Tabs.Item>
          <Tabs.Item title="Activity">
            <MarketActivity />
          </Tabs.Item>
        </Tabs>
      </div>
    </div>
  );
};

export default MarketContent;
