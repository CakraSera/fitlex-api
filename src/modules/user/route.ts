import { OpenAPIHono, z } from "@hono/zod-openapi";
import {
  PrivateUserSchema,
  PublicUserSchema,
  UsersIdSchema,
  UsersSchema,
} from "./schema";
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

userRoute.openapi(
  {
    method: "get",
    path: "/{id}",
    request: {
      params: z.object({
        id: UsersIdSchema,
      }),
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
