import dynamic from "next/dynamic";

const AuctionListContent = dynamic(() => import("./content"), {
  ssr: false,
});

export default function AuctionDetailPage() {
  return <AuctionListContent />;
}
