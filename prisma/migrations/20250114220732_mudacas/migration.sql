/*
  Warnings:

  - A unique constraint covering the columns `[reference]` on the table `Product` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Product_reference_key" ON "Product"("reference");
