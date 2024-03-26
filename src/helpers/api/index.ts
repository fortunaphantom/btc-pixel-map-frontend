import axios from "../axios";

export const getMapImage = async () => {
  const { data } = await axios.get("/pixel/map");
  return data;
};

export const getPixels = async (offset: number = 0, limit: number = 100) => {
  const { data } = await axios.get("/pixel", {
    params: {
      offset,
      limit,
    },
  });

  return data;
};

export const getPixelDetail = async (id: string) => {
  const { data } = await axios.get(`/pixel/detail/${id}`);

  return data;
};

export const reportView = async (id: string | number, actor: string) => {
  const { data } = await axios.post(`/pixel/view?id=${id}&actor=${actor}`);

  return data;
};

export const searchPixel = async (
  offset: number,
  payload: any,
  owner?: string,
) => {
  const { data } = await axios.post(
    `/pixel/search?offset=${offset}` + (owner ? `&owner=${owner}` : ""),
    payload,
  );

  return data;
};

export const getHistory = async (
  type: string[],
  offset: number,
  address?: string,
  id?: number | string,
) => {
  const { data } = await axios.get("/pixel/history", {
    params: {
      type,
      offset,
      address,
      id,
    },
  });

  return data;
};
