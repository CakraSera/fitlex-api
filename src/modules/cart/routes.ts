import { OpenAPIHono, z } from "@hono/zod-openapi";
import { prisma } from "../../lib/prisma";
import { checkAuthorized } from "../auth/middleware";
import { AddCartItemSchema, CartSchema } from "./schema";
import { AuthHeaderSchema } from "../auth/schema";

export const cartRoute = new OpenAPIHono();

cartRoute.openapi(
  {
    method: "get",
    path: "/",
    request: { headers: AuthHeaderSchema },
    middleware: checkAuthorized,
    responses: {
      200: {
        description: "List of Users",
        content: { "application/json": { schema: CartSchema } },
      },
    },
  },
  async (c) => {
    const user = c.get("user");
    const cart = await prisma.cart.findFirst({
      where: { userId: user.id },
      include: { items: { include: { product: true } } },
    });

    if (!cart) {
      const newCart = await prisma.cart.create({
        data: { userId: user.id },
        include: { items: { include: { product: true } } },
      });
      return c.json(newCart);
    }
    return c.json(cart);
  }
);

// POST cart/items
cartRoute.openapi(
  {
    method: "post",
    path: "/items",
    request: {
      headers: AuthHeaderSchema,
      body: { content: { "application/json": { schema: AddCartItemSchema } } },
    },
    middleware: checkAuthorized,
    responses: {
      200: {
        content: { "application/json": { schema: CartSchema } },
        description: "List of Users",
      },
      400: {
        description: "Failed to add item to chart",
      },
    },
  },
  async (c) => {
    try {
      const body = c.req.valid("json");
      const user = c.get("user");
      const cart = await prisma.cart.findFirst({
        where: { userId: user.id },
        include: { items: { include: { product: true } } },
      });

      if (!cart) {
        return c.json({ message: "Cart not found" }, 400);
      }

      const newCartItem = await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: body.productId,
          quantity: body.quantity,
        },
        include: { product: true },
      });

      return c.json(newCartItem);
    } catch (error) {
      console.error(error, 400);
      return c.json({ message: error }, 404);
    }
  }
);
