"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { nextUid } from "@/lib/uid";
import { fundSchema } from "@/lib/validations/fund";
import { requireSession } from "@/lib/authz";
import { getOwnedClientOrThrow } from "@/lib/data/clients";
import { getOwnedFundOrThrow } from "@/lib/data/funds";
import { toDate, toDateOrNull } from "@/lib/dates";
import type { ActionState } from "@/lib/actions/types";

export async function createFund(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const session = await requireSession();

  const parsed = fundSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { status: "error", errors: parsed.error.flatten().fieldErrors, message: "Please fix the errors below" };
  }
  const data = parsed.data;
  const client = await getOwnedClientOrThrow(data.clientId);

  await prisma.$transaction(async (tx) => {
    const fundUid = await nextUid(tx, "FUND");
    return tx.mutualFund.create({
      data: {
        fundUid,
        clientId: client.id,
        advisorId: session.user.id,
        folioNumber: data.folioNumber,
        amcName: data.amcName,
        schemeName: data.schemeName,
        investmentType: data.investmentType,
        sipAmount: data.sipAmount || null,
        sipDueDate: toDateOrNull(data.sipDueDate),
        investedAmount: data.investedAmount,
        currentValue: data.currentValue === "" || data.currentValue === undefined ? null : data.currentValue,
        startDate: toDate(data.startDate),
        status: data.status ?? "ACTIVE",
        notes: data.notes || null,
      },
    });
  });

  revalidatePath(`/clients/${client.id}`);
  redirect(`/clients/${client.id}`);
}

export async function updateFund(id: string, _prevState: ActionState, formData: FormData): Promise<ActionState> {
  const existing = await getOwnedFundOrThrow(id);

  const parsed = fundSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { status: "error", errors: parsed.error.flatten().fieldErrors, message: "Please fix the errors below" };
  }
  const data = parsed.data;

  await prisma.mutualFund.update({
    where: { id },
    data: {
      folioNumber: data.folioNumber,
      amcName: data.amcName,
      schemeName: data.schemeName,
      investmentType: data.investmentType,
      sipAmount: data.sipAmount || null,
      sipDueDate: toDateOrNull(data.sipDueDate),
      investedAmount: data.investedAmount,
      currentValue: data.currentValue === "" || data.currentValue === undefined ? null : data.currentValue,
      startDate: toDate(data.startDate),
      status: data.status ?? "ACTIVE",
      notes: data.notes || null,
    },
  });

  revalidatePath(`/clients/${existing.clientId}`);
  redirect(`/clients/${existing.clientId}`);
}

export async function deleteFund(id: string): Promise<void> {
  const existing = await getOwnedFundOrThrow(id);
  await prisma.mutualFund.update({ where: { id }, data: { deletedAt: new Date() } });
  revalidatePath(`/clients/${existing.clientId}`);
}
