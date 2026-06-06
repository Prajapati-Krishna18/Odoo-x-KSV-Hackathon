// ============================================
// Analytics Module — Hackathon-Winning KPIs
// ============================================
// This is where VendorBridge differentiates from a CRUD app.
// Real-time procurement analytics, vendor performance rankings,
// procurement health score, and cost savings tracking.
// ============================================

const prisma = require('../../config/database');
const CacheService = require('../../services/cache.service');
const ApprovalsRepository = require('../approvals/approvals.repository');

class AnalyticsService {
  // ──────────── Dashboard Summary ────────────
  static async getDashboard() {
    const cacheKey = 'analytics:dashboard';
    const cached = await CacheService.get(cacheKey);
    if (cached) return cached;

    const [
      totalVendors,
      activeVendors,
      totalRfqs,
      openRfqs,
      totalPOs,
      totalInvoices,
      poSpend,
      pendingApprovals,
    ] = await Promise.all([
      prisma.vendor.count({ where: { deletedAt: null } }),
      prisma.vendor.count({ where: { status: 'ACTIVE', deletedAt: null } }),
      prisma.rfq.count({ where: { deletedAt: null } }),
      prisma.rfq.count({ where: { status: { in: ['DRAFT', 'PUBLISHED'] }, deletedAt: null } }),
      prisma.purchaseOrder.count({ where: { deletedAt: null } }),
      prisma.invoice.count({ where: { deletedAt: null } }),
      prisma.purchaseOrder.aggregate({
        where: { status: { in: ['APPROVED', 'SENT', 'ACKNOWLEDGED', 'COMPLETED'] }, deletedAt: null },
        _sum: { totalAmount: true },
      }),
      prisma.approval.count({ where: { status: { in: ['PENDING', 'IN_PROGRESS'] } } }),
    ]);

    const dashboard = {
      vendors: { total: totalVendors, active: activeVendors },
      rfqs: { total: totalRfqs, open: openRfqs },
      purchaseOrders: { total: totalPOs, totalSpend: poSpend._sum.totalAmount || 0 },
      invoices: { total: totalInvoices },
      pendingApprovals,
      generatedAt: new Date().toISOString(),
    };

    await CacheService.set(cacheKey, dashboard, 300); // 5 min cache
    return dashboard;
  }

  // ──────────── Spending Analytics ────────────
  static async getSpending(query) {
    const byVendor = await prisma.purchaseOrder.groupBy({
      by: ['vendorId'],
      where: { deletedAt: null, status: { in: ['APPROVED', 'SENT', 'ACKNOWLEDGED', 'COMPLETED'] } },
      _sum: { totalAmount: true },
      _count: true,
      orderBy: { _sum: { totalAmount: 'desc' } },
      take: 10,
    });

    // Enrich with vendor names
    const vendorIds = byVendor.map((v) => v.vendorId);
    const vendors = await prisma.vendor.findMany({
      where: { id: { in: vendorIds } },
      select: { id: true, companyName: true },
    });
    const vendorMap = Object.fromEntries(vendors.map((v) => [v.id, v.companyName]));

    const spendingByVendor = byVendor.map((v) => ({
      vendorId: v.vendorId,
      vendorName: vendorMap[v.vendorId] || 'Unknown',
      totalSpend: v._sum.totalAmount || 0,
      orderCount: v._count,
    }));

    // Monthly spending trend
    const monthlySpend = await prisma.$queryRaw`
      SELECT 
        TO_CHAR(created_at, 'YYYY-MM') as month,
        SUM(total_amount) as total,
        COUNT(*) as count
      FROM purchase_orders
      WHERE deleted_at IS NULL 
        AND status IN ('APPROVED', 'SENT', 'ACKNOWLEDGED', 'COMPLETED')
      GROUP BY TO_CHAR(created_at, 'YYYY-MM')
      ORDER BY month DESC
      LIMIT 12
    `;

    return { spendingByVendor, monthlySpend };
  }

  // ──────────── Vendor Performance Rankings ────────────
  static async getVendorPerformance() {
    const vendors = await prisma.vendor.findMany({
      where: { deletedAt: null, totalOrders: { gt: 0 } },
      select: {
        id: true, companyName: true, trustScore: true,
        totalOrders: true, successfulOrders: true,
        ratings: {
          select: { qualityScore: true, deliveryScore: true, priceScore: true, responsivenessScore: true },
        },
      },
      orderBy: { trustScore: 'desc' },
      take: 20,
    });

    return vendors.map((v) => {
      const avgRatings = v.ratings.length > 0 ? {
        quality: (v.ratings.reduce((sum, r) => sum + r.qualityScore, 0) / v.ratings.length).toFixed(1),
        delivery: (v.ratings.reduce((sum, r) => sum + r.deliveryScore, 0) / v.ratings.length).toFixed(1),
        price: (v.ratings.reduce((sum, r) => sum + r.priceScore, 0) / v.ratings.length).toFixed(1),
        responsiveness: (v.ratings.reduce((sum, r) => sum + r.responsivenessScore, 0) / v.ratings.length).toFixed(1),
      } : null;

      return {
        id: v.id,
        companyName: v.companyName,
        trustScore: v.trustScore,
        successRate: v.totalOrders > 0 ? ((v.successfulOrders / v.totalOrders) * 100).toFixed(1) + '%' : 'N/A',
        totalOrders: v.totalOrders,
        avgRatings,
      };
    });
  }

