const mysql = require("mysql");

const connectionData = {
    host: "192.168.0.120",
    user: 'node',
    password: 'node',
    database: 'sensorlog',
};

const connection = mysql.createConnection(connectionData);

// Estabelece a conexão com o BD
// Ela permanece até abortar ou até "connection.end()"
connection.connect(error => {
  if (error) {
    console.error("Erro ao conectar: " + error.stack);
    return;
  }

  console.log("Connectado com o ID: " + connection.threadId);
});

// Função para criar um DB (se já não exisitr)
const createDB = (conn, dbName) => {
  const qry = `CREATE DATABASE IF NOT EXISTS ${dbName}`;

  conn.query(qry, (error, result) => {
    if (error) throw error;
    console.log(`DB ${dbName} criado`);
  });
};

// Função para criar Tables
const createTable = (conn, tbName) => {
  const qry = `CREATE TABLE IF NOT EXISTS log
                (log_id int(11) AUTO_INCREMENT,
                sensor VARCHAR(50) NOT NULL,
                ini VARCHAR(50) NOT NULL,
                fim VARCHAR(50) NOT NULL,
                PRIMARY KEY (log_id))`;

  conn.query(qry, (error, result) => {
    if (error) throw error;
    console.log(`Table ${tbName} criado`);
  });
};

// Função para inserir dados
const insertData = (conn, topic, begin, end) => {
  const qry = `INSERT INTO log (sensor, ini, fim)
                VALUES ('${topic}', '${begin}', '${end}')`;

  conn.query(qry, (error, result) => {
    if (error) throw error;
    console.log(`Inserção sucesso :D`);
  });
};

module.exports = {
  conn: connection,
  inserir: insertData,
};
