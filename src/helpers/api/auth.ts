import axios from "../axios";

export const getChallenge = async (address: string) => {
  const { data } = await axios.get(`/auth/challenge?address=${address}`);
  return data;
};

export const signIn = async (
  ordinals: string,
  payments: string,
  challenge: string,
  signature: string,
) => {
  const { data } = await axios.post("/auth/sign", {
    ordinals,
    payments,
    challenge,
    signature,
  });

  return data;
};
