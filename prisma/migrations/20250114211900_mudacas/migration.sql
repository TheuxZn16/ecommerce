/*
  Warnings:

  - You are about to drop the column `product_id` on the `Photo` table. All the data in the column will be lost.
  - You are about to drop the column `color` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `size` on the `Product` table. All the data in the column will be lost.
  - Added the required column `especify_id` to the `Photo` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Photo" DROP CONSTRAINT "Photo_product_id_fkey";

-- AlterTable
ALTER TABLE "Photo" DROP COLUMN "product_id",
ADD COLUMN     "especify_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "color",
DROP COLUMN "size";

-- CreateTable
CREATE TABLE "Specificity" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "color" TEXT NOT NULL,
    "size" TEXT NOT NULL,

    CONSTRAINT "Specificity_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Specificity" ADD CONSTRAINT "Specificity_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Photo" ADD CONSTRAINT "Photo_especify_id_fkey" FOREIGN KEY ("especify_id") REFERENCES "Specificity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
