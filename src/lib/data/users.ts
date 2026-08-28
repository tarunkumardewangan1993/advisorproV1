import "server-only";
import { prisma } from "@/lib/prisma";
import { requireAdmin, requireSession } from "@/lib/authz";

export async function listUsers() {
  await requireAdmin();
  return prisma.user.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: "asc" },
  });
}

export async function getCurrentUser() {
  const session = await requireSession();
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) throw new Error("Current user not found");
  return user;
}
