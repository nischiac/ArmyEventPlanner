const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'nischi@123',
  database: 'army_event_planner'
});

connection.connect((err) => {
  if (err) {
    console.error('❌ MySQL Connection Error:', err);
    return;
  }
  console.log('✅ Connected to MySQL');
});

module.exports = connection;
