import { OpenAPIHono, z } from "@hono/zod-openapi";
import { prisma } from "../../lib/prisma";
import { checkAuthorized } from "../auth/middleware";
import { CartSchema } from "./schema";

export const cartRoute = new OpenAPIHono();

cartRoute.openapi(
  {
    method: "get",
    path: "/",
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
    const users = await prisma.cart.findFirst({
      where: { userId: user.id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
    return c.json(users);
  }
);

cartRoute.openapi(
  {
    method: "get",
    path: "/{id}",
    request: {
      params: UsersIdSchema,
    },
    responses: {
      200: {
        description: "User by ID",
        content: {
          "application/json": {
            schema: PublicUserSchema,
          },
        },
      },
      404: { description: "404 not found" },
    },
  },
  async (c) => {
    const id = c.req.param("id");
    const user = await prisma.user.findUnique({
      where: { id },
      omit: {
        email: true,
      },
    });
    if (!user) {
      return c.json(404);
    }
    return c.json(user);
  }
);
