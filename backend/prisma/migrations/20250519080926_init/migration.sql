/*
  Warnings:

  - You are about to drop the column `passwordId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Password` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Password` DROP FOREIGN KEY `Password_userId_fkey`;

-- AlterTable
ALTER TABLE `Post` MODIFY `likes` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `passwordId`,
    ADD COLUMN `password` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `Password`;
