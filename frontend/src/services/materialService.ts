import api from "./api";
import type { Material } from "../utils/types/material";

export const getMaterials = async (filters?: any): Promise<Material[]> => {
  const response = await api.get("/material", {
    params: filters,
  });

  return response.data;
};

export const uploadMaterial = async (formData: FormData) => {
  const response = await api.post("/upload/material", formData);
  return response.data;
};