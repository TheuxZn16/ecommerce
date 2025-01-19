/*
  Warnings:

  - Changed the type of `state` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "State" AS ENUM ('AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'PA', 'PR', 'PB', 'PE', 'PI', 'RN', 'RO', 'RR', 'SE', 'TO');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "state",
ADD COLUMN     "state" "State" NOT NULL;
