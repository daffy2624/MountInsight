const mysql = require("mysql2/promise");

const dbURI =
  "mysql://root:OHVaIfMVTdmNPPShZIeRrcbOhkvaZPxj@nozomi.proxy.rlwy.net:13652/railway";

async function getConnection() {
  const connection = await mysql.createConnection(dbURI);
  return connection;
}

module.exports = getConnection;

console.log("TAIK");
