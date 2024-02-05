import { parseIpfsUrl, shortenString } from "@/helpers";
import { getUser } from "@/helpers/api/user";
import { emojiAvatarForAddress } from "@/helpers/emojiAvatarForAddress";
import { ConnectMultiButton, useWalletAddress } from "bitcoin-wallet-adapter";
import { Avatar, Dropdown } from "flowbite-react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { FaCopy, FaEdit, FaSignOutAlt, FaUser } from "react-icons/fa";

const CustomConnectButton = () => {
  const walletDetails = useWalletAddress();
  const [user, setUser] = useState<User>();

  const defaultAvatar = useMemo(
    () =>
      walletDetails?.cardinal_address
        ? emojiAvatarForAddress(walletDetails.cardinal_address)
        : undefined,
    [walletDetails?.cardinal_address],
  );

  useEffect(() => {
    if (!walletDetails?.cardinal_address) {
      return;
    }

    try {
      getUser(walletDetails.cardinal_address).then((data) =>
        setUser(data.user),
      );
    } catch (err: any) {
      console.log(err);
      toast.error(err?.reason ?? "Something went wrong on server side");
    }
  }, [walletDetails?.cardinal_address]);

  return (
    <div
      {...(!walletDetails && {
        "aria-hidden": true,
        style: {
          opacity: 0,
          pointerEvents: "none",
          userSelect: "none",
        },
      })}
    >
      {(() => {
        return (
          <ConnectMultiButton
            walletImageClass="w-[60px]"
            walletLabelClass="pl-3 font-bold text-xl"
            walletItemClass="border w-full md:w-6/12 cursor-pointer border-transparent rounded-xl mb-4 hover:border-green-500 transition-all"
            headingClass="text-green-700 text-4xl pb-12 font-bold text-center"
            buttonClassname="bg-green-300 hover:bg-green-400 rounded-xl flex items-center text-green-800 px-4 py-1 font-bold"
          />
        );

        return (
          <div className="text-black dark:text-slate-200">
            <Dropdown
              inline
              label={
                user?.thumbnail ? (
                  <Avatar
                    alt="User settings"
                    img={parseIpfsUrl(user?.thumbnail)}
                    rounded
                  />
                ) : (
                  <Avatar rounded placeholderInitials={defaultAvatar?.emoji} />
                )
              }
            >
              <Dropdown.Header>
                <span className="block text-sm">{user?.name ?? "Unknown"}</span>
                <span className="block truncate text-sm font-medium">
                  <div className="inline-flex items-center gap-2">
                    {shortenString(walletDetails?.cardinal_address)}
                    <button type="button">
                      <FaCopy className="h-4 w-4" />
                    </button>
                  </div>
                </span>
              </Dropdown.Header>
              <Dropdown.Item icon={FaUser} href={`/profile`}>
                Profile
              </Dropdown.Item>
              <Dropdown.Item icon={FaEdit} href={`/profile/edit`}>
                Edit Profile
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item
                icon={FaSignOutAlt}
                // onClick={() => disconnect()}
              >
                Disconnect
              </Dropdown.Item>
            </Dropdown>
          </div>
        );
      })()}
    </div>
  );
};

export default CustomConnectButton;
