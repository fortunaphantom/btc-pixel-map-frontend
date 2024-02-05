import dynamic from "next/dynamic";

const TokenDetailContent = dynamic(() => import("./content"), {
  ssr: false,
});

export default function TokenDetailPage() {
  return <TokenDetailContent />;
}
