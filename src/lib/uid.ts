import type { Prisma } from "@prisma/client";

type TxClient = Prisma.TransactionClient;

/**
 * Business-UID prefixes. Each maps to a row in the `Counter` table that is
 * pre-seeded (see prisma/seed.ts) so every increment below hits the atomic
 * UPDATE path (never the racy INSERT-on-create path of upsert).
 */
export const UID_PREFIXES = {
  CLIENT: "CL",
  LEAD: "LD",
  POLICY: "POL",
  FUND: "MF",
  USER_ADVISOR: "ADV",
  USER_ADMIN: "ADM",
} as const;

export type CounterName = keyof typeof UID_PREFIXES;

/**
 * Atomically increments the named counter inside the given transaction and
 * returns the next business UID (e.g. "CL007"). Must be called inside the
 * same `prisma.$transaction` that creates the owning record, so the counter
 * bump and the insert commit or roll back together.
 */
export async function nextUid(tx: TxClient, counter: CounterName, pad = 3): Promise<string> {
  const row = await tx.counter.upsert({
    where: { name: counter },
    update: { value: { increment: 1 } },
    create: { name: counter, value: 1 },
  });
  return `${UID_PREFIXES[counter]}${String(row.value).padStart(pad, "0")}`;
}
