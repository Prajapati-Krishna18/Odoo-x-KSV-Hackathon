const { Client } = require('pg');

async function createDb() {
  const client = new Client({
    connectionString: 'postgresql://postgres@localhost:5433/postgres'
  });
  try {
    await client.connect();
    console.log("Connected to default postgres database.");
    await client.query('CREATE DATABASE vendorbridge_db');
    console.log("Created database vendorbridge_db successfully!");
  } catch (err) {
    console.log("Error creating database: " + err.message);
  } finally {
    await client.end();
  }
}
createDb();
