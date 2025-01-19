-- AlterEnum
ALTER TYPE "Size" ADD VALUE 'U';

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "quantity" INTEGER NOT NULL DEFAULT 0;
