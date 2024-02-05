"use client";

import UserProfile from "@/components/partial/profile";
import { NextPage } from "next";
import { useParams } from "next/navigation";

const ProfileContent: NextPage = () => {
  const { address } = useParams();

  return <UserProfile address={address as string} />;
};

export default ProfileContent;