  // ──────────── Procurement Health Score (0-100) ────────────
  static async getProcurementHealth() {
    const cacheKey = 'analytics:health';
    const cached = await CacheService.get(cacheKey);
    if (cached) return cached;

    // Component 1: Approval Speed (25%) — avg approval time vs 48h target
    const avgApprovalHours = await ApprovalsRepository.getAverageApprovalTime();
    const approvalScore = Math.max(0, Math.min(25, (1 - Math.min(avgApprovalHours, 96) / 96) * 25));

    // Component 2: Budget Utilization (25%) — % of POs within budget
    const rfqsWithBudget = await prisma.rfq.count({ where: { budgetEstimate: { gt: 0 }, deletedAt: null } });
    const budgetScore = rfqsWithBudget > 0 ? 20 : 25; // Simplified

    // Component 3: Vendor Diversity (15%) — unique vendors used
    const uniqueVendors = await prisma.purchaseOrder.findMany({
      where: { deletedAt: null },
      distinct: ['vendorId'],
      select: { vendorId: true },
    });
    const diversityScore = Math.min(15, uniqueVendors.length * 3);

    // Component 4: On-time Rate (20%)
    const completedPOs = await prisma.purchaseOrder.count({ where: { status: 'COMPLETED', deletedAt: null } });
    const totalPOs = await prisma.purchaseOrder.count({ where: { deletedAt: null } });
    const onTimeScore = totalPOs > 0 ? (completedPOs / totalPOs) * 20 : 20;

    // Component 5: Cost Savings (15%)
    const costSavingsScore = 10; // Placeholder — would need quotation comparison data

    const totalScore = Math.round(approvalScore + budgetScore + diversityScore + onTimeScore + costSavingsScore);

    const health = {
      overallScore: Math.min(100, totalScore),
      components: {
        approvalSpeed: { score: Math.round(approvalScore), max: 25, avgHours: Math.round(avgApprovalHours) },
        budgetUtilization: { score: Math.round(budgetScore), max: 25 },
        vendorDiversity: { score: Math.round(diversityScore), max: 15, uniqueVendors: uniqueVendors.length },
        onTimeDelivery: { score: Math.round(onTimeScore), max: 20, rate: totalPOs > 0 ? ((completedPOs / totalPOs) * 100).toFixed(1) + '%' : 'N/A' },
        costSavings: { score: costSavingsScore, max: 15 },
      },
      rating: totalScore >= 80 ? 'Excellent' : totalScore >= 60 ? 'Good' : totalScore >= 40 ? 'Fair' : 'Needs Improvement',
      generatedAt: new Date().toISOString(),
    };

    await CacheService.set(cacheKey, health, 600); // 10 min cache
    return health;
  }

  // ──────────── Cost Savings Report ────────────
  static async getCostSavings() {
    // For each awarded RFQ, compare selected quotation vs average
    const awardedRfqs = await prisma.rfq.findMany({
      where: { status: 'AWARDED', deletedAt: null },
      include: {
        rfqVendors: {
          include: {
            quotations: { where: { status: { in: ['SUBMITTED', 'REVISED', 'ACCEPTED'] } } },
          },
        },
        purchaseOrders: { select: { totalAmount: true } },
      },
    });

    let totalSavings = 0;
    let totalSpend = 0;
    const details = [];

    awardedRfqs.forEach((rfq) => {
      const allQuoteAmounts = rfq.rfqVendors.flatMap((rv) => rv.quotations.map((q) => q.totalAmount));
      if (allQuoteAmounts.length < 2) return;

      const avgAmount = allQuoteAmounts.reduce((a, b) => a + b, 0) / allQuoteAmounts.length;
      const selectedAmount = rfq.purchaseOrders[0]?.totalAmount || Math.min(...allQuoteAmounts);
      const savings = avgAmount - selectedAmount;

      totalSavings += Math.max(0, savings);
      totalSpend += selectedAmount;

      details.push({
        rfqNumber: rfq.rfqNumber,
        title: rfq.title,
        averageQuote: Math.round(avgAmount),
        selectedAmount: Math.round(selectedAmount),
        savings: Math.round(Math.max(0, savings)),
        savingsPercent: avgAmount > 0 ? ((savings / avgAmount) * 100).toFixed(1) + '%' : '0%',
      });
    });

    return {
      totalSavings: Math.round(totalSavings),
      totalSpend: Math.round(totalSpend),
      overallSavingsPercent: totalSpend > 0 ? ((totalSavings / (totalSpend + totalSavings)) * 100).toFixed(1) + '%' : '0%',
      rfqCount: details.length,
      details,
    };
  }
}

module.exports = AnalyticsService;
