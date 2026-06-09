import { apiClient } from "./client";

export const authApi = {
  async register(data: any) {
    const res = await apiClient.post("/auth/register", data);
    return res.data;
  },

  async login(credentials: any) {
    const res = await apiClient.post("/auth/login", credentials);
    return res.data;
  },

  async logout(refreshToken: string) {
    const res = await apiClient.post("/auth/logout", { refreshToken });
    return res.data;
  },

  async changePassword(data: any) {
    const res = await apiClient.put("/auth/change-password", data);
    return res.data;
  },
};
