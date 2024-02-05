"use client";

import EditProfileForm from "@/components/partial/profile/EditProfileForm";
import { NextPage } from "next";

const EditProfileContent: NextPage = () => {
  return (
    <div className="mx-auto flex h-full w-full max-w-2xl flex-col justify-center px-4">
      <header>
        <h2 className="mb-5 mt-9 text-4xl font-bold dark:text-slate-200">
          Edit Profile
        </h2>
      </header>
      <EditProfileForm />
    </div>
  );
};

export default EditProfileContent;
