import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prismadb";
import nodemailer from "nodemailer";
import { DateTime } from "luxon";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  console.log("reset");
  const { email } = req.body;

  let otp = Math.floor(100000 + Math.random() * 900000);
  let msg = `Your Decorion OTP is ${otp}`;

  const now = DateTime.now();
  const expiresAt = now.plus({ minutes: 5 }).toISO();

  const user = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (!user) {
    return res.status(404).send("User doesn't exist");
  }

  try {
    await prisma.user.update({
      where: {
        email,
      },
      data: {
        otp: otp.toString(),
        otpExpiresAt: expiresAt,
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
      text: msg,
    });
  } catch (error) {
    console.log(error);
  }

  return res.status(200).send("Success");
}
