import axios from "../axios";

type UpdatePayload = {
  name: string;
  description: string;
  externalLink: string;
  image: string;
  feeRate: number;
};

type CreatePayload = {
  x: number;
  y: number;
  width: number;
  height: number;
  name: string;
  description: string;
  externalLink: string;
  image: string;
  feeRate: number;
  receiver: string;
};

type RevealTransaction = {
  id: string;
  creator: string;
  type: "Reveal";
  checked: boolean;
};

export const getMintPsbt = async (payload: CreatePayload) => {
  const { data } = await axios.post(`/pixel/create`, payload);
  return data as MintParam;
};

export const getUpdatePsbt = async (
  id: string | number,
  payload: UpdatePayload,
) => {
  const { data } = await axios.post(`/pixel/update/${id}`, payload);
  return data as MintParam;
};

export const getRevealState = async (account: string) => {
  const { data } = await axios.get(`/pixel/watch?account=${account}`);
  return data as RevealTransaction;
};
