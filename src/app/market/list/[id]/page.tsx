import dynamic from "next/dynamic";

const TokenListContent = dynamic(() => import("./content"), {
  ssr: false,
});

export default function TokenDetailPage() {
  return <TokenListContent />;
}
