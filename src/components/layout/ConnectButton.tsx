"use client";

import { useConnect } from "@/contexts/WalletConnectProvider";
import { parseIpfsUrl, shortenString } from "@/helpers";
import { getUser } from "@/helpers/api/user";
import { emojiAvatarForAddress } from "@/helpers/emojiAvatarForAddress";
import { Avatar, Dropdown } from "flowbite-react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { FaCopy, FaEdit, FaSignOutAlt, FaUser } from "react-icons/fa";

const ConnectButton = () => {
  const { address, openModal, disconnectWallet } = useConnect();
  const [user, setUser] = useState<User>();

  const defaultAvatar = useMemo(
    () =>
      address?.ordinals ? emojiAvatarForAddress(address.ordinals) : undefined,
    [address?.ordinals],
  );

  useEffect(() => {
    if (!address?.ordinals) {
      return;
    }

    try {
      getUser(address.ordinals).then((data) => setUser(data.user));
    } catch (err: any) {
      console.log(err);
      toast.error(err?.reason ?? "Something went wrong on server side");
    }
  }, [address?.ordinals]);

  return (
    <div>
      {(() => {
        if (!address?.ordinals) {
          return (
            <button
              className="mr-1 flex items-center rounded-xl bg-[#00000040] px-4 py-3 text-sm text-black hover:bg-[#00000080] dark:text-slate-200"
              onClick={() => openModal()}
            >
              Connect Wallet
            </button>
          );
        }

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
                    {shortenString(address?.ordinals)}
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
              <Dropdown.Item icon={FaSignOutAlt} onClick={disconnectWallet}>
                Disconnect
              </Dropdown.Item>
            </Dropdown>
          </div>
        );
      })()}
    </div>
  );
};

export default ConnectButton;
