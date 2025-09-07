-- DropForeignKey
ALTER TABLE "public"."Cart" DROP CONSTRAINT "Cart_id_fkey";

-- AddForeignKey
ALTER TABLE "public"."Cart" ADD CONSTRAINT "Cart_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
