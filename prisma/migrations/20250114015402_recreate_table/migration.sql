/*
  Warnings:

  - You are about to drop the column `supplier_id` on the `Conditional` table. All the data in the column will be lost.
  - Added the required column `product_id` to the `Conditional` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `birthday` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Conditional" DROP CONSTRAINT "Conditional_supplier_id_fkey";

-- AlterTable
ALTER TABLE "Conditional" DROP COLUMN "supplier_id",
ADD COLUMN     "product_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "birthday",
ADD COLUMN     "birthday" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "cpf" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "Conditional" ADD CONSTRAINT "Conditional_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
