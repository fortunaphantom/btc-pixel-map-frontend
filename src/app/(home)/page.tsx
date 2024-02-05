import dynamic from "next/dynamic";

const HomeContent = dynamic(() => import("./content"), {
  ssr: false,
});

export default function HomePage() {
  return <HomeContent />;
}
