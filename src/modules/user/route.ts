import { OpenAPIHono, z } from "@hono/zod-openapi";
import { UsersSchema } from "./schema";
import { prisma } from "../../lib/prisma";

export const userRoute = new OpenAPIHono();

userRoute.openapi(
  {
    method: "get",
    path: "/",
    responses: {
      200: {
        description: "List of Users",
        content: { "application/json": { schema: UsersSchema } },
      },
    },
  },
  async (c) => {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        fullName: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return c.json(users);
  }
);
