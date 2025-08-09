import { dataProducts } from "./data/products";
import { dataCategories } from "./data/categories";
import { createSlug } from "../src/lib/slug";
import { PrismaClient } from "../src/generated/prisma";
const prisma = new PrismaClient();

async function main() {
  await seedCategories();
  await seedProducts();
}

async function seedCategories() {
  const nameToId = new Map<string, string>();

  for (const category of dataCategories) {
    const slugCategory = createSlug(category.name);
    const upserted = await prisma.category.upsert({
      where: { slug: slugCategory },
      create: {
        ...category,
        slug: slugCategory,
      },
      update: {},
    });
    console.info(`🗂️  Upserted category: ${upserted.name}`);
  }

  return nameToId;
}

async function seedProducts() {
  for (const product of dataProducts) {
    const slug = createSlug(product.name);

    const upsertProduct = await prisma.product.upsert({
      where: { slug },
      update: {},
      create: {
        ...product,
        slug,
        Category: {
          connect: {
            slug: createSlug(product.category),
          },
        },
      },
    });
    console.info(`🏋️‍♂️ Inserted or updated product: ${upsertProduct.name}`);
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
