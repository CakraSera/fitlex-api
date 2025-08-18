import z from "zod";

export const BaseUserSchema = z.object({
  id: z.string,
  fullName: z.string,
});
