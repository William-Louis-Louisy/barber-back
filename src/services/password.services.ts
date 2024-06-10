import crypto from "crypto";
import UserSchema from "../models/user.models";
import { trad } from "./trad.services";

const nodemailer = require("nodemailer");
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

export const generateResetPasswordToken = () => {
  return new Promise<string>((resolve, reject) => {
    crypto.randomBytes(32, (err, buffer) => {
      if (err) {
        reject(err);
      } else {
        const token = buffer.toString("hex");
        resolve(token);
      }
    });
  });
};

export const setResetPasswordToken = async (email: string) => {
  try {
    // Find the user with the provided email
    const user = await UserSchema.findOne({
      mail: email,
    });

    // If the user is not found, return an error
    if (!user) {
      throw new Error("User not found");
    }

    // Generate a reset password token
    const resetPasswordToken = await generateResetPasswordToken();

    // Set the reset password token and expiration date (1 hour from now)
    user.resetPasswordToken = resetPasswordToken;
    user.resetPasswordTokenExpiration = new Date(Date.now() + 3600000) as any;

    // Save the user
    await user.save();

    return { user, resetPasswordToken };
  } catch (err) {
    throw err;
  }
};

export const sendResetPasswordEmail = async (
  email: string,
  token: string,
  lang: string
) => {
  const htmlContent = `
    <!DOCTYPE html>
    <html lang=${lang}>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${trad[lang].passwordReset.subject}</title>
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
        background-color: #000;
        padding: 10px;
      }
      .content {
        padding: 20px;
        text-align: left;
      }
      .button {
        padding: 12px 20px;
        text-decoration: none;
        border-radius: 6px;
        width: fit-content;
      }
      .hello {
        font-size: 18px;
        font-weight: bolder;
      }
      .ignore {
        font-size: 12px;
      }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img class="logo" src="https://ucarecdn.com/9fc5f879-de57-4a70-9d9b-c60efa9930bd/darkModeLogo.png" alt="Logo" />
        </div>
        <div class="content">
          <h1 class="hello">${trad[lang].passwordReset.hello}</h1>
          <p>${trad[lang].passwordReset.resetPassword}</p>
          <p>${trad[lang].passwordReset.clickLink}</p>
          <a class="button" href="http://localhost:3000/resetPassword/${token}">${trad[lang].passwordReset.subject}</a>
          <p>${trad[lang].passwordReset.linkValid}</p>
          <p class="ignore">${trad[lang].passwordReset.ignore}</p>
        </div>

      </div>
    </body>
    </html>
    `;

  const mailOptions = {
    from: `Tommy Barber <tommyramirez_g@yahoo.com>`,
    to: email,
    subject: trad[lang].passwordReset.subject,
    html: htmlContent,
  };
  try {
    let info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.error("Error sending email: ", error);
    throw error;
  }
};

export const verifyToken = async (token: string) => {
  try {
    const now = new Date();
    const user = await UserSchema.findOne({
      resetPasswordToken: token,
    });

    if (!user) {
      return null;
    }

    const expiration = user.resetPasswordTokenExpiration;

    if (
      !user.resetPasswordToken ||
      !user.resetPasswordTokenExpiration ||
      !(expiration instanceof Date) ||
      expiration < now
    ) {
      return null;
    }

    return user;
  } catch (error) {
    return null;
  }
};
