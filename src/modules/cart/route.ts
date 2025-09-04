import { OpenAPIHono, z } from "@hono/zod-openapi";
import { AuthHeaderSchema, AuthMeSchema } from "../auth/schema";
import { checkAuthorized } from "./middleware";
import { prisma } from "../../lib/prisma";

export const cartRoute = new OpenAPIHono();

cartRoute.openapi(
  {
    method: "get",
    path: "/",
    request: { headers: AuthHeaderSchema },
    middleware: checkAuthorized,
    responses: {
      200: {
        content: { "application/json": { schema: AuthMeSchema } },
        description: "Get authenticated user success",
      },
      400: {
        description: "User not found",
      },
    },
  },
  async (c) => {
    const user = c.get("user");
    const cart = await prisma.cart.findUnique({
      where:{items:}
    })
    return c.json(user);
  }
);
