import { apiClient } from "./client";

export const invoicesApi = {
  async list(params?: any) {
    const res = await apiClient.get("/invoices", { params });
    return res.data;
  },

  async getById(id: string) {
    const res = await apiClient.get(`/invoices/${id}`);
    return res.data;
  },

  async create(data: any) {
    const res = await apiClient.post("/invoices", data);
    return res.data;
  },

  async update(id: string, data: any) {
    const res = await apiClient.put(`/invoices/${id}`, data);
    return res.data;
  },

  async verify(id: string) {
    const res = await apiClient.patch(`/invoices/${id}/verify`);
    return res.data;
  },

  async downloadPdf(id: string) {
    const res = await apiClient.get(`/invoices/${id}/pdf`, { responseType: "blob" });
    return res.data;
  },

  async send(id: string) {
    const res = await apiClient.post(`/invoices/${id}/send`);
    return res.data;
  },
};
