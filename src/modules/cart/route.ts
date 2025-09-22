import { OpenAPIHono, z } from "@hono/zod-openapi";
import { prisma } from "../../lib/prisma";
import { checkAuthorized } from "../auth/middleware";
import {
  AddCartItemSchema,
  CartItem,
  CartSchema,
  ParamsCartItemById,
  UpdateCartItemSchema,
} from "./schema";
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
        description: "Failed to add item to cart",
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

      const cartItemAvailable: CartItem[] = cart.items.filter(
        (item) => item.product.id === body.productId
      );

      console.log({ cartItemAvailable });

      if (cartItemAvailable.length > 0) {
        // update data prisma on here
        const updatedCartItem = await prisma.cartItem.update({
          where: { id: cartItemAvailable[0].id },

          data: {
            quantity: cartItemAvailable[0].quantity + body.quantity,
          },
        });

        return c.json(updatedCartItem);
      } else {
        const newCartItem = await prisma.cartItem.create({
          data: {
            cartId: cart.id,
            productId: body.productId,
            quantity: body.quantity,
          },
          include: { product: true },
        });
        return c.json(newCartItem);
      }
    } catch (error) {
      console.error(error, 404);
      return c.json({ message: error }, 404);
    }
  }
);

// delete cart/items/:itemid

cartRoute.openapi(
  {
    method: "delete",
    path: "/items/{cart_item_id}",
    request: {
      headers: AuthHeaderSchema,
      params: ParamsCartItemById,
    },
    middleware: checkAuthorized,
    responses: {
      200: {
        content: { "application/json": { schema: CartSchema } },
        description: "Succesfully delete cart item",
      },
      400: {
        description: "Failed to delete itom from cart",
      },
    },
  },
  async (c) => {
    try {
      const cartItemId = c.req.param("cart_item_id");
      console.log("🚀 ~ cartItemId:", cartItemId);
      const user = c.get("user");
      const cart = await prisma.cart.findFirst({
        where: { userId: user.id },
        include: { items: { include: { product: true } } },
      });

      if (!cart) {
        return c.json({ message: "Cart not found" }, 400);
      }

      const deleteCartItem = await prisma.cartItem.delete({
        where: {
          id: cartItemId,
        },
      });

      return c.json(deleteCartItem, 200);
    } catch (error) {
      console.log(error);
      return c.json({ message: error }, 404);
    }
  }
);

// Update cart/update
cartRoute.openapi(
  {
    method: "patch",
    path: "/items/{cart_item_id}",
    request: {
      headers: AuthHeaderSchema,
      params: ParamsCartItemById,
      body: {
        content: { "application/json": { schema: UpdateCartItemSchema } },
      },
    },
    middleware: checkAuthorized,
    responses: {
      200: {
        content: { "application/json": { schema: CartSchema } },
        description: "Succesfully update cart item",
      },
      404: {
        description: "Failed to update item from cart",
      },
    },
  },
  async (c) => {
    try {
      const body = c.req.valid("json");
      const user = c.get("user");
      const cartItemId = c.req.param("cart_item_id");
      const cart = await prisma.cart.findFirst({
        where: { userId: user.id },
        include: { items: { include: { product: true } } },
      });

      if (!cart) {
        return c.json({ message: "Cart not found" }, 400);
      }

      const cartItemAvailable: CartItem[] = cart.items.filter(
        (item) => item.product.id === cartItemId
      );

      if (cartItemAvailable.length > 0) {
        // update data prisma on here
        const updatedCartItem = await prisma.cartItem.update({
          where: { id: cartItemAvailable[0].id },
          data: {
            quantity: body.quantity,
          },
        });

        return c.json(updatedCartItem);
      } else {
        return c.json({ message: "Item from cart not found" }, 404);
      }
    } catch (error) {
      console.error(error, 404);
      return c.json({ message: error }, 404);
    }
  }
);
