import dynamic from "next/dynamic";

const EditProfileContent = dynamic(() => import("./content"), {
  ssr: false,
});

export default function EditProfilePage() {
  return <EditProfileContent />;
}
