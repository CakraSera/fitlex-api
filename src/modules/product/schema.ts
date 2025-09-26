import { z } from "@hono/zod-openapi";

export const productQueryParamsSchema = z.object({
  q: z.string().min(1).optional().openapi({
    description: "Search term to filter products by name or description",
    example: "kettlebell",
  }),
});

export const productSchema = z.object({
  id: z.string().openapi({
    description: "The unique identifier for the product",
    example: "01H8MECHZX3TBDSZ7XRADM79XV",
  }),
  slug: z.string().openapi({
    description: "The slug for the product",
    example: "collapsible-kettlebell",
  }),
  name: z.string().openapi({
    description: "The name of the product",
    example: "Collapsible Kettlebell",
  }),
  price: z.number().openapi({
    description: "The price of the product",
    example: 10000,
  }),
  featuredProduct: z.boolean().openapi({
    description: "Whether the product is featured",
    example: true,
  }),
  imageUrls: z.array(
    z.string().nullable().optional().openapi({
      description: "The URL of the product image",
      example:
        "https://ucarecdn.com/44c7132b-a8dc-46cc-8d60-02aeba15dc3e/-/preview/200x200/",
    })
  ),
  stockQuantity: z.number().openapi({
    description: "The stock quantity of the product",
    example: 10,
  }),
  description: z.string().optional().openapi({
    description: "A brief description of the product",
    example: "A versatile kettlebell that can be collapsed for easy storage.",
  }),
});

export const productListSchema = z.array(productSchema);

export const productSlugSchema = z.string().openapi({
  description: "The slug of the product",
  example: "adjustable-dumbbells-set",
});
