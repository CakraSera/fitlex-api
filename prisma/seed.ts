import { dataProducts } from "../data/products";
import { createSlug } from "../lib/slug";
import { PrismaClient } from "../src/generated/prisma";
const prisma = new PrismaClient();

async function main() {
  await insertProducts();
}

async function insertProducts() {
  for (const product of dataProducts) {
    const upsertProduct = await prisma.product.upsert({
      where: {
        slug: product.slug,
      },
      update: {},
      create: {
        ...product,
        slug: createSlug(product.name),
      },
    });
    console.info(`Inserted or updated product: ${upsertProduct.name}`);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
