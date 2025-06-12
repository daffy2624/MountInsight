require("dotenv").config();
const mysql = require("mysql2/promise");

const dbURI = process.env.DATABASE_URL;

async function getConnection() {
  const connection = await mysql.createConnection(dbURI);
  return connection;
}

module.exports = getConnection;
