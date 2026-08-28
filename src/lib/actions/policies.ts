"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { nextUid } from "@/lib/uid";
import { policySchema } from "@/lib/validations/policy";
import { requireSession } from "@/lib/authz";
import { getOwnedClientOrThrow } from "@/lib/data/clients";
import { getOwnedPolicyOrThrow } from "@/lib/data/policies";
import { toDate, toDateOrNull } from "@/lib/dates";
import type { ActionState } from "@/lib/actions/types";

export async function createPolicy(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const session = await requireSession();

  const parsed = policySchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { status: "error", errors: parsed.error.flatten().fieldErrors, message: "Please fix the errors below" };
  }
  const data = parsed.data;
  const client = await getOwnedClientOrThrow(data.clientId);

  await prisma.$transaction(async (tx) => {
    const policyUid = await nextUid(tx, "POLICY");
    return tx.insurancePolicy.create({
      data: {
        policyUid,
        clientId: client.id,
        advisorId: session.user.id,
        policyNumber: data.policyNumber,
        insurer: data.insurer,
        planName: data.planName,
        sumAssured: data.sumAssured,
        premiumAmount: data.premiumAmount,
        premiumFrequency: data.premiumFrequency,
        startDate: toDate(data.startDate),
        dueDate: toDate(data.dueDate),
        maturityDate: toDateOrNull(data.maturityDate),
        status: data.status ?? "ACTIVE",
        notes: data.notes || null,
      },
    });
  });

  revalidatePath(`/clients/${client.id}`);
  redirect(`/clients/${client.id}`);
}

export async function updatePolicy(id: string, _prevState: ActionState, formData: FormData): Promise<ActionState> {
  const existing = await getOwnedPolicyOrThrow(id);

  const parsed = policySchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { status: "error", errors: parsed.error.flatten().fieldErrors, message: "Please fix the errors below" };
  }
  const data = parsed.data;

  await prisma.insurancePolicy.update({
    where: { id },
    data: {
      policyNumber: data.policyNumber,
      insurer: data.insurer,
      planName: data.planName,
      sumAssured: data.sumAssured,
      premiumAmount: data.premiumAmount,
      premiumFrequency: data.premiumFrequency,
      startDate: toDate(data.startDate),
      dueDate: toDate(data.dueDate),
      maturityDate: toDateOrNull(data.maturityDate),
      status: data.status ?? "ACTIVE",
      notes: data.notes || null,
    },
  });

  revalidatePath(`/clients/${existing.clientId}`);
  redirect(`/clients/${existing.clientId}`);
}

export async function deletePolicy(id: string): Promise<void> {
  const existing = await getOwnedPolicyOrThrow(id);
  await prisma.insurancePolicy.update({ where: { id }, data: { deletedAt: new Date() } });
  revalidatePath(`/clients/${existing.clientId}`);
}
