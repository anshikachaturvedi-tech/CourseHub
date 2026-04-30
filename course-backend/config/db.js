require('dotenv').config();
const mysql = require('mysql2/promise');

// ✅ Guard: crash with a clear message if MYSQL_URL is missing
if (!process.env.MYSQL_URL) {
  console.error('❌ MYSQL_URL environment variable is not set!');
  process.exit(1);
}

const dbUrl = new URL(process.env.MYSQL_URL);

console.log('Attempting to connect with user:', dbUrl.username);

const db = mysql.createPool({
  host:               dbUrl.hostname,
  port:               dbUrl.port || 3306,
  user:               dbUrl.username,
  password:           dbUrl.password,
  database:           dbUrl.pathname.replace('/', ''),
  waitForConnections: true,
  connectionLimit:    10,
});

db.getConnection()
  .then(() => console.log('MySQL Connected as ' + dbUrl.username + ' ✅'))
  .catch(err => {
    console.error('Connection Failed ❌');
    console.error('Error Code:', err.code);
    console.error('Message:', err.message);
  });

module.exports = db;
