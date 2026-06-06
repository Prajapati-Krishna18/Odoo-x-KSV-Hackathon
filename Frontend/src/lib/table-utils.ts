export type SortDir = "asc" | "desc";

export function paginate<T>(items: T[], page: number, pageSize: number) {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const start = (currentPage - 1) * pageSize;
  return {
    items: items.slice(start, start + pageSize),
    total,
    totalPages,
    currentPage,
    pageSize,
  };
}

export function sortItems<T>(
  items: T[],
  key: keyof T,
  dir: SortDir
): T[] {
  return [...items].sort((a, b) => {
    const av = a[key];
    const bv = b[key];
    if (av == null && bv == null) return 0;
    if (av == null) return 1;
    if (bv == null) return -1;
    if (typeof av === "number" && typeof bv === "number") {
      return dir === "asc" ? av - bv : bv - av;
    }
    const as = String(av).toLowerCase();
    const bs = String(bv).toLowerCase();
    if (as < bs) return dir === "asc" ? -1 : 1;
    if (as > bs) return dir === "asc" ? 1 : -1;
    return 0;
  });
}

export function matchesAmountRange(
  amount: number,
  range: string
): boolean {
  if (!range || range === "all") return true;
  if (range === "low") return amount < 10000;
  if (range === "medium") return amount >= 10000 && amount <= 30000;
  if (range === "high") return amount > 30000;
  return true;
}

/** Procurement amount tiers: 0-10K, 10K-50K, 50K-100K, 100K+ */
export function matchesProcurementAmountRange(
  amount: number,
  range: string
): boolean {
  if (!range || range === "all") return true;
  if (range === "0-10k") return amount < 10000;
  if (range === "10k-50k") return amount >= 10000 && amount < 50000;
  if (range === "50k-100k") return amount >= 50000 && amount < 100000;
  if (range === "100k+") return amount >= 100000;
  return true;
}

export function matchesDateRange(
  dateStr: string,
  range: string,
  customFrom?: string,
  customTo?: string
): boolean {
  if (!range || range === "all") return true;
  const date = new Date(dateStr);
  const now = new Date();
  if (range === "today") {
    return date.toDateString() === now.toDateString();
  }
  if (range === "week") {
    const weekAgo = new Date(now);
    weekAgo.setDate(now.getDate() - 7);
    return date >= weekAgo;
  }
  if (range === "month") {
    const monthAgo = new Date(now);
    monthAgo.setMonth(now.getMonth() - 1);
    return date >= monthAgo;
  }
  if (range === "custom" && customFrom && customTo) {
    return date >= new Date(customFrom) && date <= new Date(customTo);
  }
  return true;
}
