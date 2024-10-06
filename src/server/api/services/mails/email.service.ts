import nodemailer from "nodemailer";
import { emailTemplate } from "@/server/api/utils/emailTemplate";

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_EMAIL_USER,
    pass: process.env.SMTP_EMAIL_PASSWORD,
  },
});

export const sendEmail = async (to: string, subject: string, usuarioSolicitante: string) => {
  const mailOptions = {
    from: '"Sistema UTN" <testutn88@gmail.com>',
    to,
    subject,
    html: emailTemplate(usuarioSolicitante),
  };

  try {
    if (!transporter) {
      throw new Error("No se pudo crear el transporte de correo");
    }

    const info = await transporter.sendMail(mailOptions);
    console.log("Correo enviado: %s", info.messageId);
    return info;
  } catch (error) {
    console.error("Error al enviar correo: ", error);
    throw new Error("No se pudo enviar el correo.");
  }
};
