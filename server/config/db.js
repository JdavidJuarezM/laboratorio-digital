const mysql = require("mysql2");
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Sistemas.2025",
  database: "laboratorio_digital_db",
  port: 3307,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
module.exports = pool.promise();
