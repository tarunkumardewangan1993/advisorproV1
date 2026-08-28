"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { nextUid } from "@/lib/uid";
import { createUserSchema, updateUserSchema } from "@/lib/validations/user";
import { requireAdmin } from "@/lib/authz";
import type { ActionState } from "@/lib/actions/types";

export async function createUser(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();

  const parsed = createUserSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { status: "error", errors: parsed.error.flatten().fieldErrors, message: "Please fix the errors below" };
  }
  const data = parsed.data;
  const passwordHash = await bcrypt.hash(data.password, 10);

  await prisma.$transaction(async (tx) => {
    const counterName = data.role === "ADMIN" ? "USER_ADMIN" : "USER_ADVISOR";
    const userUid = await nextUid(tx, counterName);
    return tx.user.create({
      data: {
        userUid,
        name: data.name,
        email: data.email || null,
        mobile: data.mobile || null,
        role: data.role,
        passwordHash,
      },
    });
  });

  revalidatePath("/users");
  return { status: "success", message: "User created" };
}

export async function updateUser(id: string, _prevState: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();

  const parsed = updateUserSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { status: "error", errors: parsed.error.flatten().fieldErrors, message: "Please fix the errors below" };
  }
  const data = parsed.data;

  await prisma.user.update({
    where: { id },
    data: {
      name: data.name,
      email: data.email || null,
      mobile: data.mobile || null,
      role: data.role,
      status: data.status,
    },
  });

  revalidatePath("/users");
  return { status: "success", message: "User updated" };
}

export async function resetUserPassword(id: string, newPassword: string): Promise<ActionState> {
  await requireAdmin();
  if (newPassword.length < 6) {
    return { status: "error", message: "Password must be at least 6 characters" };
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({ where: { id }, data: { passwordHash } });

  return { status: "success", message: "Password reset" };
}

export async function deactivateUser(id: string): Promise<void> {
  const admin = await requireAdmin();
  if (admin.user.id === id) return;
  await prisma.user.update({ where: { id }, data: { status: "INACTIVE" } });
  revalidatePath("/users");
}

export async function reactivateUser(id: string): Promise<void> {
  await requireAdmin();
  await prisma.user.update({ where: { id }, data: { status: "ACTIVE" } });
  revalidatePath("/users");
}
