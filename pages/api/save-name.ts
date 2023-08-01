import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prismadb";
import bcrypt from "bcrypt";

async function hashPassword(plaintextPassword: string) {
  return await bcrypt.hash(plaintextPassword, 10);
}

// async function comparePassword(plaintextPassword: string, hash: string) {
//   return await bcrypt.compare(plaintextPassword, hash);
// }

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const { email, name, password } = req.body;

  const user = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (!user) {
    return res.status(400).send("Not Found");
  }

  const hashedPassword = await hashPassword(password);

  await prisma.user.update({
    where: {
      email,
    },
    data: {
      emailVerified: true,
      name,
      password: hashedPassword,
    },
  });

  return res.status(200).send("Success");
}
