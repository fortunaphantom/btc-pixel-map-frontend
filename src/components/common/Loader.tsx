import { Spinner } from "flowbite-react";

export const Loader = () => {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <Spinner color="success" aria-label="spinner example" />
    </div>
  );
};
