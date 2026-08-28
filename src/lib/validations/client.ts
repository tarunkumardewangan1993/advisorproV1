import { z } from "zod";

export const clientSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z.union([z.string().trim().email("Invalid email"), z.literal("")]).optional(),
  mobile: z
    .union([z.string().trim().regex(/^[0-9+\-\s]{7,15}$/, "Invalid mobile number"), z.literal("")])
    .optional(),
  dob: z.union([z.string().trim().min(1), z.literal("")]).optional(),
  address: z.string().trim().optional(),
  notes: z.string().trim().optional(),
});

export type ClientInput = z.infer<typeof clientSchema>;
