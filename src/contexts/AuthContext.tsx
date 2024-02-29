"use client";

import { BACKEND_URL } from "@/config";
import { isBrowser } from "@/helpers/is-browser";
import axios, { AxiosInstance } from "axios";
import {
  PropsWithChildren,
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";

type AuthContextType = {
  axios: AxiosInstance;
  authorized: boolean;
  accessToken: string;
};

export const AuthContext = createContext<AuthContextType>({
  axios: axios.create({
    baseURL: BACKEND_URL,
    headers: {
      "Content-Type": "application/json",
    },
  }),
  authorized: false,
  accessToken: "",
});

const AuthContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
  // const { address, isConnected } = useAccount();

  const storedAccessToken = isBrowser()
    ? localStorage.getItem("access-token")
    : "";

  const [
    authorized,
    // setAuthorized
  ] = useState<boolean>(!!storedAccessToken?.length);
  const [
    accessToken,
    // setAccessToken
  ] = useState<string>(storedAccessToken ?? "");

  // const { signMessageAsync } = useSignMessage({
  //   onError(error: Error) {
  //     console.log(error);
  //   },
  // });

  // const refreshToken = useCallback(async () => {
  //   if (!address || !isConnected) {
  //     setAuthorized(false);
  //     setAccessToken("");
  //     return;
  //   }

  //   try {
  //     const challenge = await getChallenge(address);
  //     const signature = await signMessageAsync({ message: challenge });
  //     const data = await signIn(address, challenge, signature);

  //     const accessToken = `Bearer ${data?.accessToken}`;
  //     setAuthorized(true);
  //     setAccessToken(accessToken);

  //     return accessToken;
  //   } catch (err: any) {
  //     console.log(err);
  //     toast.error(err?.shortMessage ?? err?.response?.reason);
  //   }
  // }, [address, isConnected, signMessageAsync]);

  const axiosInstance = useMemo(() => {
    const instance = axios.create({
      baseURL: BACKEND_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    instance.interceptors.request.use((config) => {
      if (typeof window != "undefined") {
        config.headers["authorization"] = accessToken;
      }

      return config;
    });

    instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        console.log(error);
        if (error?.response?.status == 401) {
          console.log("refresh access token and retry");
          // const accessToken = await refreshToken();
          // error.config.headers["authorization"] = accessToken;

          return axios.request(error.config);
        } else {
          throw error;
        }
      },
    );

    return instance;
  }, [accessToken]);

  // useEffect(() => {
  //   const timer = setTimeout(async () => {
  //     try {
  //       await axiosInstance.post(`/auth/check/${address}`);
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   }, 1000);

  //   return () => clearTimeout(timer);
  // }, [axiosInstance, address]);

  // useEffect(() => {
  //   if (accessToken?.length) {
  //     localStorage.setItem("access-token", accessToken);
  //   }
  // }, [accessToken, address]);

  return (
    <AuthContext.Provider
      value={{ axios: axiosInstance, authorized, accessToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;

export function useAuthContext(): AuthContextType {
  const context = useContext(AuthContext);

  if (typeof context === "undefined") {
    throw new Error(
      "usePixelDataContext should be used within the AuthContext provider!",
    );
  }

  return context;
}
