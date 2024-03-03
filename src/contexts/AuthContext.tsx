"use client";

import { BACKEND_URL } from "@/config";
import { getChallenge, signIn } from "@/helpers/api/auth";
import { isBrowser } from "@/helpers/is-browser";
import { useSignMessage } from "@/hooks";
import axios, { AxiosInstance } from "axios";
import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import toast from "react-hot-toast";
import { useConnect } from "./WalletConnectProvider";

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
  const { address } = useConnect();
  const { signMsg } = useSignMessage();

  const storedAccessToken = isBrowser()
    ? localStorage.getItem("access-token")
    : "";

  const [authorized, setAuthorized] = useState<boolean>(
    !!storedAccessToken?.length,
  );
  const [accessToken, setAccessToken] = useState<string>(
    storedAccessToken ?? "",
  );

  const refreshToken = useCallback(async () => {
    if (!address?.ordinals) {
      setAuthorized(false);
      setAccessToken("");
      return;
    }

    try {
      const challenge = await getChallenge(address.ordinals);
      const signature = await signMsg(address.ordinals, challenge);
      console.log(signature);
      const data = await signIn(
        address.ordinals,
        challenge,
        signature as string,
      );

      const accessToken = `Bearer ${data?.accessToken}`;
      setAuthorized(true);
      setAccessToken(accessToken);

      return accessToken;
    } catch (err: any) {
      console.log(err);
      toast.error(err?.message ?? err?.response?.reason);
    }
  }, [address?.ordinals, signMsg]);

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
          const accessToken = await refreshToken();
          error.config.headers["authorization"] = accessToken;

          return axios.request(error.config);
        } else {
          throw error;
        }
      },
    );

    return instance;
  }, [accessToken, refreshToken]);

  useEffect(() => {
    if (!address?.ordinals) {
      return;
    }
    const timer = setTimeout(async () => {
      try {
        await axiosInstance.post(`/auth/check/${address.ordinals}`);
      } catch (err) {
        console.log(err);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [axiosInstance, address.ordinals]);

  useEffect(() => {
    if (accessToken?.length) {
      localStorage.setItem("access-token", accessToken);
    }
  }, [accessToken]);

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
