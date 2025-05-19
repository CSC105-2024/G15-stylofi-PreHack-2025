/*
  Warnings:

  - You are about to drop the column `tagId` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `postId` on the `Tag` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Post` DROP COLUMN `tagId`;

-- AlterTable
ALTER TABLE `Tag` DROP COLUMN `postId`;
