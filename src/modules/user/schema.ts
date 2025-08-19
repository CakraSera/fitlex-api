import { z } from "@hono/zod-openapi";

export const UserSchema = z.object({
  // The unique ID for the user, typically an auto-generated string.
  id: z.string().openapi({
    description: "ID of the user, a unique identifier",
    example: "01K31B632RFYSBZF5PHJWQ7QZA",
  }),

  // The user's chosen nickname or username.
  username: z.string().openapi({
    description: "Nickname of the user, used for login",
    example: "cakra",
  }),

  // The full name of the user.
  fullName: z.string().openapi({
    description: "The user's full, legal name",
    example: "Cakra Buana",
  }),

  // The user's email address, validated as a valid email format.
  email: z.email().openapi({
    description: "The user's email address",
    example: "cakra.buana@example.com",
  }),

  // The timestamp when the user account was created.
  createdAt: z.date().openapi({
    description: "The UTC timestamp of when the user account was created",
    example: "2023-10-27T10:00:00Z",
  }),

  // The timestamp of the last time the user account was updated.
  updatedAt: z.date().openapi({
    description:
      "The UTC timestamp of the last time the user account was updated",
    example: "2023-10-27T10:30:00Z",
  }),
});

export const PrivateUserSchema = UserSchema;

export const PublicUserSchema = UserSchema.omit({
  email: true,
});

export const UsersSchema = z.array(PublicUserSchema);

export const UsersIdSchema = z.object({
  id: z.string(),
});

export type PrivateUser = z.infer<typeof PrivateUserSchema>;
