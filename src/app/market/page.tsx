import dynamic from "next/dynamic";

const MarketContent = dynamic(() => import("./content"), {
  ssr: false,
});

export default function MarketPage() {
  return <MarketContent />;
}
