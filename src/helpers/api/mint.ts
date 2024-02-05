import axios from "../axios";

type UpdatePayload = {
  name: string;
  description: string;
  externalLink: string;
  image: string;
};

type CreatePayload = {
  x: number;
  y: number;
  width: number;
  height: number;
  owner: string;
  name: string;
  description: string;
  externalLink: string;
  image: string;
};

export const getMintSign = async (payload: CreatePayload) => {
  const { data } = await axios.post(`/pixel/create`, payload);
  return data as MintParam;
};

export const generateUpdateParams = async (
  tokenId: number | string,
  payload: UpdatePayload,
) => {
  const { data } = await axios.post(`/pixel/update/${tokenId}`, payload);
  return data as MintParam;
};
