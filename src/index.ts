import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { cors } from "hono/cors";
import { productListSchema } from "./modules/product/schema";
import { Scalar } from "@scalar/hono-api-reference";
import { productsRoutes } from "./routes/products-routes";

const app = new OpenAPIHono();
app.use(cors());

// List Routes
app.route("/products", productsRoutes);

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
app.get(
  "/",
  Scalar({ url: "/openapi.json", title: "Fitlex API", theme: "kepler" })
);

export default app;
