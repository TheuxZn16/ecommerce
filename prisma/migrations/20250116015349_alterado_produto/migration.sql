-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_ProductsSold_id_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_conditional_id_fkey";

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "ProductsSold_id" DROP NOT NULL,
ALTER COLUMN "conditional_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_conditional_id_fkey" FOREIGN KEY ("conditional_id") REFERENCES "Conditional"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_ProductsSold_id_fkey" FOREIGN KEY ("ProductsSold_id") REFERENCES "ProductsSold"("id") ON DELETE SET NULL ON UPDATE CASCADE;
