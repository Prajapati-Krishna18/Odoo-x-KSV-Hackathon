import { apiClient } from "./client";

export const analyticsApi = {
  async getDashboard() {
    const res = await apiClient.get("/analytics/dashboard");
    return res.data;
  },

  async getSpending() {
    const res = await apiClient.get("/analytics/spending");
    return res.data;
  },

  async getVendorPerformance() {
    const res = await apiClient.get("/analytics/vendor-performance");
    return res.data;
  },

  async getProcurementHealth() {
    const res = await apiClient.get("/analytics/procurement-health");
    return res.data;
  },

  async getCostSavings() {
    const res = await apiClient.get("/analytics/cost-savings");
    return res.data;
  },
};
