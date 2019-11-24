const mysql = require("mysql2/promise");

async function fetchEmail(name) {
  // estabelece a conexão
  const connection = await mysql.createConnection({
    host: "192.168.0.120",
    user: "node",
    password: "node",
    database: "sensorlog"
  });
  // Executa a query abaixo
  const [rows, fields] = await connection.execute(
    `SELECT email FROM user WHERE nome = '${name}'`
  );
  // Debugugando resposta
  console.log(rows[0].email);

  // fecha a conexão
  connection.end();
  // retorna o primeiro Match
  return rows[0].email;
}

module.exports = {
  promiseMail: fetchEmail
};
