import { OpenAPIHono, z } from "@hono/zod-openapi";
import {
  AuthHeaderSchema,
  AuthLoginSchema,
  AuthLoginSuccessSchema,
  AuthMeSchema,
  AuthRegisterSchema,
} from "./schema";
import { prisma } from "../../lib/prisma";
import { PrivateUserSchema } from "../user/schema";
import { hashPassword, verifyPassword } from "../../lib/password";
import { signToken, verifyToken } from "../../lib/token";
import { checkAuthorized } from "./middleware";

export const authRoute = new OpenAPIHono();

// TODO: Double email
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
    method: "post",
    path: "/login",
    request: {
      body: {
        content: { "application/json": { schema: AuthLoginSchema } },
      },
    },
    responses: {
      200: {
        content: { "application/json": { schema: AuthLoginSuccessSchema } },
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
    if (!user) {
      return c.notFound();
    }
    if (!user.password) {
      return c.notFound();
    }

    const isPasswordMatch = await verifyPassword(
      body.password,
      user.password.hash
    );

    if (!isPasswordMatch) {
      return c.json({ message: "Password Invalid" }, 400);
    }

    const token = await signToken(user.id);

    return c.json({ token });
  }
);

authRoute.openapi(
  {
    method: "get",
    path: "/me",
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
    return c.json(user);
  }
);
