const { Client } = require('pg');
async function query() {
  const client = new Client({
    connectionString: 'postgresql://postgres@localhost:5433/postgres'
  });
  try {
    await client.connect();
    const res = await client.query("SELECT datname FROM pg_database WHERE datname = 'vendorbridge_db'");
    console.log("Databases matching vendorbridge_db:", res.rows);
  } catch(err) {
    console.error(err);
  } finally {
    await client.end();
  }
}
query();
