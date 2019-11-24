
#define pinoPIR 7 //Porta que lê a saido do sensor de movimento
#define pinoPIRSala 6 //Porta que lê a saido do sensor de movimento
#define pinoLED 13 //Porta que acionará o buzzer
#define pino_trigger 4 // Porta que envia sinal Trigger
#define pino_echo 5 // Porta que recebe Retorno do sinal Echo

//Bibliotecas
#include <SPI.h>
#include <Ethernet.h>
#include <PubSubClient.h>
#include <DS3231.h> 
#include <Ultrasonic.h>

//contador para verificar quantos segs passaram
int contadorPir;
int contDB;
int contDBUltr;
int contUltr;

bool publicarPirQuarto;
bool publicarPirSala;
bool publicarUltr;

float cmMsec;
long microsec;

byte mac[]  = {  0xDE, 0xED, 0xBA, 0xFE, 0xFE, 0xED };
IPAddress ip(192, 168, 1, 115); // Endereço Ip deste client
IPAddress broker(192, 168, 1, 101); //endereço de ip do Broker

// Comunicação I2C
DS3231 rtc(SDA, SCL);

// Inicializa Sensor
Ultrasonic ultrasonic(pino_trigger, pino_echo);

EthernetClient ethClient;
PubSubClient client(ethClient);

//funcao responsvavel por receber novas mensagens
void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Uma nova mensagem Chegou [");
  Serial.print(topic);
  Serial.print("]:  ");
  for (int i=0;i<length;i++) {
    Serial.print((char)payload[i]);
  }
  Serial.println();
}

// função responsável por conectar o client
void reconnect() {
  
  // Fica em loop ate estabelecer comunicacao
  while (!client.connected()) {
    
    Serial.print("Tentando Estabelecer Conexão MQTT...");
    
    // Tenta conectar
    if (client.connect("arduinoClient", "arduino", "arduino")) {
      
      Serial.println("Conectado");
      
      // Uma vez conectado ele publica uma mensagem de sucesso...
      //client.publish("Conexão","Comunicação bem estabelecida", 1);
      
      // E se inscreve no tópico 
      //client.subscribe("Conexão");
      
    } else {
      
      Serial.print("Falha, rc=");
      Serial.print(client.state());
      Serial.println(" tentando novamente em 5 segundos");
      
      // Tempo de espera até tentar conectar novamente
      delay(5000);
    }
  }
}

//Função imprime no serial monitor quando detecta mov por mais de 5 secs
void intrusoDetec(String topico){
  
  contDB++;
  contDBUltr++;

  int detectCont = 0;

  if(topico == "ultra") {publicarUltr = true, detectCont = contDBUltr;}
  if(topico == "pirQuarto") {publicarPirQuarto = true, detectCont = contDB;}
  if(topico == "pirSala") {publicarPirSala = true, detectCont = contDB;}
  
  Serial.print("Intruso Detectado em: ");
  // Atribui data a string data
  String data = rtc.getDateStr();
  // Imprime data
  Serial.print(rtc.getDateStr());
  Serial.print(": ");

  // Imprime o dia da semana
  // Serial.print(rtc.getDOWStr());
  // Serial.print(" -- ");

  // Atribui a hora a string hora
  String hora = rtc.getTimeStr();
  //Imprime o horário (hora, min, seg)
  Serial.println(rtc.getTimeStr());

  String dataHora = data + hora + detectCont;
  String topic = topico;

  int payloadSize = dataHora.length() + 1;
  int payloadSizeTopic = topico.length() + 1;

  char payload_char[payloadSize];
  char payload_char_topico[payloadSizeTopic];

  dataHora.toCharArray(payload_char, payloadSize);
  topic.toCharArray(payload_char_topico, payload_char_topico);

  client.publish(payload_char_topico, payload_char, 1);
  Serial.print("-------");
  Serial.println(topico);
 
}

// função para medir distancia do ultrassonico
void ultrassonico(){
  microsec = ultrasonic.timing();
  cmMsec = ultrasonic.convert(microsec, Ultrasonic::CM);
  Serial.print("Distancia em cm: ");
  Serial.println(cmMsec);
  if(cmMsec < 30){
    contUltr++;
    
    if(contUltr >= 5 ){
      Serial.println(contDB);
      intrusoDetec("ultra");
    }
  }
  else{
    Serial.println("entrou no else do uultr");
    contUltr = 0;
    contDBUltr = 0;
    if(publicarUltr){
      publicarUltr = false;
      client.publish("ultrFinal", "FIM", 1);
      Serial.println("publicou");
    }
  }
}

void setup(){
  
  pinMode(pinoPIR, INPUT);
  pinMode(pinoPIRSala, INPUT);
  pinMode(pinoLED, OUTPUT);
  rtc.begin();

  //primeiro upload necessita configurar o horário
  //rtc.setDate(18, 9, 2019);
  //rtc.setDOW(SUNDAY);     // Dia da Semana até Monday ~ Sunday
  //rtc.setTime(14,20, 0);     // Data neste formato 12:00:00 (h, min, sec)
  
  Serial.begin(9600);

  client.setServer(broker, 1883);
  client.setCallback(callback);

  Ethernet.begin(mac, ip);
  // Allow the hardware to sort itself out
  delay(1500);

}

void loop(){
  
  if (!client.connected()) {
    reconnect();
  }

  //Lê o valor do sensor de movimento e transforma em booleano
  bool leituraPIR = digitalRead(pinoPIR);
  bool leituraPIRSala = digitalRead(pinoPIRSala);
  ultrassonico();

  if (leituraPIRSala || leituraPIR) {
    // qualquer movimento detectado irá acender o LED
    digitalWrite(pinoLED, HIGH);

    // Usando para contar os segs passados desde o 1º mov
    contadorPir++;

      // Dispara alarme depois de 5 seg de mov. contínuo
      if (contadorPir >= 5){
        if(leituraPIR)intrusoDetec("pirQuarto");
        if(leituraPIRSala) intrusoDetec("pirSala");
      }

            
  } else {
    Serial.println("SEM INTRUSO");
    digitalWrite(pinoLED, LOW);
    //Quando cessar mov. contador é resetado
    contadorPir = 0;
    contDB = 0;
    if (publicarPirQuarto){
      publicarPirQuarto = false;
      client.publish("pirFinalQuarto", "FIM", 1);
      Serial.println("FIM DO MOVIMENTO");
      
    }
    else if (publicarPirSala){
      publicarPirSala = false;
      client.publish("pirFinalSala", "FIM", 1);
      Serial.println("FIM DO MOVIMENTO");
      
    }
  }
  
  delay(1000);
  client.loop();
  
}
