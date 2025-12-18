import { z } from "zod";

export const SessionSchema = z.object({
  id: z.string().optional(),
  sessionToken: z.string(),
  userId: z.string(),
  expires: z.date(),
});

export type Session = z.infer<typeof SessionSchema>;
