const mqtt = require("mqtt");

const mail = require('./mailSender');

const { conn, inserir } = require('./dbConnection');

// Endereço do Broker
const url = 'mqtt://192.168.0.120:1883';

const options = {
  clientId: 'teste',
};

// Nome dos tópicos a se inscrever
const topico = ["pirQuarto", "pirSala", "ultra", "pirFinalQuarto", "pirFinalSala", "ultrFinal"];

//  método que conecta com o MQTT utilizando o IP e atributos add ex. user, passw
const client = mqtt.connect(url, options);

// variaveis de controle para medição do intervalo de tempo;
var iData = '';
var iHora = '';
var fData = '';
var fHora = '';

// "método" chamado quando a msg recebida é "connect"
client.on("connect", () => {
    console.log("conectado ao Mosquitto =  " + client.connected);
    iData = "";
    iHora = "";
    fData = "";
    fHora = "";
    
});

// "método" chamado quando a msg recebida é "error"
client.on("error", (error) => {
    console.log("Não foi possivel conectar - " + error);
});

// Se inscrevendo nos topicos do array "topico"
client.subscribe(topico, {qos:2});

// funçao que pega inicio e fim do movimento
function medeTempo(mensagem, topico) {

    let contador = parseInt(mensagem.slice(18));
    if (contador === 1){
        inicio =  contador;
        iData = mensagem.slice(0, 10);
        iHora = mensagem.slice(10, 18);
        mail.firstEmail(topico, `${iData} - ${iHora}`);
        console.log(iData + " - " + iHora);
     
    }
    else {
        fData =  mensagem.slice(0, 10);
        fHora = mensagem.slice(10, 18);
    }
    
    console.log(contador);
}

// função que insere no banco
function insereDB(topico) {
    if (iData === undefined || fData === undefined || fData === "") return;
    //inserindo no banco de dados
    inserir(conn, `${topico}`, `${iData} - ${iHora}`, `${fData} - ${fHora}`);
    mail.finalEmail(topico, `${iData} - ${iHora}`, `${fData} - ${fHora}`);
    console.log('\nfinalMail\n');

    // "zerando os valores para as proximas infos"
    iData = "";
    iHora = "";
    fData = "";
    fHora = "";

}

// "método "listener" para quando mensagens chegarem
client.on("message", (topic, message, packet) => {
    console.log("Topico: " + topic);
    console.log("Mensagem: " + message);
    
    // filtrando pelo nome do tópico
    switch (topic) {

        case 'pirQuarto':
            medeTempo(message, 'PirQuarto');
        break;

        case 'pirSala':
            medeTempo(message, 'PirSala');
        break;

        case 'ultra':
            medeTempo(message, 'Ultrassonico');      
        break;
        
        case 'pirFinalQuarto':
            insereDB("PirQuarto");
        break;

        case 'pirFinalSala':
            insereDB("PirSala");
        break;

        case 'ultrFinal':
            insereDB("Ultrassonico");
        break;

        default:
            console.log(topic + ' não é registrado no banco');
    }
});

// Finaliza a conexão com o Broker
//client.end();