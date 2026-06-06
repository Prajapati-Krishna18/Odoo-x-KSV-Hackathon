// ============================================
// Sequential Number Generator
// ============================================
// Why: Professional ERPs use sequential, human-readable numbers
// (RFQ-2024-0001, PO-2024-0002). UUID alone is not user-friendly.
// This generates next-in-sequence numbers per prefix per year.
// ============================================

const prisma = require('../config/database');

/**
 * Generate a sequential number like RFQ-2024-0001
 * @param {string} prefix - e.g. 'RFQ', 'PO', 'INV', 'QUO'
 * @param {string} model - Prisma model name
 * @param {string} field - The field that stores the number
 * @returns {Promise<string>}
 */
const generateNumber = async (prefix, model, field) => {
  const year = new Date().getFullYear();
  const pattern = `${prefix}-${year}-`;

  // Find the last record with this prefix pattern
  const lastRecord = await prisma[model].findFirst({
    where: {
      [field]: { startsWith: pattern },
    },
    orderBy: { [field]: 'desc' },
    select: { [field]: true },
  });

  let nextNum = 1;
  if (lastRecord) {
    const lastNum = parseInt(lastRecord[field].split('-').pop(), 10);
    nextNum = lastNum + 1;
  }

  return `${pattern}${String(nextNum).padStart(4, '0')}`;
};

module.exports = generateNumber;
