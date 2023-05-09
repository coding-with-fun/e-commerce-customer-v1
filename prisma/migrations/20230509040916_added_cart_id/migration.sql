/*
  Warnings:

  - Added the required column `cartId` to the `cart` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `cart` DROP FOREIGN KEY `cart_customerId_fkey`;

-- AlterTable
ALTER TABLE `cart` ADD COLUMN `cartId` VARCHAR(191) NOT NULL,
    MODIFY `customerId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `cart` ADD CONSTRAINT `cart_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `customer`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
