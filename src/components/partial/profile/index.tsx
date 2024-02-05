import { parseIpfsUrl, shortenString } from "@/helpers";
import { getUser } from "@/helpers/api/user";
import { emojiAvatarForAddress } from "@/helpers/emojiAvatarForAddress";
import { Tabs } from "flowbite-react";
import Image from "next/image";
import Link from "next/link";
import { FC, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { FaEdit } from "react-icons/fa";
import { FaArrowRightArrowLeft, FaPix } from "react-icons/fa6";
import { twMerge } from "tailwind-merge";
import UserActivity from "./UserActivity";
import UserPixels from "./UserPixels";

type Props = {
  address: string;
};

const UserProfile: FC<Props> = ({ address }) => {
  const [user, setUser] = useState<User>();
  const [totalPixels, setTotalPixels] = useState<number>();

  const defaultAvatar = useMemo(
    () => emojiAvatarForAddress(address),
    [address],
  );

  useEffect(() => {
    try {
      getUser(address).then((data) => setUser(data.user));
    } catch (err: any) {
      console.log(err);
      toast.error(err?.reason ?? "Something went wrong on server side");
    }
  }, [address]);

  return (
    <div
      className={twMerge(
        "h-full overflow-auto p-4 transition-all duration-200",
      )}
    >
      <div className="relative mb-2 flex flex-col items-center">
        <div className="relative mt-0 h-56 w-full bg-slate-100 dark:bg-slate-800">
          {user?.banner && (
            <Image
              src={parseIpfsUrl(user.banner)}
              layout="fill"
              className="h-full w-full rounded-lg object-cover"
              alt="banner"
            />
          )}
        </div>
        <div className="relative w-full overflow-visible">
          <div className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-2/3 rounded-full bg-white p-1 dark:bg-slate-900">
            <div className="relative h-full w-full">
              {user?.thumbnail ? (
                <Image
                  src={parseIpfsUrl(user.thumbnail)}
                  layout="fill"
                  className="h-full w-full rounded-full object-cover"
                  alt="thumbnail"
                />
              ) : (
                <div
                  className="flex h-full w-full items-center justify-center rounded-full text-5xl"
                  style={{ background: defaultAvatar.color }}
                >
                  {defaultAvatar.emoji}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="mt-11 flex-row">
          <div className="my-1 text-center text-2xl font-bold">
            {user?.name?.length ? user.name : shortenString(address)}
          </div>
        </div>
        {/* <LinkSet user={user} /> */}
        {user?.bio?.length && (
          <div className="mt-1 max-w-[700px] text-center text-sm font-bold text-gray-600">
            {user.bio}
          </div>
        )}
        {
          // viewer
          "0x01" == address && (
            <div className="absolute right-5 top-3 rounded-full p-2">
              <Link href={`/profile/edit`} title="Edit Pixel">
                <FaEdit className="h-4 w-4" />
              </Link>
            </div>
          )
        }
      </div>
      <div className="mx-auto flex w-full max-w-7xl flex-col">
        <Tabs aria-label="Tabs with icons" style="underline">
          <Tabs.Item title={`Pixels(${totalPixels ?? "-"})`} icon={FaPix}>
            <UserPixels address={address} setTotalPixels={setTotalPixels} />
          </Tabs.Item>
          <Tabs.Item title="Activity" icon={FaArrowRightArrowLeft}>
            <UserActivity address={address as string} />
          </Tabs.Item>
        </Tabs>
      </div>
    </div>
  );
};

export default UserProfile;
