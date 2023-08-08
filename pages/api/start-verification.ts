import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prismadb";
import nodemailer from "nodemailer";
import { DateTime } from "luxon";
import { otpEmailTemplate } from "../../template/email";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const { email } = req.body;
  console.log("api", email);

  let otp = Math.floor(100000 + Math.random() * 900000);

  let emailTemplate = await otpEmailTemplate(otp.toString(), "sign up");

  const now = DateTime.now();
  const expiresAt = now.plus({ minutes: 5 }).toISO();

  const user = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (!user) {
    try {
      await prisma.user.create({
        data: {
          email,
          otp: otp.toString(),
          otpExpiresAt: expiresAt,
          emailVerified: false,
          image:
            "https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?f=y",
        },
      });
      let smtpTransport = nodemailer.createTransport({
        host: "smtp.sendgrid.net",
        port: 465,
        secure: true,
        requireTLS: true,
        debug: true,
        auth: {
          user: "apikey", // pass the values in empty strings
          pass: process.env.SENDGRID_API_KEY,
        },
      });

      await smtpTransport.sendMail({
        from: "info@decorion.xyz",
        to: email,
        subject: "Sign up verification code",
        html: emailTemplate,
      });
    } catch (error) {
      console.log(error);
    }

    return res.status(200).send("Success");
  }

  if (user && !user.password) {
    try {
      await prisma.user.update({
        where: {
          email,
        },
        data: {
          otp: otp.toString(),
          otpExpiresAt: expiresAt,
          emailVerified: false,
        },
      });

      let smtpTransport = nodemailer.createTransport({
        host: "smtp.sendgrid.net",
        port: 465,
        secure: true,
        requireTLS: true,
        debug: true,
        auth: {
          user: "apikey", // pass the values in empty strings
          pass: process.env.SENDGRID_API_KEY,
        },
      });

      await smtpTransport.sendMail({
        from: "info@decorion.xyz",
        to: email,
        subject: "Sign up verification code",
        html: emailTemplate,
      });
    } catch (error) {
      console.log(error);
    }

    return res.status(200).send("Success");
  }

  if (user && user.password) {
    return res.status(400).send("User exists");
  }
}
