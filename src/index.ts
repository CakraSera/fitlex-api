import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { cors } from "hono/cors";
import { productListSchema } from "./modules/product/schema";
import { Scalar } from "@scalar/hono-api-reference";

const prisma = new PrismaClient();

const app = new OpenAPIHono();
app.use(cors());

const route = createRoute({
  method: "get",
  path: "/products",
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
});

app.openapi(route, async (c) => {
  const products = await prisma.product.findMany({
    orderBy: {
      name: "asc",
    },
  });
  return c.json(products);
});

// The OpenAPI documentation will be available at /doc
app.doc("/openapi.json", {
  openapi: "3.0.0",
  info: {
    version: "1.0.0",
    title: "Fitlex API",
    description: "API for the Fitlex website",
  },
});

// Use the middleware to serve the Scalar API Reference at /scalar
app.get("/", Scalar({ url: "/openapi.json", theme: "kepler" }));

export default app;
