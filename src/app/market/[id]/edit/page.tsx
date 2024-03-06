import dynamic from "next/dynamic";

const EditContent = dynamic(() => import("./content"), {
  ssr: false,
});

export default function EditPage() {
  return <EditContent />;
}
