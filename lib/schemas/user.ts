import { z } from "zod";

export const UserSchema = z.object({
  id: z.string().optional(),
  name: z.string().nullable().optional(),
  email: z.string().email().nullable().optional(),
  emailVerified: z.date().nullable().optional(),
  image: z.string().nullable().optional(),
  password: z.string().nullable().optional(),
});

export type User = z.infer<typeof UserSchema>;
