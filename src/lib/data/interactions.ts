import "server-only";
import { prisma } from "@/lib/prisma";
import { requireSession, advisorScopeWhere, assertOwnsRecord, ForbiddenError } from "@/lib/authz";

export async function listInteractionsForClient(clientId: string) {
  const session = await requireSession();
  return prisma.interaction.findMany({
    where: { clientId, deletedAt: null, ...advisorScopeWhere(session) },
    orderBy: { interactionDate: "desc" },
  });
}

export async function getOwnedInteractionOrThrow(id: string) {
  const session = await requireSession();
  const interaction = await prisma.interaction.findFirst({ where: { id } });
  if (!interaction) throw new ForbiddenError("Interaction not found");
  assertOwnsRecord(session, interaction);
  return interaction;
}

export async function listUpcomingFollowUps() {
  const session = await requireSession();
  const [clientFollowUps, leadFollowUps] = await Promise.all([
    prisma.interaction.findMany({
      where: { deletedAt: null, followUpDate: { not: null }, ...advisorScopeWhere(session) },
      orderBy: { followUpDate: "asc" },
      include: { client: { select: { id: true, name: true, clientUid: true, mobile: true } } },
    }),
    prisma.lead.findMany({
      where: { deletedAt: null, followUpDate: { not: null }, status: { not: "CONVERTED" }, ...advisorScopeWhere(session) },
      orderBy: { followUpDate: "asc" },
    }),
  ]);
  return { clientFollowUps, leadFollowUps };
}
