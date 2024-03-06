import axios from "../axios";

export const getListPsbt = async (
  id: string,
  publicKey: string,
  price: number,
) => {
  const { data } = await axios.get(`/pixel/list/psbt/${id}`, {
    params: {
      publicKey,
      price,
    },
  });

  return data;
};

export const getAuctionDetail = async (id: string) => {
  const { data } = await axios.get(`/pixel/auction/${id}`);
  return data;
};

export const getListingDetail = async (id: string) => {
  const { data } = await axios.get(`/pixel/listing/${id}`);
  return data;
};
