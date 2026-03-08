import api from "./api";

export const getMaterials = async () => {
  const response = await api.get("/material");
  return response.data;
};

export const uploadMaterial = async (formData: FormData) => {
  const response = await api.post("/upload/material", formData);
  return response.data;
};