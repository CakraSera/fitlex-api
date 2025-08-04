import { OpenAPIHono } from "@hono/zod-openapi";
import { productListSchema } from "../modules/product/schema";
import { prisma } from "../lib/prisma";

export const productsRoutes = new OpenAPIHono();

productsRoutes.openapi(
  {
    method: "get",
    path: "/",
    responses: {
      200: {
        description: "List of products",
        content: {
          "application/json": {
            schema: productListSchema,
          },
        },
      },
    },
  },
  async (c) => {
    const products = await prisma.product.findMany({
      orderBy: {
        name: "asc",
      },
    });
    return c.json(products);
  }
);
