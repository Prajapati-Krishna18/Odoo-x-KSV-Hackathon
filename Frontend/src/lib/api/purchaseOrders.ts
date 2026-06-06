import { apiClient } from "./client";

export const purchaseOrdersApi = {
  async list(params?: any) {
    const res = await apiClient.get("/purchase-orders", { params });
    return res.data;
  },

  async getById(id: string) {
    const res = await apiClient.get(`/purchase-orders/${id}`);
    return res.data;
  },

  async create(data: any) {
    const res = await apiClient.post("/purchase-orders", data);
    return res.data;
  },

  async updateStatus(id: string, status: string) {
    const res = await apiClient.patch(`/purchase-orders/${id}/status`, { status });
    return res.data;
  },

  async downloadPdf(id: string) {
    const res = await apiClient.get(`/purchase-orders/${id}/pdf`, { responseType: "blob" });
    return res.data;
  },

  async sendToVendor(id: string) {
    const res = await apiClient.post(`/purchase-orders/${id}/send`);
    return res.data;
  },
};
