-- DropForeignKey
ALTER TABLE "public"."Password" DROP CONSTRAINT "Password_id_fkey";

-- AddForeignKey
ALTER TABLE "public"."Password" ADD CONSTRAINT "Password_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
