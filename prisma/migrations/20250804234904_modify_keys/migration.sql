/*
  Warnings:

  - You are about to drop the column `featured_product` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `image_url` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `stock_quantity` on the `Product` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Product" DROP COLUMN "featured_product",
DROP COLUMN "image_url",
DROP COLUMN "stock_quantity",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "featuredProduct" BOOLEAN DEFAULT false,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "stockQuantity" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "price" SET DEFAULT 0;
