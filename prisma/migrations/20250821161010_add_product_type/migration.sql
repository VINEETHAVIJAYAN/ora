/*
  Warnings:

  - The `type` column on the `products` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "public"."ProductType" AS ENUM ('CHAIN', 'EARINGS', 'BANGLES');

-- AlterTable
ALTER TABLE "public"."products" DROP COLUMN "type",
ADD COLUMN     "type" "public"."ProductType";
