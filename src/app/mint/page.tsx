import dynamic from "next/dynamic";

const MintPageContent = dynamic(() => import("./content"), {
  ssr: false,
});

export default function MintPage() {
  return <MintPageContent />;
}
