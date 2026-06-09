import { apiClient } from "./client";

export const vendorsApi = {
  async list(params?: any) {
    const res = await apiClient.get("/vendors", { params });
    return res.data;
  },

  async getById(id: string) {
    const res = await apiClient.get(`/vendors/${id}`);
    return res.data;
  },

  async create(data: any) {
    const res = await apiClient.post("/vendors", data);
    return res.data;
  },

  async update(id: string, data: any) {
    const res = await apiClient.put(`/vendors/${id}`, data);
    return res.data;
  },

  async remove(id: string) {
    const res = await apiClient.delete(`/vendors/${id}`);
    return res.data;
  },

  async updateStatus(id: string, status: string) {
    const res = await apiClient.patch(`/vendors/${id}/status`, { status });
    return res.data;
  },

  async rate(id: string, ratingData: any) {
    const res = await apiClient.post(`/vendors/${id}/rate`, ratingData);
    return res.data;
  },

  async getPerformance(id: string) {
    const res = await apiClient.get(`/vendors/${id}/performance`);
    return res.data;
  },
};
