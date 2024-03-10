import { trad } from "./trad.services";

const nodemailer = require("nodemailer");
const moment = require("moment");

// SET UP TRANSPORTER
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// SEND APPOINTMENT CONFIRMATION EMAIL TO USER
export const sendAppointmentConfirmationToUser = async (
  user: any,
  appointment: any,
  business: any,
  service: any,
  lang: string
) => {
  const formattedDate = moment(appointment.date).format("DD/MM/YYYY");
  const formattedTime = moment(appointment.date).format("HH:mm");

  const htmlContent = `
  <!DOCTYPE html>
<html lang=${lang}>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${trad[lang].customerConfirmation.subject}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #FDFDFD;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background: white;
      padding: 20px;
    }
    .logo {
      background-color: #0C0E1E;
      border-radius: 6px;
      max-width: 120px;
      padding: 8px;
      margin: 0;
    }
    .header {
      background-color: #0C0E1E;
      color: white;
      padding: 12px;
      text-align: center;
      border-radius: 6px;
      margin: 12px 0;
    }
    .content {
      padding: 16px;
      text-align: center;
    }
    .hello {
      font-size: 18px;
      font-weight: bolder;
    }
    .label {
      font-weight: bold;
    }
    .service {
      font-size: 12px;
    }
    .footer {
      background-color: #F3F3F3;
      color: #888;
      text-align: center;
      padding: 12px;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div class="container">
    <img class="logo" src="https://ucarecdn.com/9fc5f879-de57-4a70-9d9b-c60efa9930bd/darkModeLogo.png" />
    <div class="header">
      <h2>${trad[lang].customerConfirmation.subject}</h2>
    </div>
    <div class="content">
      <p class="hello">${trad[lang].customerConfirmation.hello},</p>
      <p>${trad[lang].customerConfirmation.appointmentConfirmed} <strong>${
    business.name
  }</strong>. </p>
      <p>
      ${trad[lang].customerConfirmation.on} ${formattedDate} ${
    trad[lang].customerConfirmation.at
  } ${formattedTime}.
      </p>

      <hr />

      <div>
      <p class="label"><strong>${
        trad[lang].customerConfirmation.selectedService
      }</strong></p>
      <p class="service">${
        service.vip === false ? service.description["fr"] : service.title["fr"]
      } | ${service.duration}min | ${service.price}€
      </p>
      </div>
      <p>${trad[lang].customerConfirmation.cantWait}</p>
    </div>
    <div class="footer"> ${trad[lang].customerConfirmation.thanks} <strong>${
    business.name
  }</strong>. <br> ${business.address}</div>
  </div>
</body>
</html>
  `;

  const mailOptions = {
    from: `${business.name} <${business.email}>`,
    to: user.mail,
    subject: "Confirmation de Prise de Rendez-vous",
    html: htmlContent,
  };

  try {
    let info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

// SEND APPOINTMENT CONFIRMATION EMAIL TO BUSINESS
export const sendAppointmentConfirmationToBusiness = async (
  user: any,
  appointment: any,
  business: any,
  service: any
) => {
  const formattedDate = moment(appointment.date).format("DD/MM/YYYY");
  const formattedTime = moment(appointment.date).format("HH:mm");

  const htmlContent = `
  <!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nouveau Rendez-Vous</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #FDFDFD;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background: white;
      padding: 20px;
    }
    .logo {
      max-width: 120px;
      margin: 0;
    }
    .header {
      background-color: #0C0E1E;
      color: white;
      padding: 12px;
      text-align: center;
      border-radius: 6px;
      margin: 12px 0;
    }
    .content {
      padding: 16px;
      text-align: center;
    }
    .footer {
      background-color: #F3F3F3;
      color: #888;
      text-align: center;
      padding: 12px;
      font-size: 12px;
    }
    .user-info {
      background-color: #F3F3F3;
      padding: 24px;
      border-radius: 6px;
      margin: 12px 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
    }
    .user-info h3 {
      margin: 0;
    }
    .user-info p {
      margin: 0;
    }
    .user-info strong {
      color: #0C0E1E;
    }
    .services {
        text-align: center;
    }
    .hello {
        font-weight: bold;
        font-size: 18px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>Nouveau Rendez-Vous</h2>
    </div>
    <div class="content">
      <p class="hello">Bonjour,</p>
      <p>Vous avez un nouveau rendez-vous avec <strong>${
        user.firstName
      }</strong>.</p>
      <div class="user-info">
        <h3>Informations sur le rendez-vous</h3>
        <div class="services">
        <p><strong>Date:</strong> ${formattedDate}</p>
        <p><strong>Heure:</strong> ${formattedTime}</p>
        <p><strong>Durée:</strong> ${service.duration}min</p>
        <p><strong>Prestation:</strong> ${
          service.vip === false
            ? service.description["fr"]
            : service.title["fr"]
        }</p>
        </div>

      </div>
      <p>Vous pouvez contacter le client au <strong>${user.phone}</strong>.</p>
    </div>
  </div>
</body>
</html>
  `;

  const mailOptions = {
    from: `${business.name} <${business.email}>`,
    to: business.email,
    subject: "Nouveau Rendez-vous",
    html: htmlContent,
  };

  try {
    let info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};
