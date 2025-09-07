import { OpenAPIHono } from "@hono/zod-openapi";
import { cors } from "hono/cors";
import { HTTPException } from "hono/http-exception";
import { logger } from "hono/logger";
import { Scalar } from "@scalar/hono-api-reference";
import z, { ZodError } from "zod";
import { Prisma } from "./generated/prisma";

// Import routes
import { productsRoute } from "./modules/product/route";
import { userRoute } from "./modules/user/route";
import { authRoute } from "./modules/auth/route";
import { cartRoute } from "./modules/cart/routes";

import { productsRoute } from "./modules/product/route";
import { userRoute } from "./modules/user/route";
import { cartRoute } from "./modules/cart/route";

const app = new OpenAPIHono();

app.use(cors());
app.use(logger());

app.onError((error, c) => {
  if (error instanceof HTTPException) {
    return c.json({ kind: "hono", error: error }, 400);
  }

  if (error instanceof ZodError) {
    const zodErrorPretty = z.prettifyError(error);
    return c.json({ kind: "zod", error: zodErrorPretty }, 400);
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return c.json({ kind: "prisma", error: error }, 400);
  }

  return c.json({ error: "An unexpected error occurred" }, 500);
});
// List Routes
app.route("/products", productsRoute);
app.route("/users", userRoute);
app.route("/auth", authRoute);
app.route("/cart", cartRoute);

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
