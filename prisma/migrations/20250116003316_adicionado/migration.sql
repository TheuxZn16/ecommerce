/*
  Warnings:

  - You are about to drop the column `product_id` on the `Conditional` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `Conditional` table. All the data in the column will be lost.
  - You are about to drop the column `especify_id` on the `Photo` table. All the data in the column will be lost.
  - You are about to drop the `Specificity` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userId` to the `Conditional` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product_id` to the `Photo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ProductsSold_id` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `color` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `conditional_id` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `size` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Conditional" DROP CONSTRAINT "Conditional_product_id_fkey";

-- DropForeignKey
ALTER TABLE "Conditional" DROP CONSTRAINT "Conditional_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Photo" DROP CONSTRAINT "Photo_especify_id_fkey";

-- DropForeignKey
ALTER TABLE "Specificity" DROP CONSTRAINT "Specificity_product_id_fkey";

-- AlterTable
ALTER TABLE "Conditional" DROP COLUMN "product_id",
DROP COLUMN "user_id",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Photo" DROP COLUMN "especify_id",
ADD COLUMN     "product_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "ProductsSold_id" INTEGER NOT NULL,
ADD COLUMN     "color" TEXT NOT NULL,
ADD COLUMN     "conditional_id" INTEGER NOT NULL,
ADD COLUMN     "sallerId" INTEGER,
ADD COLUMN     "size" TEXT NOT NULL;

-- DropTable
DROP TABLE "Specificity";

-- CreateTable
CREATE TABLE "Saller" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Saller_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductsSold" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "seller_id" INTEGER NOT NULL,
    "sold_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductsSold_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Saller_email_key" ON "Saller"("email");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_conditional_id_fkey" FOREIGN KEY ("conditional_id") REFERENCES "Conditional"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_ProductsSold_id_fkey" FOREIGN KEY ("ProductsSold_id") REFERENCES "ProductsSold"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_sallerId_fkey" FOREIGN KEY ("sallerId") REFERENCES "Saller"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Photo" ADD CONSTRAINT "Photo_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductsSold" ADD CONSTRAINT "ProductsSold_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductsSold" ADD CONSTRAINT "ProductsSold_seller_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "Saller"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conditional" ADD CONSTRAINT "Conditional_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
