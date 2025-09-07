import { z } from "@hono/zod-openapi";
import { productSchema } from "../product/schema";

export const CartItemSchema = z.object({
  id: z.string(),

  quantity: z.number(),

  productId: z.string(),
  product: productSchema,

  cartId: z.string(),

  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CartSchema = z.object({
  // The unique ID for the user, typically an auto-generated string.
  id: z.string().openapi({
    description: "ID of the user, a unique identifier",
    example: "01K31B632RFYSBZF5PHJWQ7QZA",
  }),

  items: z.array(CartItemSchema),

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

export const AddCartItemSchema = z.object({
  productId: z.string(),
  quantity: z.number() .default(1),
});

export type PrivateUser = z.infer<typeof CartSchema>;
