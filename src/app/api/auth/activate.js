import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "admin") {
      return res.status(400).json({ message: "Admin accounts cannot be activated this way" });
    }

    const updatedUser = await prisma.user.update({
      where: { email },
      data: { role: "active" },
    });

    return res.status(200).json({ message: "Account activated successfully", user: updatedUser });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
}