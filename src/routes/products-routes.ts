import { OpenAPIHono } from "@hono/zod-openapi";
import { productListSchema, productSchema } from "../modules/product/schema";
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

productsRoutes.openapi(
  {
    method: "get",
    path: "/{slug}",
    parameters: [
      {
        name: "slug",
        in: "path",
        required: true,
        schema: {
          type: "string",
          description: "The slug of the product to retrieve",
          example: "collapsible-kettlebell",
        },
      },
    ],
    responses: {
      200: {
        description: "Product by slug",
        content: {
          "application/json": {
            schema: productSchema,
          },
        },
      },
    },
  },
  async (c) => {
    const slug = c.req.param("slug");
    const product = await prisma.product.findUnique({
      where: { slug },
    });

    if (!product) {
      return c.json(404);
    }

    return c.json(product);
  }
);
