const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

async function test(url) {
  const pool = new Pool({ connectionString: url });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });
  try {
    await prisma.$connect();
    await prisma.$queryRaw`SELECT 1`;
    console.log("SUCCESS: Connected and queried with url " + url);
    await prisma.$disconnect();
    await pool.end();
    return true;
  } catch (err) {
    console.log("FAILED: " + url + " - " + err.message);
    await pool.end();
    return false;
  }
}

async function run() {
  await test('postgresql://postgres@localhost:5433/postgres');
  await test('postgresql://postgres@localhost:5433/vendorbridge_db');
}
run();
