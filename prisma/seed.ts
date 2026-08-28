import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const COUNTER_NAMES = ["CLIENT", "LEAD", "POLICY", "FUND", "USER_ADVISOR", "USER_ADMIN"] as const;

async function main() {
  // Pre-seed every counter row so nextUid()'s upsert always hits the atomic
  // UPDATE path, never the racy INSERT-on-create path.
  for (const name of COUNTER_NAMES) {
    await prisma.counter.upsert({
      where: { name },
      update: {},
      create: { name, value: 0 },
    });
  }

  const existingAdmin = await prisma.user.findFirst({ where: { role: "ADMIN" } });
  if (!existingAdmin) {
    const counter = await prisma.counter.update({
      where: { name: "USER_ADMIN" },
      data: { value: { increment: 1 } },
    });
    const userUid = `ADM${String(counter.value).padStart(3, "0")}`;
    const passwordHash = await bcrypt.hash("ChangeMe123!", 10);

    await prisma.user.create({
      data: {
        userUid,
        name: "Administrator",
        role: "ADMIN",
        status: "ACTIVE",
        passwordHash,
      },
    });

    console.log(`Created initial admin: userUid=${userUid} password=ChangeMe123! — change this after first login.`);
  } else {
    console.log("Admin user already exists, skipping.");
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
