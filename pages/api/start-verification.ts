import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prismadb";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const { phone } = req.body;
  let formData = new URLSearchParams();
  let otp = Math.floor(100000 + Math.random() * 900000);
  let msg = `Your Decorion OTP is ${otp}`;
  formData.append("to", phone);
  formData.append("msg", msg);
  formData.append("api_key", "Mvo1jau86lN8So8JtTFmj003PJTA456Ed3LY7tme");

  const user = await prisma.user.findFirst({
    where: {
      phone,
    },
  });

  if (!user) {
    await prisma.user.create({
      data: {
        phone,
        otp: otp.toString(),
        image:
          "https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?f=y",
      },
    });
  } else {
    await prisma.user.update({
      where: {
        phone,
      },
      data: {
        otp: otp.toString(),
        image:
          "https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?f=y",
      },
    });
  }

  await fetch("https://api.sms.net.bd/sendsms", {
    method: "POST",
    body: formData,
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  return res.status(200).send("Success");
}
