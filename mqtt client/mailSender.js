const nodemailer = require("nodemailer");

const { promiseMail } = require("./dbPromises");

// configurações de envio
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "user",
    pass: "password"
  }
});

// Email contendo apenas indicando o início do movimento
const sendFirstEmail = (local, ini) => {
  // Promise do fetch ao banco pelo nome
  promiseMail("natan").then(email => {
    let mailOptions = {
      from: "sender",
      to: email,
      subject: `[ALERTA!|${local}]`,
      html: `<p><b>Proceder com cuidado!</b>
      Intruso Detectado em ${local} às ${ini}</p>`
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) console.log(err);
      // mensagem de sucesso de envio com varias dados
      else console.log(info);
    });
  });
};

// Email contendo o periodo que foi detectado movimento
const sendFinalEmail = (local, ini, fim) => {
  // Promise do fetch ao banco
  promiseMail("natan").then(email => {
    let mailOptions = {
      from: "sender",
      to: email,
      subject: `[ALERTA!|${local}]`,
      html: `<p><b>Proceder com cuidado!</b>
      Intruso Detectado em ${local} de ${ini} às ${fim}</p>`
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) console.log(err);
      // mensagem de sucesso de envio com varias dados
      else console.log(info);
    });
  });
};

module.exports = {
  firstEmail: sendFirstEmail,
  finalEmail: sendFinalEmail
};
