import axios from "../axios";

export const orderPixel = async (
  payload: OrderCreateData,
  prevOrder?: string,
) => {
  const { data } = await axios.post(
    "/pixel/order" + (prevOrder ? `?prev=${prevOrder}` : ""),
    payload,
  );
  return data;
};

export const getAuctionDetail = async (id: string) => {
  const { data } = await axios.get(`/pixel/auction/${id}`);
  return data;
};

export const getOrderDetail = async (id: string) => {
  const { data } = await axios.get(`/pixel/order/${id}`);
  return data;
};
