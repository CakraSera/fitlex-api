import { Hono } from "hono";
import { PrismaClient } from "./generated/prisma";
const prisma = new PrismaClient();

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.get("/products", async (c) => {
  const products = await prisma.product.findMany({
    orderBy: {
      name: "asc",
    },
  });
  if (!products) return c.json(404);
  return c.json(products);
});

export default app;
