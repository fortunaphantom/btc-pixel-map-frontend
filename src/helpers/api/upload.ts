import axios from "../axios";

export const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await axios.post("/upload/file", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};
