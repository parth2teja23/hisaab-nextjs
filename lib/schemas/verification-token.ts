import { z } from "zod";

export const VerificationTokenSchema = z.object({
  identifier: z.string(),
  token: z.string(),
  expires: z.date(),
});

export type VerificationToken = z.infer<typeof VerificationTokenSchema>;
