import { z } from "zod";

export const productSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  price: z.number(),
  featuredProduct: z.boolean().optional(),
  imageUrl: z.string().optional(),
  stockQuantity: z.number().optional(),
});

export const productListSchema = z.array(productSchema);
