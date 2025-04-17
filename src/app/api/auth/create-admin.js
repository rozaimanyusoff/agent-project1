import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const existingAdmin = await prisma.admin.findUnique({ where: { email } });

    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const newAdmin = await prisma.admin.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    return res.status(201).json({ message: "Admin account created successfully", admin: newAdmin });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
}