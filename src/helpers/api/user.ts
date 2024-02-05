import axios from "../axios";

export const getUser = async (address: string) => {
  const { data } = await axios.get(`/user/${address}`);
  return data;
};
