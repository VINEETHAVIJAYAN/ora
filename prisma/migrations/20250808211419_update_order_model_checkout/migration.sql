/*
  Warnings:

  - You are about to drop the column `total` on the `order_items` table. All the data in the column will be lost.
  - You are about to drop the column `addressId` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `shipping` on the `orders` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_addressId_fkey";

-- AlterTable
ALTER TABLE "order_items" DROP COLUMN "total";

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "addressId",
DROP COLUMN "shipping",
ADD COLUMN     "shippingAddress" TEXT,
ADD COLUMN     "shippingCost" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE "loyalty_points" ADD CONSTRAINT "loyalty_points_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;
