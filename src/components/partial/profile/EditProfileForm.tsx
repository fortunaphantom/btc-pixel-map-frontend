import ImageInput from "@/components/common/ImageInput";
import ConfirmModal from "@/components/modal/ConfirmModal";
import { useAuthContext } from "@/contexts/AuthContext";
import { uploadFile } from "@/helpers/api/upload";
import { getUser } from "@/helpers/api/user";
import { Button, Label, TextInput } from "flowbite-react";
import { useRouter } from "next/navigation";
import { FC, useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

const confirmSteps: ConfirmStep[] = [
  {
    title: "Upload images",
    description: "You will have to wait while the image uploads.",
  },
  {
    title: "Update profile",
    description: "You have to wait while update profile",
  },
];

const EditProfileForm: FC = () => {
  const router = useRouter();
  const { axios } = useAuthContext();
  const [user, setUser] = useState<User>();

  const [name, setName] = useState<string>();
  const [bio, setBio] = useState<string>();
  const [banner, setBanner] = useState<File | string>();
  const [thumbnail, setThumbnail] = useState<File | string>();

  // confirm modal
  const [confirmOpen, setConfirmOpen] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [errorStep, setErrorStep] = useState<number>();
  const [errorMessage, setErrorMessage] = useState<string>();

  const handleUpdate = useCallback(async () => {
    setConfirmOpen(true);
    setErrorStep(undefined);
    setErrorMessage(undefined);
    setActiveStep(0);

    let bannerUri, thumbnailUri;
    try {
      if (banner instanceof File) {
        bannerUri = await uploadFile(banner);
      } else {
        bannerUri = banner;
      }
      if (thumbnail instanceof File) {
        thumbnailUri = await uploadFile(thumbnail);
      } else {
        thumbnailUri = thumbnail;
      }
    } catch (error: unknown) {
      console.log(error);
      setErrorStep(0);
      setErrorMessage(
        (error as any).response?.data?.reason ??
          "Something went wrong on server side.",
      );
      return undefined;
    }

    setActiveStep(1);
    try {
      const payload = {
        banner: bannerUri,
        thumbnail: thumbnailUri,
        name: name,
        bio: bio,
      };
      await axios.patch(
        `/user/${
          ""
          // address
        }`,
        payload,
      );
    } catch (error: unknown) {
      console.log(error);
      setErrorStep(1);
      setErrorMessage(
        (error as any).response?.data?.reason ??
          "Something went wrong on server side.",
      );
      return undefined;
    }
    setActiveStep(2);
  }, [
    // address,
    axios,
    banner,
    bio,
    name,
    thumbnail,
  ]);

  useEffect(
    () => {
      // if (!address) {
      //   return;
      // }

      try {
        getUser(
          // address
          "",
        ).then((data) => setUser(data.user));
      } catch (err: any) {
        console.log(err);
        toast.error(err?.reason ?? "Something went wrong on server side");
      }
    },
    [
      // address
    ],
  );

  useEffect(() => {
    if (user?.name) {
      setName(user.name);
    }
    if (user?.bio) {
      setBio(user.bio);
    }
    if (user?.banner) {
      setBanner(user.banner);
    }
    if (user?.thumbnail) {
      setThumbnail(user.thumbnail);
    }
  }, [user]);

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleUpdate();
      }}
    >
      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="mb-2 block">
            <Label htmlFor="banner">Profile Banner</Label>
          </div>
          <div className="relative grid grid-cols-[1fr_auto] gap-1">
            <ImageInput title="banner" value={banner} setValue={setBanner} />
          </div>
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="thumbnail">Profile Thumbnail</Label>
          </div>
          <div className="relative grid grid-cols-[1fr_auto] gap-1">
            <ImageInput
              title="thumbnail"
              value={thumbnail}
              setValue={setThumbnail}
            />
          </div>
        </div>
      </div>
      <hr className="mt-1 w-full border-gray-200 dark:border-gray-700 sm:mx-auto lg:mt-2"></hr>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="name">Name</Label>
        </div>
        <TextInput
          id="name"
          type="text"
          placeholder="Put profile name here..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="bio">Bio</Label>
        </div>
        <TextInput
          id="bio"
          type="text"
          placeholder="Put profile bio here..."
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          required
        />
      </div>
      <hr className="mt-1 w-full border-gray-200 dark:border-gray-700 sm:mx-auto lg:mt-2"></hr>
      <Button type="submit" size="lg">
        Update
      </Button>
      <ConfirmModal
        isOpen={confirmOpen}
        setOpen={setConfirmOpen}
        title="Update Profile"
        steps={confirmSteps}
        activeStep={activeStep}
        errorStep={errorStep}
        errorMessage={errorMessage}
        handleRetry={() => handleUpdate()}
        handleContinue={() => router.push("/profile")}
        successMessage="Profile updated successfully"
      />
    </form>
  );
};

export default EditProfileForm;
