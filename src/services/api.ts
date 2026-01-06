import axios from "axios";

const baseURL = process.env.REACT_APP_API_URL || "http://localhost:3333";

const api = axios.create({
  baseURL,
});

export interface PreferenceResponse {
  id: string;
}

export const createPreference = async (): Promise<PreferenceResponse> => {
  const response = await api.post<PreferenceResponse>("/create_preference");
  return response.data;
};

export default api;
