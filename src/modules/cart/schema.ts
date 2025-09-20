import { z } from "@hono/zod-openapi";
import { productSchema } from "../product/schema";
import { createdAt, updatedAt } from "../common/schema";

export const CartItemSchema = z.object({
  id: z.string(),

  quantity: z.number(),

  productId: z.string(),
  product: productSchema,

  cartId: z.string(),

  createdAt,
  updatedAt,
});

export type CartItem = z.infer<typeof CartItemSchema>;

export const CartSchema = z.object({
  // The unique ID for the user, typically an auto-generated string.
  id: z.string().openapi({
    description: "ID of the user, a unique identifier",
    example: "01K31B632RFYSBZF5PHJWQ7QZA",
  }),

  items: z.array(CartItemSchema),
  createdAt,
  updatedAt,
});

export const AddCartItemSchema = z.object({
  productId: z.string(),
  quantity: z.number().default(1),
});

export const DeleteCartItemSchema = z.object({
  productId: z.string(),
  quantity: z.number().default(1),
});
export const UpdateCartItemSchema = AddCartItemSchema.required();
export type PrivateUser = z.infer<typeof CartSchema>;
