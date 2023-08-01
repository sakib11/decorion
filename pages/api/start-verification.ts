import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prismadb";
import nodemailer from "nodemailer";
import { DateTime } from "luxon";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const { email } = req.body;
  console.log("api", email);

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
        service: "Gmail",
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: "decorionxy@gmail.com", // pass the values in empty strings
          pass: "qkyrchdfjoirxxhl",
        },
      });

      await smtpTransport.sendMail({
        from: "decorionxy@gmail.com",
        to: email,
        text: msg,
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
        service: "Gmail",
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: "", // pass the values in empty strings
          pass: "",
        },
      });

      await smtpTransport.sendMail({
        from: "",
        to: email,
        text: msg,
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
