"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { profileSchema, changePasswordSchema } from "@/lib/validations/user";
import { requireSession } from "@/lib/authz";
import type { ActionState } from "@/lib/actions/types";

export async function updateProfile(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const session = await requireSession();

  const parsed = profileSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { status: "error", errors: parsed.error.flatten().fieldErrors, message: "Please fix the errors below" };
  }
  const data = parsed.data;

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name: data.name,
      email: data.email || null,
      mobile: data.mobile || null,
    },
  });

  revalidatePath("/profile");
  return { status: "success", message: "Profile updated" };
}

export async function changeOwnPassword(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const session = await requireSession();

  const parsed = changePasswordSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { status: "error", errors: parsed.error.flatten().fieldErrors, message: "Please fix the errors below" };
  }
  const data = parsed.data;

  const user = await prisma.user.findUniqueOrThrow({ where: { id: session.user.id } });
  const matches = await bcrypt.compare(data.currentPassword, user.passwordHash);
  if (!matches) {
    return { status: "error", errors: { currentPassword: ["Current password is incorrect"] }, message: "Please fix the errors below" };
  }

  const passwordHash = await bcrypt.hash(data.newPassword, 10);
  await prisma.user.update({ where: { id: user.id }, data: { passwordHash } });

  return { status: "success", message: "Password changed" };
}
