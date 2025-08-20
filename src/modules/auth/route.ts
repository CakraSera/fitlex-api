import { OpenAPIHono, z } from "@hono/zod-openapi";
import { AuthRegisterSchema } from "./schema";
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
      200: {
        description: "List of Users",
        content: { "application/json": { schema: PrivateUserSchema } },
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
          passwords: {
            create: {
              hash: await hashPassword(body.password),
            },
          },
        },
      });
      return c.json(body);
    } catch (error) {}
  }
);

// authRoute.openapi(
//   {
//     method: "get",
//     path: "/{id}",
//     request: {
//       params: z.object({
//         id: UsersIdSchema,
//       }),
//     },
//     responses: {
//       200: {
//         description: "User by ID",
//         content: {
//           "application/json": {
//             schema: PublicUserSchema,
//           },
//         },
//       },
//       404: { description: "404 not found" },
//     },
//   },
//   async (c) => {
//     const id = c.req.param("id");
//     const user = await prisma.user.findUnique({
//       where: { id },
//       omit: {
//         email: true,
//       },
//     });
//     if (!user) {
//       return c.json(404);
//     }
//     return c.json(user);
//   }
// );
