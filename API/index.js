const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const connection = mysql.createConnection({
	host: "192.168.0.120",
	user: "node",
	password: "node",
	database: "sensorlog",
});

var app = express();

app.use(cors());

//Rota para buscar todos os emails cadastrados
app.get("/users/:email", (request, response) => {
	let email  = request.params.email;
	connection.execute(`SELECT email FROM user WHERE email = ?`, [email],
	(error, result, fields) => {
		if(error) throw error;
		response.send(result);
	});
});

//Rota para buscar os dados dos sensores
app.get("/sensorLog", (request, response) => {
	connection.execute(`SELECT * FROM log`,
	(error, result, fields) => {
		if(error) throw error;
		response.send(result);
	});
});
//Rota para cadastrar novo usuário
app.post("/newUser/:nome/:email", (request, response) => {
	let email  = request.params.email;
	let nome = request.params.nome;
	connection.execute(`INSERT INTO user (nome, email) VALUES (?,?)`, [nome, email],
	(error, result, fields) => {
		if(error) throw error;
		console.log("inseriu")
	});
	console.log(email + " " + nome);
	response.send('Sucesso');
});

app.listen(3000, () => {
	console.log("startando na 3000");
});