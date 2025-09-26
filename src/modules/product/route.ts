import { OpenAPIHono, z } from "@hono/zod-openapi";
import {
  productListSchema,
  productQueryParamsSchema,
  productSchema,
  productSlugSchema,
} from "./schema";
import { prisma } from "../../lib/prisma";

export const productsRoute = new OpenAPIHono();

productsRoute.openapi(
  {
    method: "get",
    path: "/",
    request: {
      query: productQueryParamsSchema,
    },
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
    const q = c.req.query("q") ? c.req.query("q") : "";

    const products = await prisma.product.findMany({
      where: {
        name: {
          contains: q,
          mode: "insensitive",
        },
      },
      orderBy: {
        name: "asc",
      },
    });
    return c.json(products);
  }
);

productsRoute.openapi(
  {
    method: "get",
    path: "/featured",
    responses: {
      200: {
        description: "Featured products",
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
      where: {
        featuredProduct: true,
      },
      select: {
        id: true,
        slug: true,
        name: true,
        price: true,
        featuredProduct: true,
        imageUrls: true,
        stockQuantity: true,
        description: true,
        category: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return c.json(products);
  }
);

productsRoute.openapi(
  {
    method: "get",
    path: "/{slug}",
    request: {
      params: z.object({
        slug: productSlugSchema,
      }),
    },
    responses: {
      200: {
        description: "Product by slug",
        content: {
          "application/json": {
            schema: productSchema,
          },
        },
      },
      404: {
        description: "Product not found",
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

// Get Categories
