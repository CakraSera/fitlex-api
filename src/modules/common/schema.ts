import { z } from "@hono/zod-openapi";

// The timestamp when the user account was created.
export const createdAt = z.date().openapi({
  description: "The UTC timestamp of when the user account was created",
  example: "2023-10-27T10:00:00Z",
});

// The timestamp of the last time the user account was updated.
export const updatedAt = z.date().openapi({
  description:
    "The UTC timestamp of the last time the user account was updated",
  example: "2023-10-27T10:30:00Z",
});
