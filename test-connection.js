require('dotenv').config({ path: '.env.local' });
const postgres = require('postgres');

const url = process.env.DATABASE_URL;
console.log('Connection URL:', url ? url.substring(0, 50) + '...' : 'NOT SET');

if (!url) {
  console.error('DATABASE_URL not set');
  process.exit(1);
}

const sql = postgres(url);

sql`SELECT 1 as test`
  .then(result => {
    console.log('✅ Connection successful:', result);
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Connection failed:', err.message);
    process.exit(1);
  });
