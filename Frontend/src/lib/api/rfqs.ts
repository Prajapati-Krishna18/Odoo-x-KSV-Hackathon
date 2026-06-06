import { apiClient } from "./client";

export const rfqsApi = {
  async list(params?: any) {
    const res = await apiClient.get("/rfqs", { params });
    return res.data;
  },

  async getById(id: string) {
    const res = await apiClient.get(`/rfqs/${id}`);
    return res.data;
  },

  async create(data: any) {
    const res = await apiClient.post("/rfqs", data);
    return res.data;
  },

  async update(id: string, data: any) {
    const res = await apiClient.put(`/rfqs/${id}`, data);
    return res.data;
  },

  async remove(id: string) {
    const res = await apiClient.delete(`/rfqs/${id}`);
    return res.data;
  },

  async getCompare(id: string) {
    const res = await apiClient.get(`/rfqs/${id}/compare`);
    return res.data;
  },

  async publish(id: string) {
    const res = await apiClient.patch(`/rfqs/${id}/publish`);
    return res.data;
  },

  async close(id: string) {
    const res = await apiClient.patch(`/rfqs/${id}/close`);
    return res.data;
  },

  async inviteVendors(id: string, vendorIds: string[]) {
    const res = await apiClient.post(`/rfqs/${id}/vendors`, { vendorIds });
    return res.data;
  },

  async addAttachment(id: string, file: File) {
    const formData = new FormData();
    formData.append("file", file);
    const res = await apiClient.post(`/rfqs/${id}/attachments`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  async removeAttachment(id: string, aid: string) {
    const res = await apiClient.delete(`/rfqs/${id}/attachments/${aid}`);
    return res.data;
  },
};
