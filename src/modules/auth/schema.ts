import { z } from "@hono/zod-openapi";

export const AuthRegisterSchema = z.object({
  fullName: z.string(),
  email: z.email(),
  password: z.string(),
});

export const AuthLoginSchema = z.object({
  email: z.string(),
  password: z.string(),
});

export const AuthLoginSuccessSchema = z.string();

export const AuthHeaderSchema = z.object({
  Authorization: z.string().openapi({
    example: "Bearer Token",
  }),
});

export const AuthMeSchema = z.object({
  id: z.string(),
  fullName: z.string(),
  email: z.email(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
