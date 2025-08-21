import { OpenAPIHono, z } from "@hono/zod-openapi";
import { AuthLoginSchema, AuthRegisterSchema } from "./schema";
import { prisma } from "../../lib/prisma";
import { PrivateUserSchema } from "../user/schema";
import { hashPassword } from "../../lib/password";

export const authRoute = new OpenAPIHono();

authRoute.openapi(
  {
    method: "post",
    path: "/register",
    request: {
      body: {
        description: "",
        content: { "application/json": { schema: AuthRegisterSchema } },
      },
    },
    responses: {
      201: {
        description: "Private Data User",
        content: { "application/json": { schema: PrivateUserSchema } },
      },
      400: {
        description: "Register user failed",
      },
    },
  },
  async (c) => {
    try {
      const body = c.req.valid("json");

      const user = await prisma.user.create({
        data: {
          email: body.email,
          fullName: body.fullName,
          username: body.username,
          password: {
            create: {
              hash: await hashPassword(body.password),
            },
          },
        },
      });

      return c.json(user, 201);
    } catch (error) {
      return c.json({ message: "Register user failed" }, 400);
    }
  }
);

authRoute.openapi(
  {
    method: "get",
    path: "/login",
    request: {
      body: {
        content: { "application/json": { schema: AuthLoginSchema } },
      },
    },
    responses: {
      200: {
        content: { "application/json": { schema: AuthLoginSchema } },
        description: "Login Success",
      },
      400: { description: "Login Failed" },
    },
  },
  async (c) => {
    const body = c.req.valid("json");
    const user = await prisma.user.findUnique({
      where: { email: body.email },
      include: {
        password: true,
      },
    });
    console.log(user);
    if (!user) {
      return c.json(400);
    }
    return c.json(user);
  }
);
