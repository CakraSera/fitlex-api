import { dataProducts } from "./data/products";
import { dataCategories } from "./data/categories";
import { createSlug } from "../src/lib/slug";
import { PrismaClient } from "../src/generated/prisma";
import { generateSku } from "../src/lib/generate-sku";
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
      update: {
        ...category,
        slug: slugCategory,
      },
    });
    console.info(`🗂️  Inserted or updated category: ${upserted.name}`);
  }

  return nameToId;
}

async function seedProducts() {
  for (const product of dataProducts) {
    const { name: categoryName } = await prisma.category.findUniqueOrThrow({
      where: { slug: createSlug(product.category) },
      select: {
        name: true,
      },
    });

    const sku = generateSku(categoryName);
    const slug = createSlug(product.name);

    const upsertProduct = await prisma.product.upsert({
      where: { slug },
      update: {
        ...product,
        slug,
        Category: {
          connect: {
            slug: createSlug(product.category),
          },
        },
      },
      create: {
        ...product,
        sku,
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
