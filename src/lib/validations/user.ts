import { z } from "zod";

export const roleEnum = z.enum(["ADMIN", "ADVISOR"]);
export const userStatusEnum = z.enum(["ACTIVE", "INACTIVE"]);

export const createUserSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z.union([z.string().trim().email("Invalid email"), z.literal("")]).optional(),
  mobile: z
    .union([z.string().trim().regex(/^[0-9+\-\s]{7,15}$/, "Invalid mobile number"), z.literal("")])
    .optional(),
  role: roleEnum,
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const updateUserSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z.union([z.string().trim().email("Invalid email"), z.literal("")]).optional(),
  mobile: z
    .union([z.string().trim().regex(/^[0-9+\-\s]{7,15}$/, "Invalid mobile number"), z.literal("")])
    .optional(),
  role: roleEnum,
  status: userStatusEnum,
});

export const profileSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z.union([z.string().trim().email("Invalid email"), z.literal("")]).optional(),
  mobile: z
    .union([z.string().trim().regex(/^[0-9+\-\s]{7,15}$/, "Invalid mobile number"), z.literal("")])
    .optional(),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(6, "New password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm the new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
