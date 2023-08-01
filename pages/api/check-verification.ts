import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prismadb";
import nodemailer from "nodemailer";
import { DateTime } from "luxon";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const { email, otp } = req.body;

  const user = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (!user) {
    return res.status(400).send("Not Found");
  }

  if (user.otp !== otp) {
    return res.status(400).send("Otp mismatched");
  }

  const now = DateTime.now();
  const otpExiresAt = DateTime.fromISO(user.otpExpiresAt!.toString());

  if (now > otpExiresAt) {
    return res.status(400).send("Otp expired");
  }

  return res.status(200).send("Success");
}
